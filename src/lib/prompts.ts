import type { TermMatch, TranslateDirection } from "./types";
import { formatMatchedTerms } from "./glossary";

export function buildTranslationMessages(
  text: string,
  matches: TermMatch[],
  direction: TranslateDirection,
) {
  const target = direction === "zh-en" ? "英文" : "中文";
  const source = direction === "zh-en" ? "中文" : "英文";

  const system = [
    "你是一个专业的技术文档翻译助手。",
    "请识别指定术语并严格替换，同时将非术语部分自然翻译，最终组合成流畅、准确、可直接交付的译文。",
    "规则：",
    "1. 术语必须使用给定译法，不得意译、缩写或擅自改写。",
    "2. 优先匹配最长术语；同一片段已被更长术语占用时，不要再拆开翻译。",
    "3. 只输出最终译文，不要解释、不要标题、不要备注。",
    "4. 保持原文的语气、列表和段落结构。",
  ].join("\n");

  const user = [
    `请将以下${source}内容翻译为${target}：`,
    text,
    "",
    "需要替换的术语如下：",
    formatMatchedTerms(matches),
  ].join("\n");

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}

export function stripModelNoise(text: string) {
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<thinking>[\s\S]*?<\/thinking>/gi, "")
    .trim();
}
