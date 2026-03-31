# 🌐 DeepL / OpenCC 自动翻译使用指南

本项目内置了一个基于 `deepl-node` 和 `opencc-js` 的翻译脚本，会以 `src/i18n/messages/zh.ts` 为源语言，自动翻译或转换并写入其他语言文件。

## 单一配置源

现在语言元数据已经收敛到一处：

- `src/i18n/locales.ts`

语言文案文件统一放在：

- `src/i18n/messages/`

这个文件会同时驱动：
- 前台语言切换菜单
- `vue-i18n` 语言注册
- 翻译脚本的 `--all` 目标语言列表
- 阿拉伯语的 RTL 方向切换

也就是说，后面新增一门语言时，通常只需要：

1. 在 `src/i18n/locales.ts` 里加一项
2. 跑一次翻译脚本生成对应的 `src/i18n/messages/<locale>.ts`

在翻译文件还没生成之前，页面会先回退使用中文文案，不会直接因为缺文件而报错。

## `locales.ts` 字段说明

每个语言项建议关注这些字段：

- `code`
  项目内部 locale 标识，也是 `src/i18n/messages/<code>.ts` 的文件名
- `label` / `name`
  前台语言菜单展示用文案
- `deeplSource`
  只有源语言需要，用来告诉 DeepL “原文是什么语言”
- `deeplTarget`
  目标语言对应的 DeepL 代码
- `manual`
  为 `true` 时，不参与默认 `--all` 覆盖
- `translationStrategy`
  可选，本地文本转换策略，适合同语种变体，例如简体中文转繁体中文
- `browserAliases`
  可选，用于把浏览器返回的脚本/区域语言标签映射到当前 locale

例如繁体中文可以用：

- `code: 'zh-tw'`
- `deeplTarget: 'ZH-HANT'`
- `translationStrategy: 'opencc-cn-to-tw'`
- `browserAliases: ['zh-hant', 'zh-hk', 'zh-mo']`

## 繁体中文的特殊说明

`zh-tw` 这门语言现在不是直接走 DeepL 翻译，而是走本地 `OpenCC` 转换。

原因是 DeepL 官方翻译接口明确说明：它主要用于“不同语言之间”的翻译；如果是同一种语言的不同变体，翻译结果会保持不变。简体中文到繁体中文就属于这种情况，所以这里改成了 `OpenCC cn -> tw`，这样才会真正把 `预览` 转成 `預覽`、`开发者` 转成 `開發者`。

参考：
- [DeepL Translate Text API](https://developers.deepl.com/api-reference/translate)
- [OpenCC / opencc-js](https://www.npmjs.com/package/opencc-js)

## 前提

1. 注册 [DeepL API](https://www.deepl.com/pro-api) 账号
2. 获取 API Key
3. 在项目根目录安装依赖：

```bash
pnpm install
```

## 推荐用法：`.env`

项目已经支持从根目录 `.env` 读取 `DEEPL_API_KEY`。

1. 复制示例文件：

```bash
cp .env.example .env
```

2. 填入你自己的 key：

```dotenv
DEEPL_API_KEY=your-deepl-api-key:fx
```

3. 直接执行翻译：

```bash
pnpm translate
```

说明：
- `.env` 会被 Git 忽略，不会提交到仓库。
- `.env.example` 会保留在仓库里，供团队成员参考。
- 如果你不想用 `.env`，也可以继续手动传 `--key`。

## 常用命令

默认翻译当前项目已启用的所有机翻语言：

```bash
pnpm translate
```

翻译单个语言：

```bash
pnpm translate -- --lang ja
```

翻译多个语言：

```bash
pnpm translate -- --lang ja,ko,de,ru,fr,es,ar,zh-tw
```

显式翻译当前项目已启用的所有机翻语言：

```bash
pnpm translate -- --all
```

查看帮助：

```bash
pnpm translate -- --help
```

如果你想显式覆盖环境变量，也可以这样写：

```bash
pnpm translate -- --key "your-deepl-api-key:fx" --lang ja
```

## `--all` 的行为

不传参数时，脚本默认等同于执行 `--all`。

`--all` 不会翻所有 DeepL 支持语言，而是只翻当前项目已经启用、且允许机翻覆盖的语言。

当前会覆盖：
- `en`
- `zh-tw`
- `ja`
- `ko`
- `de`
- `ru`
- `fr`
- `es`
- `ar`

不会覆盖：
- `zh`
  因为当前约定中文手动维护

如果你想只翻一部分语言，也可以显式指定：

```bash
pnpm translate -- --lang fr,es,ar
```

注意：
- 阿拉伯语会自动把页面切到 RTL 方向，方便一起测试排版。

## 当前支持的语言代码

| locale | 语言 | DeepL 目标语言代码 |
| --- | --- | --- |
| `en` | 英语 | `EN-US` |
| `zh-tw` | 繁体中文 | `ZH-HANT` |
| `ja` | 日语 | `JA` |
| `ko` | 韩语 | `KO` |
| `de` | 德语 | `DE` |
| `ru` | 俄语 | `RU` |
| `fr` | 法语 | `FR` |
| `es` | 西班牙语 | `ES` |
| `ar` | 阿拉伯语 | `AR` |
| `zh` | 中文源语言 | `ZH` |

## 脚本做了什么

脚本会：
- 读取 `src/i18n/messages/zh.ts`
- 用 TypeScript AST 安全解析 `export default` 对象
- 递归翻译对象中的字符串字段
- 对普通外语目标语言调用 DeepL
- 对 `zh-tw` 调用 OpenCC 做简体转繁体
- 保留数组、对象层级结构不变
- 直接覆盖目标语言文件，如 `src/i18n/messages/ja.ts`
- 切到 `ar` 时自动把页面设为 RTL
- 自动跳过纯 emoji、纯符号和常见品牌词

脚本不会：
- 执行 `zh.ts` 中的源码
- 自动修改 `src/i18n/locales.ts`

## 哪些内容会跳过翻译

以下内容默认会被保留：
- 纯 emoji、纯符号、纯数字、纯标点类内容
- 常见品牌或工具名，如 `Windows`、`macOS`、`GitHub`、`npm`、`VSCode`、`Cursor`、`WebStorm`、`Tauri`

如果后面你有新的品牌词要保留，可以去改 `scripts/translate.mjs` 里的 `SKIP_TRANSLATION_PATTERNS`。

## 示例输出

```text
🌐 DeepL / OpenCC 翻译脚本启动
   源语言：中文 (zh.ts / ZH)
   目标语言：en, zh-tw, ja, ko, de, ru, fr, es, ar

✅ API Key 有效，本月已用字符：1,234 / 500,000

📝 正在翻译 → en (EN-US)...
   ✅ 已写入 src/i18n/messages/en.ts

📝 正在翻译 → zh-tw (OpenCC cn->tw)...
   ✅ 已写入 src/i18n/messages/zh-tw.ts

📝 正在翻译 → ja (JA)...
   ✅ 已写入 src/i18n/messages/ja.ts

📝 正在翻译 → ko (KO)...
   ✅ 已写入 src/i18n/messages/ko.ts

📝 正在翻译 → de (DE)...
   ✅ 已写入 src/i18n/messages/de.ts

📝 正在翻译 → ru (RU)...
   ✅ 已写入 src/i18n/messages/ru.ts

📝 正在翻译 → fr (FR)...
   ✅ 已写入 src/i18n/messages/fr.ts

📝 正在翻译 → es (ES)...
   ✅ 已写入 src/i18n/messages/es.ts

📝 正在翻译 → ar (AR)...
   ✅ 已写入 src/i18n/messages/ar.ts

🎉 翻译完成！
💡 建议：机翻结果请人工检查一遍，尤其是专业术语和品牌名称。
```

## 注意事项

- 脚本会直接覆盖目标语言文件，执行前建议先提交或备份当前修改。
- 翻译失败的条目会保留中文原文，不会中断整个流程。
- `src/i18n/messages/zh.ts` 需要保持为静态 `export default` 对象，不要引入运行时代码。
- `zh` 当前是源语言，只负责提供母本文案，不参与 `--all` 或 `--lang zh` 翻译。
- `zh-tw` 虽然保留了 `ZH-HANT` 作为语言元数据，但实际生成过程走的是 OpenCC，本地即可完成，不依赖 DeepL 返回繁体结果。
- 如果新增的是带地区或脚本的语言，例如 `zh-tw`，记得在 `browserAliases` 里补上对应标签，确保浏览器自动识别和本地持久化都能命中正确语言。
- 翻译完成后，建议人工快速检查一遍术语、品牌名和语气是否符合产品风格。

## 新增语言后的项目接入

新增语言时，优先改：

1. `src/i18n/locales.ts`
   增加语言配置
2. 运行：

```bash
pnpm translate -- --lang <locale>
```

如果你只是新增可机翻语言，通常不需要再手动修改 `src/i18n/index.ts` 或 `src/components/NavBar.vue` 了。
只有像 `zh-tw` 这种带脚本/区域含义的 locale，才建议额外补 `browserAliases`，让浏览器语言匹配更准确。
