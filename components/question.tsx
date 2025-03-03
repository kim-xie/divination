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
      alert('请填写内容')
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
          <label>您想算点什么？</label>
          <Textarea
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
                  className="cursor rounded-md border bg-secondary py-2 px-3 text-sm text-muted-foreground shadow transition hover:scale-[1.03] dark:border-0 dark:text-foreground/80 dark:shadow-none"
                >
                  {value}
                </span>
              );
            })}
          </div>
          {/* 损卦对财运的深度解析 */}
          <div className="flex w-100">
            <Button size="sm" onClick={startClick} className="w-screen">
              占卦
            </Button>
          </div>

          <label className="mt-6">
            占卜须知:
          </label>
          <div className="flex-col flex-wrap gap-3">
            {tipData.map(function (value, index) {
              return (
                <div
                  key={index}
                  className="text-sm text-muted-foreground mb-2"
                >
                  {value}
                </div>
              );
            })}
          </div>
          <div>
            <a className="text-green-600" href="https://www.bilibili.com/video/BV1aa4y1E7Au?spm_id_from=333.788.recommend_more_video.-1&vd_source=4e04f35a120ad570a54128776ee1adff">占卜原理</a>
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
