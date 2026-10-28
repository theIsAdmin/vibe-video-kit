# Vibe Music Video｜让 agent 制作会唱、会动的中文 MV

从一个日常共鸣的小故事出发：写歌词、制作歌曲，再让双角色、手绘场景、道具和主歌词跟着真实演唱动起来。

本模块位于 Vibe Video Kit 仓库的 `vibe-music-video/` 子目录。下载整个仓库后，先进入该目录，再执行下方命令。独立项目的 `.github/workflows/check.yml` 随源码保留为配置示例；位于子目录时 GitHub 不会自动运行它，不能据此声称线上 CI 已通过。

示例《别播了》讲的是“人都躺下了，脑袋还在重播白天的尴尬”。成片 42.6 秒，1920×1080，30 fps。**只保留上方一处主歌词，唱到哪个字，哪个字弹起并回落。**

![示例画面](docs/images/example-frame.jpg)

## 直接把这段话发给你的 agent

下载或克隆整个仓库，解压后告诉 agent 项目文件夹位置：

```text
先阅读 AGENTS.md 和 skills/music-video/SKILL.md。
检查环境、安装项目声明的依赖，先运行《别播了》的短片段，
查看画面并验证声音、歌词和角色动作，再渲染完整示例。
最终给我 MP4、歌曲 MP3、视频音轨 MP3 和检查记录。
不要用静态占位图或无声样片冒充成片。
```

不需要你的 agent 支持某个专属插件。它需要本地文件和终端能力；查看成片需要图像/视频查看能力。**复现附带示例不需要登录、音乐 API、图像生成或 Whisper 模型。** 已附场景、角色姿态、字体、选用的原始歌曲、字级时码和音效设计。

创作新歌曲时，agent 还需要音乐生成服务和图像生成工具，或由你提供歌曲与插画。网站登录、模型下载和付费额度使用各自账户；仓库不附带任何账户或密钥。

## 环境与安装

- Node.js 22+、pnpm 10.28.2。
- Python 3.11+。
- FFmpeg、ffprobe：加入 PATH，需包含 `libmp3lame`。
- Chrome/Chromium：自动发现常见安装位置；找不到时 Remotion 会从官方源下载 Chrome Headless Shell。也可设置 `CHROME_EXECUTABLE`。

Windows PowerShell：

```powershell
corepack enable
corepack prepare pnpm@10.28.2 --activate
pnpm install --frozen-lockfile
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
pnpm doctor
pnpm preview --out outputs/first-preview
pnpm serve --out outputs/first-preview --port 8800
```

macOS / Linux：

```bash
corepack enable
corepack prepare pnpm@10.28.2 --activate
pnpm install --frozen-lockfile
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
pnpm doctor
pnpm preview --out outputs/first-preview
pnpm serve --out outputs/first-preview --port 8800
```

打开终端打印的本机网址。完成短片段检查后，另开终端运行：

```bash
pnpm demo --out outputs/biebole-final
pnpm verify --file outputs/biebole-final/video.mp4
pnpm serve --out outputs/biebole-final --port 8801
```

`--out` 必须是新目录，已有结果不会被覆盖。完整 1278 帧比短片段耗时长，取决于 CPU、浏览器和内存；默认并发 2，可用 `--concurrency 1` 降低内存占用。第一次安装依赖或下载浏览器需要联网；依赖和浏览器就绪后，附带示例的渲染可在本地完成。

如 `corepack` 不可用，可从 pnpm 官方安装文档安装同一版本，再继续。FFmpeg 安装方法、Linux 浏览器库和常见错误见 [故障排查](docs/TROUBLESHOOTING.md)。本项目不自动修改系统设置。

## 最终会得到什么

| 文件 | 内容 |
|---|---|
| `video.mp4` | H.264 + AAC 完整成片，含歌曲和轻量动作音效 |
| `music.mp3` | 与此次导出片段对应的纯歌曲剪辑 |
| `video-audio.mp3` | 成片音轨，含动作音效 |
| `song-original.mp3` | 原始歌曲，时长可与成片不同 |
| `index.html` | 本地审阅页：播放、逐帧、慢速、歌词定位 |
| `storyboard.jpg`、`frames/` | 从此次真实导出视频抽取的关键帧 |
| `report.json` | 编码、时长、帧数、完整解码与 SHA-256 记录 |
| `render.json`、`timing.json` | 导出范围与歌词时间线 |

预览导出只有约 4.17 秒，文件结构相同，但不会被称为完整示例。报告中的 `subjective_listening_performed` 不会因成功解码就自动变成 true。

## 做你自己的新主题

可以把这段话交给 agent：

```text
使用这个仓库制作一支新的中文歌曲 MV，主题是“周末刚开始就快结束了”。
先读 AGENTS.md 和 skills/music-video/SKILL.md。
用一个具体、好笑、能共鸣的日常事件写歌词，做好有记忆点的歌曲，
取得真实演唱音频后再编排分镜。双角色、手绘场景、道具与动作都要服务剧情，
上方主歌词按真实字级时码逐字跳动。先检查关键帧和一段带音乐的动画，
效果合适后完成整片，并交付歌曲、成片、四种比例封面和分类发布标签。
```

流程与素材提示词：[制作指南](docs/CREATING.md)、[分镜/时码结构](docs/PROJECT_FORMAT.md)、[图像提示词](docs/art-prompts.json)。

新歌不是替换示例的音频文件就结束了：**必须重新对齐演唱时码、改写分镜和动作、调整角色/道具、重做音效落点。** 示例的十段剧情是为《别播了》专门编排的。`pnpm new` 只创建草稿，未完成适配时渲染会拒绝运行。

MiniMax 官方文档在 2026-10-28 查阅时说明音乐付费 API 已不向新用户提供，免费音乐接口也已停止服务；可用[官方音乐网页](https://www.minimax.cn/audio/music)、已有可用服务或自己提供的歌曲。[官方说明](https://platform.minimax.cn/docs/guides/music-generation)。不承诺新用户有免费额度，不把网页登录等同于 API 权限。

## 项目结构

```text
AGENTS.md                    agent 的入口和验收要求
skills/music-video/          可直接加载的制作 skill
examples/biebole/             能完整复现的歌曲、素材、分镜、字级时码
src/                         Canvas/Remotion 入口与绘图工具
scripts/                     诊断、渲染、音效混音、对齐、检查、打包
docs/                        创作、参数、故障排查、GitHub 发布步骤
licenses/                    两款字体的原始 OFL 许可证
projects/                    你的新项目（默认忽略，不会误上传）
outputs/                     每次渲染产物（默认忽略）
```

## 开源与署名

代码和文档采用 [MIT](LICENSE)。示例插画、歌词和音乐的范围、AI 生成说明、字体与 Remotion 条款分别见 [THIRD_PARTY.md](THIRD_PARTY.md)。不能把代码的 MIT 许可证当作对所有第三方服务或所有新生成音乐的使用保证。请保留示例音乐的原始标识与来源说明。

准备发布到自己的 GitHub：[发布步骤](docs/PUBLISHING.md)。源码 ZIP 可用 `pnpm package` 生成；它会排除本机环境、账户文件、私人项目、缓存和渲染中间文件，并检查打包内容。

已执行的独立安装、ZIP 解压及完整渲染记录见 [实际验证](docs/VALIDATION.md)。
