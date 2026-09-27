# 🧙 概述

**AI 算卦：** 通过进行六次硬币的随机卜筮，生成卦象，并使用 AI 对卦象进行分析。

## ⚙️ 设置

#### 环境变量

- `SITE_URL`：网站正式域名，默认 `https://divination-gamma.vercel.app/`。用于首页 canonical、社交分享图片、WebSite 结构化数据和 sitemap。换域名时设为新的完整域名（不包含子路径），支持在运行时配置。
- `OPENAI_API_KEY`：不必多说，懂的都懂
- `OPENAI_BASE_URL`：自定义 API 接口地址，默认：`https://api.openai.com/v1`
- `OPENAI_MODEL`：自定义 OpenAI 模型，默认：`gpt-3.5-turbo`

#### SEO 上线检查

- 部署后检查 `/robots.txt` 和 `/sitemap.xml`，确认其中网址与正式域名一致。
- 在 Google Search Console 或 Bing Webmaster Tools 验证站点所有权并提交 `/sitemap.xml`。
- 预览部署保留 Vercel 的禁止索引设置；不要把 `SITE_URL` 改成临时预览地址。

#### 访问统计（Umami）

项目已在根布局接入 `components/umami.tsx`，无需重复添加统计脚本。

当前已默认配置 Umami Cloud，网站 ID 为 `917d9f97-0be8-41f7-a167-67890d46f0cc`，脚本地址为 `https://cloud.umami.is/script.js`。部署即可启用，默认只统计正式域名。以下环境变量可以覆盖默认值，用于更换统计网站或服务；网站 ID 是公开的跟踪标识，不是 API 密钥。

1. 在 Umami 后台添加网站，域名填写 `divination-gamma.vercel.app`。
2. 从该网站的跟踪代码复制 `data-website-id` 和脚本 `src`。
3. 在 Vercel 项目的 Settings → Environment Variables 配置以下变量，选择 Production 环境，然后重新部署：

| 变量            | 值                                                              |
| --------------- | --------------------------------------------------------------- |
| `UMAMI_ID`      | 跟踪代码中的 `data-website-id`                                  |
| `UMAMI_URL`     | 跟踪代码中的完整脚本 `src` 地址（包含 `/script.js` 等脚本路径） |
| `UMAMI_DOMAINS` | `divination-gamma.vercel.app`（不带协议和斜杠）                 |

4. 访问正式网站，回到 Umami 后台检查访问记录。若无数据，检查浏览器网络面板中统计脚本及上报请求是否成功。

`UMAMI_DOMAINS` 用于限制统计域名，避免将本地开发和预览站点计入正式数据。页面浏览会自动记录；“占卦”和“AI 解读”等按钮行为需要另加事件统计，目前未配置。

参考：[添加网站](https://docs.umami.is/docs/add-a-website)、[跟踪配置](https://docs.umami.is/docs/tracker-configuration)。

## 广告（Google AdSense）

根布局已异步加载 AdSense 脚本，并通过 Metadata 输出 `google-adsense-account` 验证标签，发布商 ID 为 `ca-pub-9639750615409415`；`public/ads.txt` 提供对应的授权记录，部署后可通过 `/ads.txt` 访问。

部署后在 AdSense 后台验证网站并提交审核。当前仅接入平台脚本，未添加手动广告位；自动广告需要在 AdSense 后台开启，实际展示取决于审核状态和平台设置。手动广告位还需要平台提供的 `data-ad-slot`。

## 🚀 本地运行

1. 克隆仓库：

```sh
git clone git@github.com:kim-xie/divination.git
```

2. 安装依赖项：

```bash
pnpm install
```

3. 本地运行：

```bash
# 设置环境变量 OPENAI_API_KEY=sk-xxx
touch .env.local
# 本地运行
pnpm run dev
```

## ☁️ 使用 Vercel 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsunls23%2Fdivination&env=OPENAI_API_KEY)

---

![screenshots](./docs/screenshots.jpg)
