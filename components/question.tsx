import React, { createRef } from "react";
import clsx from "clsx";
import todayJson from "@/lib/data/today.json";
import tipJson from "@/lib/data/tip.json";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

const todayData: string[] = todayJson;
const tipData: string[] = tipJson;

function Question(props: { question: string; setQuestion: any }) {
  const inputRef = createRef<HTMLTextAreaElement>();

  function startClick() {
    const value = inputRef.current?.value;
    if (value === "") {
      alert("请填写内容");
      return;
    }
    props.setQuestion(value);
  }

  function todayClick(index: number) {
    props.setQuestion(todayData[index]);
  }

  return (
    <div
      className={clsx(
        "ignore-animate flex w-full max-w-md flex-col gap-4",
        props.question || "pt-6",
      )}
    >
      {props.question === "" ? (
        <>
          <div>
            <h1 className="text-2xl font-semibold">
              AI 在线算卦与周易六爻解读
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              写下想探索的问题，赛博占卜通过六次三枚硬币模拟投掷生成卦象，展示本卦与变爻，并提供
              AI 解读。
            </p>
          </div>
          <label htmlFor="divination-question">您想算点什么？</label>
          <Textarea
            id="divination-question"
            ref={inputRef}
            placeholder="写下您要占卜之事，AI为您解读"
            className="resize-none"
            rows={4}
          />
          <div className="flex flex-wrap gap-3">
            {todayData.map(function (value, index) {
              return (
                <span
                  key={index}
                  onClick={() => {
                    todayClick(index);
                  }}
                  className="cursor rounded-md border bg-secondary px-3 py-2 text-sm text-muted-foreground shadow transition hover:scale-[1.03] dark:border-0 dark:text-foreground/80 dark:shadow-none"
                >
                  {value}
                </span>
              );
            })}
          </div>
          {/* 损卦对财运的深度解析 */}
          <div className="w-100 flex">
            <Button size="sm" onClick={startClick} className="w-screen">
              占卦
            </Button>
          </div>

          <h2 className="mt-6 font-medium">占卜须知:</h2>
          <div className="flex-col flex-wrap gap-3">
            {tipData.map(function (value, index) {
              return (
                <div key={index} className="mb-2 text-sm text-muted-foreground">
                  {value}
                </div>
              );
            })}
          </div>
          <section
            aria-labelledby="how-to-divine"
            className="text-sm text-muted-foreground"
          >
            <h2
              id="how-to-divine"
              className="mb-2 text-base font-medium text-foreground"
            >
              如何在线起卦？
            </h2>
            <ol className="list-decimal space-y-1 pl-5">
              <li>输入一个具体的问题，点击“占卦”。</li>
              <li>等待六次自动投掷完成，查看周易卦名与变爻。</li>
              <li>点击“AI 解读”，阅读结合问题与卦象生成的分析。</li>
            </ol>
          </section>
          <div>
            <a
              className="text-green-600"
              href="https://www.bilibili.com/video/BV1aa4y1E7Au?spm_id_from=333.788.recommend_more_video.-1&vd_source=4e04f35a120ad570a54128776ee1adff"
            >
              占卜原理
            </a>
          </div>
        </>
      ) : null}

      {props.question && (
        <div className="flex truncate rounded-md border bg-secondary p-2 shadow dark:border-0 dark:shadow-none">
          <Image
            width={24}
            height={24}
            className="mr-2"
            src="/img/yin-yang.webp"
            alt="yinyang"
          />
          {props.question}
        </div>
      )}
    </div>
  );
}

export default Question;
