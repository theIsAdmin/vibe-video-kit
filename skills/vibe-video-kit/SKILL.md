---
name: vibe-video-kit
description: 在Vibe Video Kit仓库中选择、改编和渲染sy-styles第一期20种代码视频风格，保持参考样片的视觉质量。适用于模板选型、内容定制、单帧预览和基础视频导出。
---

# 使用20种代码视频模板

此Skill与整个仓库配套使用；单独复制本文件不能获得场景与渲染器。先定位含 `catalog.json`、`make.js` 与 `styles/` 的仓库根目录。上游作者及许可见根目录 `THIRD_PARTY_NOTICES.md`。

## 选择与改编

1. 读取根目录 `catalog.json`，在 `index.html` 查看用户指定模板的既有样片。场景解释可查 `docs/STYLES.md`。
2. 阅读该模板的 `styles/NN-name/index.html`、`Reel.cfg` 和 `render.args`。理解其材质、光照、构图、动作与镜头后，在工作副本中修改。
3. 保留所选模板的视觉完成度；依据本次内容调整文字、物件和动作，不用简化图形替代原有精细画面。尊重用户已认可的叙事、旁白与字幕。
4. `render(t)` 应由时间和固定随机种子决定；加入新动画时沿用此契约，避免依赖上一帧或真实播放时间。

## 环境与输出

在仓库根目录运行 `npm install`、`npm run setup` 和 `python -m pip install -r requirements.txt`，并确保FFmpeg在PATH中。推荐字体和浏览器配置见根目录README。

- `node make.js list` 列出20种风格。
- `node make.js still 09 6.5` 检查第09号第6.5秒；修改后抽查开头、关键动作和结尾。
- `node make.js style 09 --hwgpu --force` 导出第09号基础模板视频。复杂3D先做静帧，不预估固定耗时。
- `node make.js cues 09` 在改动动作音效节点后重新导出对应cues。

需要完整故事时，依据文案和实际语音时长修改场景时长、动作节点与镜头，不把默认10秒模板机械复制成整片。加入外部旁白和字幕后，用FFmpeg或项目合成工具完成混音及封装，并保留可编辑配置。

## 验证

执行 `npm run check` 检查目录、样片、源码与缩略图对应关系。查看实际样帧，检查文字边界、主体、阴影和镜头。视频导出后检查正常解码、时长、音量与切镜；报告区分技术检查、视觉抽样和实际试听。不得凭静帧声称完整动画已验证。
