# 安装与渲染故障

## Node / pnpm / Python

`node --version` 应为 22 或更高。用锁文件安装，避免任意升级 React/Remotion。pnpm 可参照 [官方安装文档](https://pnpm.io/installation)。如果本机没有 Corepack，先按官方方式安装 pnpm，再执行 README 的命令。

Python 使用 3.11+。默认只需要 NumPy、Pillow；新歌对齐才安装 `requirements-align.txt`。创建 `.venv` 后 CLI 会自动选择其中的 Python，不必激活。也可以在 shell 中设置 `MV_PYTHON` 为可执行文件完整路径。Windows 若无 `py -3.11`，使用你已安装的 3.11+ Python 执行 `-m venv .venv`。

## FFmpeg

`ffmpeg -version` 和 `ffprobe -version` 必须都可执行。使用 [FFmpeg 官方下载页](https://ffmpeg.org/download.html)列出的发行方式。macOS 可用已安装包管理器，Ubuntu 可安装 `ffmpeg` 软件包。若可执行文件未在 PATH，分别设置 `FFMPEG_PATH` / `FFPROBE_PATH`。

`pnpm doctor` 会检查源音频和 MP3 编码支持。不要用重命名后缀代替真实 MP3 转码。

## Chrome 与 Linux 系统库

CLI 先检查 `CHROME_EXECUTABLE`，再查常见 Chrome 安装位置，否则调用 Remotion 的 `ensureBrowser()`。浏览器首次下载可能需要联网。[ensureBrowser 官方文档](https://www.remotion.dev/docs/renderer/ensure-browser)

Linux 容器若提示缺少动态库，按 [Remotion Linux 依赖说明](https://www.remotion.dev/docs/miscellaneous/linux-dependencies)安装对应发行版的库。不要为了渲染去关闭系统安全保护。默认并发为 2；内存不足可用 `--concurrency 1`。

## 字体 / 素材 / 时码

字体从项目 assets 加载，无需安装到操作系统；两款字体及 OFL 已附。图片资源名必须和 `assetNames` 一致。加载失败会终止渲染并显示缺失资源，不会用空白画面补齐。

doctor 拒绝时码不一致时，核对 `text`、`chars`、字符先后、裁切起点、duration，以及是否误用了另一首录音的时间线。新的 ASR 提案不能直接视为经过审核的真值。

`ready=false` 是新主题草稿保护：先改好分镜、时码、音乐和动作，再设 true。不要只改这个标志来绕过适配。

## 路径有空格或中文

命令参数用引号包住完整路径。项目内部使用相对路径；脚本通过参数数组调用子进程，不把文件名拼成 shell 命令。测试过的当前主机是 Windows；CI 配置覆盖 Ubuntu 的诊断和短片段，其他平台需在实际运行后再声称通过。

## 审阅视频拖动失败

用 `pnpm serve --out <输出目录> --port 8800`，不要只双击 HTML。附带服务器监听 127.0.0.1，支持 MP4 Range 请求，不会把文件夹公开到互联网。端口占用时换一个端口。
