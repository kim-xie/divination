import OpenAI from "openai";
// import { createOpenAI } from "@ai-sdk/openai";
const model = process.env.DS_MODEL ?? "deepseek-chat";
// const openai = createOpenAI({ baseURL: process.env.DS_BASE_URL, apiKey: process.env.DS_API_KEY });
let openai = null;


export async function getAnswer(prompt: string, guaMark: string, guaTitle: string, guaResult: string, guaChange: string) {
    console.log('params', prompt);
    console.log('guaMark', guaMark);
    console.log('guaTitle', guaTitle);
    console.log('guaResult', guaResult);
    console.log('guaChange', guaChange);

    try {
        const res = await fetch(
          `https://raw.githubusercontent.com/sunls2/zhouyi/main/docs/${guaMark}/index.md`,
        );
        const guaDetail = await res.text();
        const explain = guaDetail
          .match(/(\*\*台灣張銘仁[\s\S]*?)(?=周易第\d+卦)/)?.[1]
          .replaceAll("\n\n", "\n");
    
        const changeList: string[] = [];
        if (guaChange !== "无变爻") {
          guaChange
            .split(":")[1]
            .trim()
            .split(",")
            .forEach((change) => {
              const detail = guaDetail
                .match(`(\\*\\*${change}變卦[\\s\\S]*?)(?=${guaTitle}|$)`)?.[1]
                .replaceAll("\n\n", "\n");
              if (detail) {
                changeList.push(detail.trim());
              }
            });
        }
    
        const messages = [
            // {
            //   role: "system",
            //   content: `你是一位精通《周易》的AI助手，根据用户提供的卦象和问题，提供准确的卦象解读和实用建议
            //             任务要求：逻辑清晰，语气得当
            //             1. 解读卦象：分析主卦、变爻及变卦，解读整体趋势和吉凶
            //             2. 关联问题：针对用户问题，结合卦象信息，提供具体分析
            //             3. 提供建议：根据卦象启示，给出切实可行的建议，帮助用户解决实际问题`,
            // },
            {
              role: "user",
              content: `你是一位精通《周易》的AI助手，根据用户提供的卦象和问题，提供准确的卦象解读和实用建议
                        任务要求：逻辑清晰，语气得当
                        1. 解读卦象：分析主卦、变爻及变卦，解读整体趋势和吉凶
                        2. 关联问题：针对用户问题，结合卦象信息，提供具体分析
                        3. 提供建议：根据卦象启示，给出切实可行的建议，帮助用户解决实际问题,
                        我摇到的卦象：${guaTitle} ${guaResult} ${guaChange}
                        我的问题：${prompt}
                        ${explain}
                        ${changeList.join("\n")}`,
            },
        ]

        if(!openai){
            console.log('process.env.DS_BASE_URL',process.env.DS_BASE_URL);
            console.log('process.env.DS_API_KEY',process.env.DS_API_KEY);
            openai = await new OpenAI({
                baseURL: process.env.DS_BASE_URL,
                apiKey: process.env.DS_API_KEY,
                // dangerouslyAllowBrowser: true,
            });
        }
        
        const completion: any = await openai.chat.completions.create({
            messages,
            model: model, // R1: deepseek-reasoner V3: deepseek-chat
        }).catch((err: any) => {
            console.log('deepseek error', err);
            return { error: err.message?? err };
        });
        console.log(completion);
        return { data: completion.choices[0].message.content };
    } catch (err: any) {
        console.log('getAnswer error', err);
        return { error: err.message ?? err };
    }
}