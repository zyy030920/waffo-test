import Link from "next/link";

import { DEMO_EXAMPLES } from "@/lib/examples";

export function GuideArticle() {
  return (
    <article className="guide">
      <p className="text-muted-foreground text-sm tracking-[0.2em]">HANDS-ON LESSON</p>
      <h1 className="font-heading mt-3 text-3xl leading-tight md:text-5xl">
        手把手打造一个更懂你的个人翻译助手
      </h1>
      <p className="text-muted-foreground mt-4 text-sm leading-7">
        工坊按《生成式AI与当代中国时政翻译》第一单元工艺：五 Agent 流水 + 人工总签。
        术语快译仍保留 Alfred Zhao 那条「先锁术语再翻译」的线。Dify 版配置见{" "}
        <Link href="/guide/dify">逐步教程</Link>。
      </p>

      <section>
        <h2>多 Agent 怎么分工</h2>
        <ol>
          <li>
            <strong>Planner</strong>：拆语域、术语雷区和核验源，先写出「我担心什么」。
          </li>
          <li>
            <strong>Terminology</strong>：本地术语表最长匹配。时政域预置了 smart economy、&quot;AI Plus&quot;
            initiative、new quality productive forces 等规范译法。
          </li>
          <li>
            <strong>Translator</strong>：默认走 R–T–C–A–C 约束稿；可选三 Prompt 对比。
          </li>
          <li>
            <strong>Style</strong>：校语域、对仗、无主句是否补了 We will。
          </li>
          <li>
            <strong>Risk</strong>：扫术语、意义偏移、漏译增译、情态立场、语体、幻觉六类。
          </li>
        </ol>
        <p>
          最后一栏是人工总签。AI 可以出稿，责任主体是译者。通顺是底线，政策对位是天花板。
        </p>
        <p>
          打开 <Link href="/">工坊</Link>，用「智能经济 / 新质生产力 / 江山人民」三条例句即可走通。
          旧的 Oracle 术语演示在 <Link href="/fast">快译</Link>。
        </p>
      </section>

      <section>
        <h2>一、为什么不直接把原文丢给大模型？</h2>
        <p>
          通用模型已经很会翻译。真正麻烦的是私域术语：品牌怎么写、产品线怎么称呼、国内市场要不要加「原厂」或「中国」，这些模型默认不知道。
        </p>
        <p>
          如果每次翻译都把术语表塞进提示词，术语一更新就要改提示词；术语一多，提示词变长，也更容易幻觉。所以教材的核心不是「找一个更强的模型」，而是先建一张可维护的术语表。
        </p>
      </section>

      <section>
        <h2>二、这条流水线在做什么</h2>
        <ol>
          <li>把专业术语写进术语表，按业务域维护。</li>
          <li>用户贴上原文后，先在术语表里做最长匹配。</li>
          <li>命中的词强制使用指定译文。</li>
          <li>其余句子交给 MiniMax，要求它写成流畅中文。</li>
        </ol>
        <p>
          原教材用 Oracle 函数 <code>match_english_terms()</code> 做第二步，用 Dify 把「开始 → SQL → LLM → 结束」串起来。这里把 SQL 收成一段本地匹配，把 LLM 节点换成 MiniMax Chat Completions。
        </p>
      </section>

      <section>
        <h2>三、教材里的验证用例</h2>
        <p>
          为什么要把 Oracle 译成「甲骨文中国」？因为默认模型几乎不会这么写。这不是为了抬杠，而是快速证明：术语表真的压过了模型的默认习惯。
        </p>
        <div className="not-prose grid gap-3">
          {DEMO_EXAMPLES.map((example) => (
            <Link
              key={example.title}
              href={`/?q=${encodeURIComponent(example.text)}`}
              className="block rounded-2xl bg-[color:var(--sheet)] px-4 py-4 ring-1 ring-foreground/10 transition hover:ring-[color:var(--seal)]/40"
            >
              <p className="text-xs tracking-widest text-[color:var(--seal)]">{example.title}</p>
              <p className="mt-2 font-medium">{example.text}</p>
              <p className="text-muted-foreground mt-2 text-sm">期望方向：{example.expected}</p>
            </Link>
          ))}
        </div>
        <p className="mt-4">
          注意第二句里的 <strong>Oracle Database Appliance</strong>。如果先匹配短词 Oracle，后面的产品名就会被拆坏。所以必须最长术语优先。
        </p>
      </section>

      <section>
        <h2>四、原教材怎么搭，这一版怎么对应</h2>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>原教材</th>
                <th>这一版</th>
                <th>为什么换</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Oracle 术语表</td>
                <td>本地 <code>data/glossary.json</code></td>
                <td>个人使用不必先装数据库</td>
              </tr>
              <tr>
                <td>Dify 工作流</td>
                <td>Next.js 页面 + <code>/api/translate</code></td>
                <td>打开就能用，逻辑仍是四步</td>
              </tr>
              <tr>
                <td>DeepSeek</td>
                <td>MiniMax-M3</td>
                <td>按你的要求改成 MiniMax API</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>五、提示词为什么写得这么狠</h2>
        <p>系统提示沿用教材的意思，并补了一句「只输出译文」：</p>
        <pre>
{`你是一个专业的技术文档翻译助手。
请识别指定术语并严格替换，同时将非术语部分自然翻译。
术语必须使用给定译法。优先匹配最长术语。只输出最终译文。`}
        </pre>
        <p>
          用户侧会带上原文，以及匹配结果，格式接近教材里的「英文: Oracle; 中文: 甲骨文中国」。
        </p>
      </section>

      <section>
        <h2>六、你现在可以怎么用</h2>
        <ol>
          <li>
            打开 <Link href="/">翻译页</Link>，点「用例 1 / 用例 2」，看术语有没有被锁住。
          </li>
          <li>
            到 <Link href="/glossary">术语表</Link> 改成你自己的品牌、产品线和内部叫法。
          </li>
          <li>
            在 <Link href="/settings">设置</Link> 粘贴 MiniMax API Key。国内默认走
            <code> https://api.minimaxi.com/v1</code>。
          </li>
          <li>也可以把 Key 放到环境变量 <code>MINIMAX_API_KEY</code>，不用每次粘贴。</li>
        </ol>
        <p>
          没有 Key 时，助手仍会完成术语匹配，并给出一张「术语锁定稿」。这正好对应教材里那个可选的 END2 调试节点：先看术语抽对没有，再让模型润色。
        </p>
      </section>

      <p className="text-muted-foreground text-sm">
        原文章：
        <a
          href="https://www.cnblogs.com/jyzhao/p/19054638/shou-ba-shou-jiao-ni-da-zao-yi-ge-geng-dong-ni-dea"
          target="_blank"
          rel="noreferrer"
        >
          手把手教你打造一个更懂你的AI翻译助手
        </a>
      </p>
    </article>
  );
}
