# 工程结构与参数

每个可渲染项目是一组自包含的配置、场景代码和素材：

```text
project.json          标题、尺寸、输入歌曲、裁切、预览范围
timing.json           接受过的字级时码和节拍
scenes.ts             export draw(ctx,images,t), assetNames, duration
poses.json            睡衣图集的像素矩形
sprites.json          其他图集的像素矩形
sound-design.json     动作音效事件
lyrics.txt            中文原始歌词，空格表示短句
song-request.json     可选：歌词结构、曲风、来源记录
assets/*.png          assetNames 中名称对应的插画
assets/*.ttf          两款附带字体
audio/song.mp3        原始录音，保留来源标识
```

`@project` 在打包时指向选中的项目文件夹，`@mv` 指向公共 `src`。切换项目使用 `--project`，不需要改绝对导入路径。代码中仍然采用 1920×1080 设计坐标和 30 fps，其他尺寸/比例需要修改场景与入口；命令会明确拒绝不支持的配置。

## project.json

| 字段 | 含义 |
|---|---|
| `ready` | 草稿为 false；完成时码和分镜适配后设 true |
| `slug` / `title` / `theme` | 项目标识、自然语言标题、主题 |
| `width` / `height` / `fps` | 当前固定 1920 / 1080 / 30 |
| `timing` | 相对路径，默认 `timing.json` |
| `audio.source` | 原始歌曲相对路径，必须位于项目内 |
| `audio.crop_start` | 从原始录音截取的起点（秒） |
| `audio.gain_db` / `fade_out` | 纯歌曲初始增益、片尾淡出秒数 |
| `audio.ai_model` / `export` | 实际音乐来源及导出说明 |
| `preview.start` / `end` | 默认预览的全局秒，不是时长 |
| `key_times` | 全局关键帧秒数，用于静帧与成片联系图 |
| `sound_design` | 音效设计文件相对路径 |

默认完整时长取 `timing.duration`。片段范围在 30fps 上取整，`render.json` 明确记录首尾帧、全局起点与实际导出时长；混音切片使用相同起点，避免预览画面对应错段音乐。

## timing.json

`lines` 每行含 `id,text,start,end,cut,cueTime,clauseTime,chars`。`chars` 每项含 `char,start,end`，可附 ASR 置信度。拼接全部 `char` 必须恰好等于去空格后的 `text`，字符区间必须按顺序落在行内，所有行和 beat 都在视频范围内。

`cut` 是场景开始时间；`cueTime` 是该句重要动作的触发位置，不一定等于第二短句。示例对白“你也是”的动作在“你”字开始时，歌词“我说你也是”则从“我”字开始显示。不要把动作 cue 和全部歌词换句时间混为一谈。

字幕短句中的空格在绘制时去掉，汉字不会因为切换短句而重新从时码数组的第 0 项取值。这是第二短句常见的错位来源。

## 音效设计

```json
{"seed":717,"events":[
  {"kind":"ping","at":3.3,"f":1175,"amp":0.01,"length":0.16},
  {"kind":"paper","at":4.5,"amp":0.006,"length":0.13},
  {"kind":"rewind","at":14.4,"amp":0.007,"length":0.23}
]}
```

音效是轻量合成层，先与歌曲混合，再按 -16 LUFS / -1.3 dBTP 目标规范化。实际有损编码结果可能略有差异；目标值不替代测量或试听。歌曲剪辑 MP3 不含音效，视频音轨 MP3 包含音效。

## 可复现范围

附带已固定的图像、音乐、字体、时码与代码可复现相同布局和叙事。不同操作系统、浏览器、FFmpeg、编码器或字体栅格化版本可能让像素或文件哈希不同。模型重新生成的歌曲/插画也不会保证完全相同。源码包和文件清单用于追溯输入；不要承诺跨机器字节一致。
