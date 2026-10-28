# 来源与许可

20种模板、公共绘图代码、合成音乐/音效及基础渲染工具来自 [sy-styles-20](https://github.com/xiaoxiong20xx-code/sy-styles-20)，原作者：**肖雄 XIAOXIONG**，MIT License。

本版固定使用上游提交 `15d251afb5c40d00317c048fd77ba183e715a253` 的第一期20种场景。原始许可证、README和制作说明保存在 [docs/upstream](docs/upstream/)。模板源码的版权及许可声明均予以保留；新增目录、调用说明和适配同样采用MIT许可。

新增部分：20段既有样片的网页预览版、封面索引、逐项描述与源码入口、可搜索的离线/在线目录，以及AI调用说明。基础渲染器修正了Windows绝对路径解析，支持用环境变量指定浏览器与FFmpeg，并补充编码失败处理。

样片用于展示上游模板效果，保留模板中的示例内容与署名，不将这些署名或内容冒称为本项目原创。本仓库未收录第二期；可前往原仓库使用。

Playwright、NumPy、SciPy由各自包管理器安装，遵循各自许可。推荐字体Noto Sans CJK SC、Noto Serif CJK SC、Inter需自行安装；本仓库不打包字体或系统运行环境。

## 独立的中文歌曲 MV 模块

`vibe-music-video/` 是新增的独立歌曲 MV 制作工程，代码、文档、分镜和时码按该目录内的 [MIT 许可证](vibe-music-video/LICENSE) 提供。示例歌曲由 MiniMax Music-3.0 根据歌词和曲风生成，插画包含 AI 生成素材；选用的音乐、两款附带字体和渲染依赖分别遵循 [模块第三方说明](vibe-music-video/THIRD_PARTY.md)。该模块的示例不是上述 sy-styles-20 的原始样片；其来源和许可不替代、取消或改写原有20种模板的作者署名与许可。
