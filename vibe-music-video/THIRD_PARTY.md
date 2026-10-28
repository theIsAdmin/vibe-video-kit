# 代码、示例媒体与依赖说明

## 项目代码与文档

代码、文档、手工分镜、时间线和图像/音乐提示词由本项目整理，采用根目录 MIT 许可证，署名 DaneAI2。本项目没有附带原始第三方 `.motion` 模板、用户提供的参考视频或其截图；示例预览图来自本项目自己渲染的成片。

## 示例插画、歌词与音乐

示例插画为 AI 生成、选取并编排的素材；示例歌曲由 MiniMax Music-3.0 官方网页根据本项目歌词和曲风生成，使用官方 MP3 导出。示例中采用合成歌声，没有上传、克隆或声称模仿特定真实歌手。

对于作者享有且有权许可的示例插画、歌词和音乐内容，作者许可在 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 下学习、复制和改编，署名 `DaneAI2 / Vibe Music Video`，并注明音乐由 MiniMax Music-3.0、插画由 AI 生成，保留适用的来源标识。该许可仅覆盖作者可许可的权利；不授予第三方商标、人格权或平台本身的权利，也不保证 AI 输出具有可登记的独占著作权。

示例音频 `examples/biebole/audio/song.mp3` 是选用的原始官方导出，约 55.26 秒。成片按接受的时间线剪辑为 42.6 秒，并合入本项目程序合成的轻量音效。未选用的候选歌曲不进入源码包。

MiniMax 音乐服务的条款与下载时提示继续适用，不被本仓库的 MIT 或 CC 许可覆盖、取消或替代。保留原始导出和来源；不要移除或规避 provider 要求的 AI 标识、水印。使用新账户、新歌或新服务时，应按其实际导出条件处理，不能从本示例推断所有输出均可无条件商用或转授权。

查阅日期：2026-10-28。主要来源：

- [MiniMax 语音用户协议](https://www.minimax.cn/audio/doc/terms-of-service.html)：输入/输出权利及 AI 标识条款。
- [MiniMax 音乐功能使用须知](https://www.minimax.cn/audio/doc/terms-of-service-music.html)：音乐使用规则、标识和导出提示。
- [音乐生成官方文档](https://platform.minimax.cn/docs/guides/music-generation)：当前服务可用性。不能据此假定新用户可开通音乐 API。

## 字体

| 文件 | 项目与许可 |
|---|---|
| `LXGWWenKai-Regular.ttf` | [LXGW WenKai](https://github.com/lxgw/LxgwWenKai)，SIL OFL 1.1；原始许可证在 `licenses/LXGW-WenKai-OFL.txt` |
| `ZCOOLKuaiLe-Regular.ttf` | [ZCOOL KuaiLe](https://github.com/googlefonts/zcool-kuaile)，SIL OFL 1.1；原始许可证在 `licenses/ZCOOL-KuaiLe-OFL.txt` |

字体文件保持原样，未删改字体自身的版权/命名信息。字体不被重新许可为 MIT。

## 渲染及分析依赖

Remotion 使用自己的许可条款；本项目 MIT 不等同于 Remotion 获得无条件商业授权。查看 [Remotion 许可与 FAQ](https://www.remotion.dev/docs/license/faq)判断适用条件。依赖包按其各自许可证安装，浏览器与 FFmpeg 也保留各自许可；没有把这些可执行文件打进源码包。

faster-whisper 为可选依赖，下载的模型另按模型自身许可使用。附带示例时码不需要下载模型。NumPy、Pillow、React 等依赖的许可证随它们的发行包提供。
