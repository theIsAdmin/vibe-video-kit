# 发布到 GitHub

本仓库可直接作为 GitHub 源码仓库，也可用 `pnpm package` 输出 ZIP。ZIP 使用白名单打包，包含示例音乐和插画、字体许可证、源码、说明和 skill；排除 `.venv`、`node_modules`、模型、outputs、私人 projects 和账户文件。

发布前先运行：

```bash
pnpm test
# Windows 使用 .venv\Scripts\python.exe
.venv/bin/python -m unittest discover -s tests
pnpm doctor
pnpm preview --out outputs/release-check
pnpm demo --out outputs/release-full
pnpm package --out dist/vibe-music-video.zip
```

查看 `dist/vibe-music-video.manifest.json`，确认文件清单与哈希；解压到另一个新目录，用该目录自己的依赖重跑 doctor 和预览。不要把旧工程 node_modules 的链接当作独立安装测试。

阅读 `THIRD_PARTY.md`：代码 MIT；AI 示例媒体和字体的条件分开处理；音乐标识和来源需保留。若音乐账户的具体导出页面提示了额外使用限制，应当先核对该提示再公开对应音频。

## 上传方式

在 GitHub 建一个空仓库，例如 `vibe-music-video`。在本地项目目录执行：

```bash
git init -b main
git add .
git diff --cached --stat
git commit -m "Release illustrated music video workflow"
git remote add origin https://github.com/YOUR_ACCOUNT/vibe-music-video.git
git push -u origin main
```

`YOUR_ACCOUNT` 替换为你的实际账户。不要把 token 写进 remote URL。也可使用已登录的 GitHub CLI 创建仓库后推送，但公共仓库创建和发布应由人明确指定。

正文首页已有图片和 agent 使用提示。可把完整示例 MP4 作为 GitHub Release 附件，并在 README 增加实际下载链接；源码仓库默认不跟踪渲染中间文件。没有创建 Release 时不要留下虚假的下载地址。

`.github/workflows/check.yml` 会运行静态/时码/打包检查；手动运行 workflow 时可另外渲染带音乐的短片段并上传检查附件。只有实际运行通过后，才把 CI 状态描述为通过。
