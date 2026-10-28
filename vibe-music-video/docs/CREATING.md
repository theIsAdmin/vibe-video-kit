# 从一个日常故事到完整歌曲 MV

## 先做歌，再做动画

《别播了》的笑点是：店员说慢走，顾客顺口回“你也是”，到了晚上还在反复想。歌词并不逐字解释技术，而是把观众带进熟悉的小尴尬；结尾翻过枕头，允许脑袋下班。

好的选题可以是消息写了又删、周末眨眼结束、出门才想起没带钥匙、冰箱门打开却忘了想拿什么。一次聚焦一个事件，给它一个可画的动作和结尾。不要照着示例更换几个名词就称为新故事。

`examples/biebole/song-request.json` 保留了中文歌词、段落标签和完整曲风提示词。它不含账户、额度、会话或下载链接。参考曲风时用情绪、速度、乐器、咬字和曲式描述，不冒充具体歌手。

音乐生成可能需要多次试听。检查旋律记忆点、人声清楚程度、句子是否唱完整、前奏是否过长、转折是否自然。模型并不保证按提示词输出精确时长或 BPM。示例提示约 100 BPM，实际节拍估计约 129.2 BPM；动画使用实际录音的时间线。

可使用 MiniMax 官方网页 `https://www.minimax.cn/audio/music`，或自己可用的音乐服务。由用户登录并自行处理验证；额度、条款和付款按实际账户决定。官方文档在 2026-10-28 查阅时说明新用户音乐 API 已关闭，因此仓库没有伪造一个“填 Key 即可免费生成”的入口。[官方说明](https://platform.minimax.cn/docs/guides/music-generation)

## 新建草稿与对齐

将歌词保存为 UTF-8 TXT，每行一句；句内空格表示主歌词短句切换。取得真实的带人声音乐后：

```bash
pnpm new --slug weekend --title 周末怎么又没了 --lyrics my-lyrics.txt --song my-song.mp3
```

这会在 `projects/weekend` 创建草稿，复制示例画风作为起点，保留你提供的音乐，设置 `ready=false`。项目目录默认不进入公共源码包。

默认示例已经有时码，**不需要 ASR**。给新歌分析时，再安装可选依赖：

```bash
# Windows 改用 .venv\Scripts\python.exe
.venv/bin/python -m pip install -r requirements-align.txt
pnpm align --project projects/weekend --model small --model-dir .models
```

第一次会下载 Whisper 模型，CPU 推理耗时和内存取决于歌曲长度。这个辅助器只面向中文歌词，输出 `timing.proposed.json`、`asr.proposed.json` 和 `project.proposed.json`；不会覆盖接受过的时间线。

对齐是 Whisper 字词时码 + 已知歌词匹配，拍点是频谱起音估计，**不是精确的人声旋律提取、强制对齐或口型捕捉**。检查同音误识别、重复副歌、漏句和长音。不要把相似词直接改成原词就当作经过试听确认。需要时按真实音频手动修正每个字的 start/end、场景 cue、裁切起点和结束留白。

审核后把提案保存为 `timing.json`，把 `project.proposed.json` 的实际音频裁切参数合入 `project.json`。同一首歌重新生成的录音也需要重新对齐，不能沿用旧时码。

## 分镜、素材与动作

先写 `storyboard.md`：每句对应场景、角色行为、道具、表情、镜头和落点。至少明确铺垫、发展、笑点/转折、收束，数量由歌曲决定。

- 场景素材保持主体活动区清楚，为文字预留上方空间。
- 角色使用统一身份参考，生成合适的姿态和表情。透明图集要有干净 alpha 和格间留白；用实际像素边界更新 `poses.json` / `sprites.json`。
- 示例主角有打哈欠、惊醒抱枕、遥控器、躺下、挡脸和放松六个姿态。咖啡店角色是另一组服装图集。既有姿态切换，也有踏步、位移、旋转、暂停、翻页、翻枕头等动作。
- 图像生成工具由 agent 所在环境提供。`docs/art-prompts.json` 可用于学习场景布局和图集要求，不含不可访问的本机路径。

在 `scenes.ts` 中改写剧情逻辑，不要把示例的十段数组继续套到任意歌词上。`src/art.ts` 提供字体、描边大字、纸片、图集角色等绘图工具；`src/index.tsx` 管理字体和图像加载。所有帧使用 `t=frame/30` 计算，保持可重现。

主歌词遵循示例中的 `lyric()`：句内空格拆短句，保留字在全句中的真实索引，单字在演唱开始时弹起约 26px、轻微回弹、落位，时长约 0.32–0.48s；读过的字渐变为暖黄。上方大字和画面一起看，底部不再放重复滚动字幕。动作可随歌曲改变，验收重点是清晰、节奏和叙事，不是复制每个参数。

音效事件写进 `sound-design.json`，支持 `ping`、`paper`、`rewind`；时间使用剪辑后全局秒。其他实录音效需自行提供授权与混音实现。现有合成器不冒充真实拟音录制。

## 预览与成片

适配完成、时码通过验证后再把 `project.json` 的 `ready` 设置为 true。

```bash
pnpm doctor --project projects/weekend
pnpm keys --project projects/weekend --out outputs/weekend-keys-v1
pnpm preview --project projects/weekend --out outputs/weekend-preview-v1
# 也可指定任意包含剧情动作的局部
pnpm preview --project projects/weekend --start 10 --duration 5 --out outputs/weekend-action-v1
pnpm render --project projects/weekend --out outputs/weekend-final-v1
```

检查最大跳字高度、文字换句、人物表情、前后景遮挡、道具动作、镜头转场和片尾留白。看导出的真实连续帧，不只看渲染前的关键帧。完整播放到片尾，分别检查歌曲、混音和 MP3；无法试听时如实说明。

封面、发布文案和交付说明见 `skills/music-video/references/handoff.md`。本项目不自动上传社交平台。
