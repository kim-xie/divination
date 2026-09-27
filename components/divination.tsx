"use client";
import React, { useEffect, useRef, useState } from "react";
import Coin from "@/components/coin";
import Hexagram, { HexagramObj } from "@/components/hexagram";
import { bool } from "aimless.js";
import Result, { ResultObj } from "@/components/result";
import Question from "@/components/question";
import ResultAI from "@/components/result-ai";
import { animateChildren } from "@/lib/animate";
import guaIndexData from "@/lib/data/gua-index.json";
import guaListData from "@/lib/data/gua-list.json";
import { getAnswer } from "@/app/server";
import { readStreamableValue } from "ai/rsc";
import { Button } from "./ui/button";
import { BrainCircuit, ListRestart } from "lucide-react";
import { ERROR_PREFIX } from "@/lib/constant";

const AUTO_DELAY = 600;

function Divination() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [completion, setCompletion] = useState<string>("");

  async function onCompletion() {
    setError("");
    setCompletion("");
    setIsLoading(true);
    try {
      const { data, error } = await getAnswer(
        question,
        resultObj!.guaMark,
        resultObj!.guaTitle,
        resultObj!.guaResult,
        resultObj!.guaChange,
      );
      if (error) {
        setError(error);
        return;
      }
      console.log('data: ', data);
      if (data) {
        // setCompletion(data);
        let ret = "";
        for await (const delta of readStreamableValue(data)) {
          if (delta.startsWith(ERROR_PREFIX)) {
            setError(delta.slice(ERROR_PREFIX.length));
            return;
          }
          ret += delta;
          setCompletion(ret);
        }
      }
    } catch (err: any) {
      setError(err.message ?? err);
    } finally {
      setIsLoading(false);
    }
  }

  const [frontList, setFrontList] = useState([true, true, true]);
  const [rotation, setRotation] = useState(false);

  const [hexagramList, setHexagramList] = useState<HexagramObj[]>([]);

  const [resultObj, setResultObj] = useState<ResultObj | null>(null);
  const [question, setQuestion] = useState("");

  const [resultAi, setResultAi] = useState(false);

  const flexRef = useRef<HTMLDivElement>(null);

  const [count, setCount] = useState(0);

  // 自动卜筮
  useEffect(() => {
    if (rotation || resultObj || count >= 6 || !question) {
      return;
    }
    setTimeout(startClick, AUTO_DELAY);
  }, [question, rotation]);

  useEffect(() => {
    if (!flexRef.current) {
      return;
    }
    const observer = animateChildren(flexRef.current);
    return () => observer.disconnect();
  }, []);

  function onTransitionEnd() {
    setRotation(false);
    // true 为3，false 为2 结果为：6，7，8，9
    let frontCount = frontList.reduce((acc, val) => (val ? acc + 3 : acc + 2), 0);
    setHexagramList((list) => {
      const newList = [
        ...list,
        {
          change: frontCount === 6 || frontCount === 9 || null,
          yang: [7,9].includes(frontCount),
          separate: list.length == 3,
        },
      ];
      setResult(newList);
      return newList;
    });
  }

  function startClick() {
    if (rotation) {
      return;
    }
    if (hexagramList.length >= 6) {
      setHexagramList([]);
    }
    setFrontList([bool(), bool(), bool()]);
    setRotation(true);
    setCount(count + 1);
  }

  async function testClick() {
    for (let i = 0; i < 6; i++) {
      onTransitionEnd();
    }
  }

  function restartClick() {
    setResultObj(null);
    setHexagramList([]);
    setQuestion("");
    setResultAi(false);
    setCount(0);
    stop();
  }

  function aiClick() {
    setResultAi(true);
    onCompletion();
  }

  function setResult(list: HexagramObj[]) {
    if (list.length != 6) {
      return;
    }
    // https://www.bilibili.com/video/BV1aa4y1E7Au?spm_id_from=333.788.recommend_more_video.-1&vd_source=4e04f35a120ad570a54128776ee1adff
    const guaDict1 = ["坤", "震", "坎", "兑", "艮", "离", "巽", "乾"];
    const guaDict2 = ["地", "雷", "水", "泽", "山", "火", "风", "天"];

    const changeYang = ["初九", "九二", "九三", "九四", "九五", "上九"];
    const changeYin = ["初六", "六二", "六三", "六四", "六五", "上六"];

    const changeList: String[] = [];
    list.forEach((value, index) => {
      if (!value.change) {
        return;
      }
      changeList.push(value.yang ? changeYang[index] : changeYin[index]);
    });

    // 卦的结果： 第X卦 X卦 XX卦 X上X下
    // 计算卦的索引，111对应乾卦，000对应坤卦，索引转为10进制。
    const upIndex =
      (list[5].yang ? 4 : 0) + (list[4].yang ? 2 : 0) + (list[3].yang ? 1 : 0);
    const downIndex =
      (list[2].yang ? 4 : 0) + (list[1].yang ? 2 : 0) + (list[0].yang ? 1 : 0);

    const guaIndex = guaIndexData[upIndex][downIndex] - 1;
    const guaName1 = guaListData[guaIndex];

    let guaName2;
    if (upIndex === downIndex) {
      // 上下卦相同，格式为X为X
      guaName2 = guaDict1[upIndex] + "为" + guaDict2[upIndex];
    } else {
      guaName2 = guaDict2[upIndex] + guaDict2[downIndex] + guaName1;
    }

    const guaDesc = guaDict1[upIndex] + "上" + guaDict1[downIndex] + "下";

    setResultObj({
      // 例：26.山天大畜
      guaMark: `${(guaIndex + 1).toString().padStart(2, "0")}.${guaName2}`,
      guaTitle: `周易第${guaIndex + 1}卦`,
      // 例：大畜卦(山天大畜)_艮上乾下
      guaResult: `${guaName1}卦(${guaName2}) ${guaDesc}`,
      guaChange:
        changeList.length === 0 ? "无变爻" : `变爻: ${changeList.toString()}`,
    });
  }

  const showResult = resultObj !== null;
  const inputQuestion = question === "";
  return (
    <main
      ref={flexRef}
      className="gap mx-auto flex h-0 w-[90%] flex-1 flex-col flex-nowrap items-center"
    >
      <Question question={question} setQuestion={setQuestion} />

      {!resultAi && !inputQuestion && (
        <Coin
          onTransitionEnd={onTransitionEnd}
          frontList={frontList}
          rotation={rotation}
        />
      )}

      {!inputQuestion && !showResult && (
        <div className="relative">
          <span className="pl-2 text-lg font-medium">
            🎲 第{" "}
            <span className="font-mono text-xl font-bold text-orange-500">
              {count === 0 ? "-/-" : `${count}/6`}
            </span>{" "}
            次卜筮
          </span>
        </div>
      )}

      {!inputQuestion && hexagramList.length != 0 && (
        <div className="flex w-full max-w-md flex-wrap justify-center gap-2">
          <Hexagram list={hexagramList} />
          {showResult && (
            <div className="flex max-w-full flex-col justify-around gap-3">
              <Result {...resultObj} />
              <div className="flex flex-col gap-2 sm:px-6">
                {/* <Button
                  size="sm"
                  variant="destructive"
                  onClick={restartClick}
                  disabled={rotation}
                >
                  <ListRestart size={18} className="mr-1" />
                  重来
                </Button> */}
                {resultAi ? null : (
                  <Button size="sm" onClick={aiClick} disabled={rotation}>
                    <BrainCircuit size={16} className="mr-1" />
                    AI 解读
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {resultAi && (
        <ResultAI
          completion={completion}
          isLoading={isLoading}
          onCompletion={onCompletion}
          error={error}
        />
      )}
    </main>
  );
}

export default Divination;
