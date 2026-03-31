# 🌐 DeepL 自动翻译使用指南

本项目内置了一个基于 `deepl-node` 的翻译脚本，会以 `src/i18n/messages/zh.ts` 为源语言，自动翻译并写入其他语言文件。

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

## 前提

1. 注册 [DeepL API](https://www.deepl.com/pro-api) 账号
2. 获取 API Key
3. 在项目根目录安装依赖：

```bash
npm install
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
npm run translate
```

说明：
- `.env` 会被 Git 忽略，不会提交到仓库。
- `.env.example` 会保留在仓库里，供团队成员参考。
- 如果你不想用 `.env`，也可以继续手动传 `--key`。

## 常用命令

默认翻译当前项目已启用的所有机翻语言：

```bash
npm run translate
```

翻译单个语言：

```bash
npm run translate -- --lang ja
```

翻译多个语言：

```bash
npm run translate -- --lang ja,ko,de,ru,fr,es,ar
```

显式翻译当前项目已启用的所有机翻语言：

```bash
npm run translate -- --all
```

查看帮助：

```bash
npm run translate -- --help
```

如果你想显式覆盖环境变量，也可以这样写：

```bash
npm run translate -- --key "your-deepl-api-key:fx" --lang ja
```

## `--all` 的行为

不传参数时，脚本默认等同于执行 `--all`。

`--all` 不会翻所有 DeepL 支持语言，而是只翻当前项目已经启用、且允许机翻覆盖的语言。

当前会覆盖：
- `en`
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
npm run translate -- --lang fr,es,ar
```

注意：
- 阿拉伯语会自动把页面切到 RTL 方向，方便一起测试排版。

## 当前支持的语言代码

| locale | 语言 | DeepL 目标语言代码 |
| --- | --- | --- |
| `en` | 英语 | `EN` |
| `ja` | 日语 | `JA` |
| `ko` | 韩语 | `KO` |
| `de` | 德语 | `DE` |
| `ru` | 俄语 | `RU` |
| `fr` | 法语 | `FR` |
| `es` | 西班牙语 | `ES` |
| `ar` | 阿拉伯语 | `AR` |
| `zh` | 中文 | `ZH-HANS` |

## 脚本做了什么

脚本会：
- 读取 `src/i18n/messages/zh.ts`
- 用 TypeScript AST 安全解析 `export default` 对象
- 递归翻译对象中的字符串字段
- 保留数组、对象层级结构不变
- 直接覆盖目标语言文件，如 `src/i18n/messages/ja.ts`
- 切到 `ar` 时自动把页面设为 RTL

脚本不会：
- 执行 `zh.ts` 中的源码
- 自动把新语言注册到 `src/i18n/index.ts`
- 自动把新语言加到导航语言切换列表

## 哪些内容会跳过翻译

以下内容默认会被保留：
- 纯符号、纯数字、纯标点类内容
- 常见品牌或工具名，如 `Windows`、`macOS`、`GitHub`、`npm`、`VSCode`、`Cursor`、`WebStorm`、`Tauri`

如果后面你有新的品牌词要保留，可以去改 `scripts/translate.mjs` 里的 `SKIP_TRANSLATION_PATTERNS`。

## 示例输出

```text
🌐 DeepL 翻译脚本启动
   源语言：Chinese (zh.ts)
   目标语言：en, ja, ko, de, ru, fr, es, ar

✅ API Key 有效，本月已用字符：1,234 / 500,000

📝 正在翻译 → en (EN)...
   ✅ 已写入 src/i18n/messages/en.ts

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
- 翻译失败的条目会保留英文原文，不会中断整个流程。
- `src/i18n/messages/zh.ts` 需要保持为静态 `export default` 对象，不要引入运行时代码。
- 翻译完成后，建议人工快速检查一遍术语、品牌名和语气是否符合产品风格。

## 新增语言后的项目接入

新增语言时，优先改：

1. `src/i18n/locales.ts`
   增加语言配置
2. 运行：

```bash
npm run translate -- --lang <locale>
```

如果你只是新增可机翻语言，通常不需要再手动修改 `src/i18n/index.ts` 或 `src/components/NavBar.vue` 了。
