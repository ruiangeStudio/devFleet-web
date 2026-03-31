# 🌐 DeepL 自动翻译使用指南

基于 `deepl-node` SDK，以 `en.ts` 为源语言，自动翻译并写入其他语言文件。

---

## 第一步：注册 DeepL Free 账号

1. 打开 https://www.deepl.com/pro-api
2. 点击 **Sign up for free**，选择 **Free 套餐**（无需绑卡）
3. 注册并登录后，进入 **Account → Authentication Key**
4. 复制你的 API Key，格式类似：

   ```
   xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx
   ```

   > ⚠️ Free 版 Key 末尾一定有 `:fx`，如果没有说明是付费版 Key，两者都能用。

**免费额度**：每月 **50 万字符**，本项目全量翻译一次约消耗 2000~3000 字符，完全够用。

---

## 第二步：安装项目依赖

```powershell
npm install
```

---

## 第三步：执行翻译

### 翻译单个语言

```powershell
npm run translate -- --key "你的KEY:fx" --lang ja
```

### 翻译多个语言（逗号分隔）

```powershell
npm run translate -- --key "你的KEY:fx" --lang ja,ko,de
```

### 翻译所有语言（除中文外）

`--all` 只会翻译当前项目已经启用的机翻语言，也就是 `ja, ko, de`。

```powershell
npm run translate -- --key "你的KEY:fx" --all
```

如果你要提前生成未来语言文件，比如法语或西班牙语，需要显式指定：

```powershell
npm run translate -- --key "你的KEY:fx" --lang fr,es
```

---

## 推荐：用环境变量保存 Key，避免每次输入

**PowerShell（当前会话）：**
```powershell
$env:DEEPL_API_KEY = "你的KEY:fx"
npm run translate -- --lang ja,ko,de
```

**PowerShell（永久保存，重启后依然有效）：**
```powershell
[System.Environment]::SetEnvironmentVariable("DEEPL_API_KEY", "你的KEY:fx", "User")
```
设置后重新打开终端，直接运行：
```powershell
npm run translate -- --lang ja,ko,de
```

---

## 支持的语言代码

| 代码 | 语言     | DeepL 代码 |
|------|----------|------------|
| `ja` | 日语     | `JA`       |
| `ko` | 韩语     | `KO`       |
| `de` | 德语     | `DE`       |
| `fr` | 法语     | `FR`       |
| `es` | 西班牙语 | `ES`       |
| `zh` | 中文     | `ZH`       |

> 💡 中文（`zh`）建议手动维护，机翻中文质量参差不齐。
> 💡 `fr` / `es` 可以生成文件，但默认不会被 `--all` 覆盖，因为它们还不是当前站点的已启用语言。

---

## 脚本执行效果示例

```
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

---

## 注意事项

- 脚本会**直接覆盖**目标语言文件，执行前建议 `git commit` 保存当前状态
- 品牌名（`Windows`、`macOS`、`GitHub`、`VSCode` 等）已设为**跳过翻译**，不会被改动
- 翻译失败的条目会**保留原文**，不会中断整个流程
- 脚本现在会用 TypeScript AST 安全读取 `en.ts`，不再通过 `new Function` 执行源码
- 翻译完成后建议人工快速过一遍，重点检查：功能描述、专业术语

---

## 添加新语言到项目

翻译完成后，还需要在代码里注册新语言：

1. **`src/i18n/index.ts`** — 导入新语言文件并加入 `messages`，扩展 `Locale` 类型
2. **`src/components/NavBar.vue`** — 在 `LOCALE_OPTIONS` 数组里加一条记录

参考已有的 `ko`、`de` 的写法即可。
