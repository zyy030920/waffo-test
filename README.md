# 对词 · 多 Agent 时政翻译工坊

主工作台按《生成式AI与当代中国时政翻译》第一单元的工艺：

1. **Planner** 拆任务和风险
2. **Terminology** 用本地术语表锁规范译法
3. **Translator** 按 R–T–C–A–C 出初稿（可选三 Prompt 对比）
4. **Style** 校语域
5. **Risk** 扫六类风险
6. **人工总签**

模型走 **MiniMax**。没有 Key 时仍可看术语锁定和 Planner 预拆解。

「快译」页保留术语优先的英译中演示（Oracle 教材用例）。

原教材用的是 Dify + Oracle + DeepSeek。这里改成 Next.js 网页 + 本地 JSON 术语表 + MiniMax API，打开就能用。

## 放到自己的 GitHub

### 1. 本机已有这份代码时

```bash
cd <项目目录>
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/zyy030920/waffo-test.git
git branch -M main
git push -u origin main
```

若 GitHub 提示仓库里已有 README / 第一次提交，用：

```bash
git pull origin main --allow-unrelated-histories
# 如有冲突，保留本项目文件后
git push -u origin main
```

### 2. 本机还没有代码时

先从 Cursor 把工程下载下来（或复制整个项目文件夹，不要带 `node_modules`、`.next`），再执行上面的 `git remote add` 和 `git push`。

推成功后再克隆：

```bash
git clone https://github.com/zyy030920/waffo-test.git
cd waffo-test
```

需要 Node.js 20+ 和 npm。

### 3. 安装并启动

```bash
npm install
cp .env.example .env.local
```

编辑 `.env.local`，填国内 MiniMax Key（也可以不填，先看术语锁定）：

```
MINIMAX_API_KEY=sk-cp-你的密钥
MINIMAX_BASE_URL=https://api.minimaxi.com/v1
MINIMAX_MODEL=MiniMax-M3
```

国际账号把 Base URL 改成 `https://api.minimax.io/v1`。也可以不写环境变量，打开应用后到「设置」里粘贴 Key（只存在这台浏览器）。

```bash
npm run dev
```

浏览器打开 [http://127.0.0.1:43173](http://127.0.0.1:43173)。首页是五 Agent 工坊，`/fast` 是术语快译。

五 Agent 会连续调用 MiniMax，本机要能访问 `api.minimaxi.com`（或国际的 `api.minimax.io`）。

### 4. 以后只在本机改

```bash
git add .
git commit -m "你的说明"
git push origin main
```

之后用 Cursor 桌面打开本地的 `waffo-test` 文件夹即可。

没有 Key 时也可以：

- 管理术语表
- 用教材里的两个 Oracle 用例验证匹配
- 看到「术语锁定稿」

要出完整译文，在「设置」粘贴 MiniMax API Key，或写入环境变量 `MINIMAX_API_KEY`。国内默认接口是 `https://api.minimaxi.com/v1`，模型默认 `MiniMax-M3`。

## 页面

- `/` 五 Agent 时政工坊
- `/fast` 术语快译
- `/glossary` 术语表
- `/guide` 教材（原文章思路 + 这一版的对照）
- `/guide/dify` Dify + Oracle + MiniMax 逐步配置
- `/settings` MiniMax 配置

Oracle 脚本在 `sql/`：建术语表、匹配函数。

术语存在 `data/glossary.json`。预置了教材里的三条 TEST 术语：

| 术语 | 指定译文 |
| --- | --- |
| Oracle | 甲骨文中国 |
| Exadata Database Machine | 原厂Exadata数据库一体机 |
| Oracle Database Appliance | 原厂ODA数据库一体机 |
