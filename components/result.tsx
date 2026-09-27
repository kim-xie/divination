import React from "react";
import { ExternalLink } from "lucide-react";

export interface ResultObj {
  guaTitle: string;
  guaMark: string;
  guaResult: string;
  guaChange: string;
}

function Result(props: ResultObj) {
  return (
    <div className="flex flex-col items-start justify-center gap-2 sm:gap-3">
      {props.guaTitle}
      <a
        className="group flex flex-col items-start gap-1.5 rounded-sm border-l-4 border-blue-400/80 pl-2 text-blue-700 transition-colors hover:border-blue-500 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-blue-300 dark:hover:text-blue-200"
        href={`https://zhouyi.sunls.de/${props.guaMark}/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="text-sm font-medium underline decoration-blue-400/60 underline-offset-4 sm:text-base">
          {props.guaResult}
        </span>
        <span className="flex items-center gap-1 text-xs">
          查看卦象详解（新窗口）
          <ExternalLink size={12} aria-hidden="true" />
        </span>
      </a>
      <span className="text-sm italic text-muted-foreground">
        {props.guaChange}
      </span>
    </div>
  );
}

export default Result;
