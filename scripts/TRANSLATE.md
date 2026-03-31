# 🌐 DeepL 自动翻译使用指南

本项目内置了一个基于 `deepl-node` 的翻译脚本，会以 `src/i18n/en.ts` 为源语言，自动翻译并写入其他语言文件。

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
npm run translate -- --lang ja
```

说明：
- `.env` 会被 Git 忽略，不会提交到仓库。
- `.env.example` 会保留在仓库里，供团队成员参考。
- 如果你不想用 `.env`，也可以继续手动传 `--key`。

## 常用命令

翻译单个语言：

```bash
npm run translate -- --lang ja
```

翻译多个语言：

```bash
npm run translate -- --lang ja,ko,de
```

翻译当前项目已启用的所有机翻语言：

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

`--all` 不会翻所有 DeepL 支持语言，而是只翻当前项目已经启用、且允许机翻覆盖的语言。

当前会覆盖：
- `ja`
- `ko`
- `de`

不会覆盖：
- `en`
  因为它是源语言
- `zh`
  因为当前约定中文手动维护

如果你想提前生成未来语言文件，比如法语或西班牙语，需要显式指定：

```bash
npm run translate -- --lang fr,es
```

注意：
- 生成 `fr.ts` / `es.ts` 后，还需要手动把这些语言接入项目，前台才会真正可用。

## 当前支持的语言代码

| locale | 语言 | DeepL 目标语言代码 |
| --- | --- | --- |
| `ja` | 日语 | `JA` |
| `ko` | 韩语 | `KO` |
| `de` | 德语 | `DE` |
| `fr` | 法语 | `FR` |
| `es` | 西班牙语 | `ES` |
| `zh` | 中文 | `ZH` |

## 脚本做了什么

脚本会：
- 读取 `src/i18n/en.ts`
- 用 TypeScript AST 安全解析 `export default` 对象
- 递归翻译对象中的字符串字段
- 保留数组、对象层级结构不变
- 直接覆盖目标语言文件，如 `src/i18n/ja.ts`

脚本不会：
- 执行 `en.ts` 中的源码
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
   源语言：English (en.ts)
   目标语言：ja, ko, de

✅ API Key 有效，本月已用字符：1,234 / 500,000

📝 正在翻译 → ja (JA)...
   ✅ 已写入 src/i18n/ja.ts

📝 正在翻译 → ko (KO)...
   ✅ 已写入 src/i18n/ko.ts

📝 正在翻译 → de (DE)...
   ✅ 已写入 src/i18n/de.ts

🎉 翻译完成！
💡 建议：机翻结果请人工检查一遍，尤其是专业术语和品牌名称。
```

## 注意事项

- 脚本会直接覆盖目标语言文件，执行前建议先提交或备份当前修改。
- 翻译失败的条目会保留英文原文，不会中断整个流程。
- `src/i18n/en.ts` 需要保持为静态 `export default` 对象，不要引入运行时代码。
- 翻译完成后，建议人工快速检查一遍术语、品牌名和语气是否符合产品风格。

## 新增语言后的项目接入

如果你新增了一个当前项目还没启用的语言文件，还需要继续补两处：

1. `src/i18n/index.ts`
   把语言文件导入并注册到 `messages`
2. `src/components/NavBar.vue`
   把语言选项加到 `LOCALE_OPTIONS`

这样前台语言切换里才会真正出现这个语言。
