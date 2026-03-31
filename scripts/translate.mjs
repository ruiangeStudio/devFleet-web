/**
 * DeepL 自动翻译脚本
 * 以 en.ts 为源语言，自动翻译并更新其他语言文件
 *
 * 使用方法：
 *   npm run translate -- --key YOUR_DEEPL_API_KEY --lang ja
 *   npm run translate -- --key YOUR_DEEPL_API_KEY --lang ja,ko,de
 *   npm run translate -- --key YOUR_DEEPL_API_KEY --all
 *
 * 也可以设置环境变量替代 --key 参数：
 *   $env:DEEPL_API_KEY="your-key"
 *   npm run translate -- --lang ja
 */

import * as deepl from 'deepl-node'
import ts from 'typescript'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const I18N_DIR = join(__dirname, '../src/i18n')

const SOURCE_LOCALE = 'en'
const SOURCE_LANG = 'EN'
const HUMAN_MAINTAINED_LOCALES = new Set(['zh'])

// 当前项目已接入的语言。--all 只会翻这些语言，避免生成前台不可达的死文件。
const APP_ENABLED_LOCALES = ['zh', 'en', 'ja', 'ko', 'de']

// key: 我们项目中的 locale 标识符
// value: DeepL API 的目标语言代码
const DEEPL_LANG_MAP = {
  zh: 'ZH',      // 中文（简体）
  ja: 'JA',      // 日语
  ko: 'KO',      // 韩语
  de: 'DE',      // 德语
  fr: 'FR',      // 法语（备用，如果将来加）
  es: 'ES',      // 西班牙语（备用）
}

const SKIP_TRANSLATION_PATTERNS = [
  /^[©\d\s.,!?:;()\-_/\\]+$/,
  /^(Windows|macOS|Linux|GitHub|npm|yarn|pnpm|bun|nvmd|nvs|nvm|VSCode|Cursor|WebStorm|Tauri)$/,
]

// ===== 解析命令行参数 =====
const args = process.argv.slice(2)

function getArg(name) {
  const idx = args.indexOf(`--${name}`)
  return idx !== -1 ? args[idx + 1] : null
}

function printHelp() {
  console.log(`
DeepL 自动翻译脚本

用法：
  npm run translate -- --lang ja
  npm run translate -- --lang ja,ko,de
  npm run translate -- --all

参数：
  --key <DEEPL_API_KEY>  可选，未传时读取环境变量 DEEPL_API_KEY
  --lang <codes>         指定目标语言，多个用逗号分隔
  --all                  翻译当前项目已启用的所有机翻语言
  --help                 查看帮助

说明：
  --all 当前只会覆盖：${APP_ENABLED_LOCALES.filter(locale => locale !== SOURCE_LOCALE && !HUMAN_MAINTAINED_LOCALES.has(locale)).join(', ')}
  若要生成未来语言（如 fr / es），请显式传入 --lang fr
`)
}

function fail(message) {
  console.error(`❌ ${message}`)
  process.exit(1)
}

function normalizeLocale(locale) {
  return locale.trim().toLowerCase()
}

function resolveTargetLocales() {
  const targetAll = args.includes('--all')
  const langArg = getArg('lang')

  if (targetAll) {
    return APP_ENABLED_LOCALES.filter(
      locale => locale !== SOURCE_LOCALE && !HUMAN_MAINTAINED_LOCALES.has(locale),
    )
  }

  if (!langArg) {
    fail('请指定目标语言：--lang ja 或 --all')
  }

  const locales = Array.from(
    new Set(
      langArg
        .split(',')
        .map(normalizeLocale)
        .filter(Boolean),
    ),
  )

  if (locales.length === 0) {
    fail('未解析到有效语言代码，请检查 --lang 参数')
  }

  for (const locale of locales) {
    if (!DEEPL_LANG_MAP[locale]) {
      fail(`不支持的语言代码：${locale}\n   支持的语言：${Object.keys(DEEPL_LANG_MAP).join(', ')}`)
    }
  }

  return locales
}

// ===== 加载源文件 =====
function loadSourceMessages() {
  const sourcePath = join(I18N_DIR, `${SOURCE_LOCALE}.ts`)
  const raw = readFileSync(sourcePath, 'utf-8')
  const sourceFile = ts.createSourceFile(sourcePath, raw, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const exportAssignment = sourceFile.statements.find(statement => ts.isExportAssignment(statement))

  if (!exportAssignment) {
    throw new Error(`未在 ${sourcePath} 中找到 export default`)
  }

  return parseStaticExpression(exportAssignment.expression, 'default export')
}

function unwrapExpression(expression) {
  let current = expression

  while (true) {
    if (
      ts.isParenthesizedExpression(current) ||
      ts.isAsExpression(current) ||
      ts.isTypeAssertionExpression(current) ||
      ts.isNonNullExpression(current) ||
      ts.isSatisfiesExpression?.(current)
    ) {
      current = current.expression
      continue
    }

    return current
  }
}

function getPropertyName(name, path) {
  if (ts.isIdentifier(name) || ts.isStringLiteralLike(name) || ts.isNumericLiteral(name)) {
    return name.text
  }

  throw new Error(`${path} 包含不支持的对象 key 写法`)
}

function parseStaticExpression(expression, path) {
  const node = unwrapExpression(expression)

  if (ts.isObjectLiteralExpression(node)) {
    const result = {}

    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property) || ts.isComputedPropertyName(property.name)) {
        throw new Error(`${path} 只支持静态对象字面量`)
      }

      const key = getPropertyName(property.name, path)
      result[key] = parseStaticExpression(property.initializer, `${path}.${key}`)
    }

    return result
  }

  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map((element, index) => {
      if (ts.isSpreadElement(element) || ts.isOmittedExpression(element)) {
        throw new Error(`${path}[${index}] 只支持静态数组项`)
      }

      return parseStaticExpression(element, `${path}[${index}]`)
    })
  }

  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text
  }

  if (ts.isNumericLiteral(node)) {
    return Number(node.text)
  }

  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  if (node.kind === ts.SyntaxKind.NullKeyword) return null

  throw new Error(`${path} 包含不支持的动态表达式，请保持 ${SOURCE_LOCALE}.ts 为静态对象`)
}

// ===== 递归翻译对象 =====
async function translateObject(obj, translator, targetLang, path = '') {
  if (typeof obj === 'string') {
    // 跳过不需要翻译的值（纯符号、数字、已是代码的内容）
    if (SKIP_TRANSLATION_PATTERNS.some(pattern => pattern.test(obj))) return obj

    try {
      const result = await translator.translateText(obj, SOURCE_LANG, targetLang)
      return result.text
    } catch (err) {
      console.warn(`  ⚠️  翻译失败 [${path}]: ${obj.slice(0, 40)}... — ${err.message}`)
      return obj // 失败时保留原文
    }
  }

  if (Array.isArray(obj)) {
    const results = []
    for (let i = 0; i < obj.length; i++) {
      results.push(await translateObject(obj[i], translator, targetLang, `${path}[${i}]`))
    }
    return results
  }

  if (typeof obj === 'object' && obj !== null) {
    const result = {}
    for (const key of Object.keys(obj)) {
      result[key] = await translateObject(obj[key], translator, targetLang, `${path}.${key}`)
    }
    return result
  }

  return obj
}

// ===== 把翻译结果序列化为 .ts 文件 =====
function serializeToTs(obj, indent = 0) {
  const pad = '  '.repeat(indent)
  const pad1 = '  '.repeat(indent + 1)

  if (typeof obj === 'string') {
    // 处理包含换行的字符串
    const escaped = obj.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')
    if (obj.includes('\n')) {
      return `\`${escaped}\``
    }
    return `'${obj.replace(/'/g, "\\'")}'`
  }

  if (Array.isArray(obj)) {
    const items = obj.map(item => `${pad1}${serializeToTs(item, indent + 1)}`).join(',\n')
    return `[\n${items},\n${pad}]`
  }

  if (typeof obj === 'object' && obj !== null) {
    const entries = Object.entries(obj)
      .map(([k, v]) => `${pad1}${k}: ${serializeToTs(v, indent + 1)}`)
      .join(',\n')
    return `{\n${entries},\n${pad}}`
  }

  return String(obj)
}

// ===== 主流程 =====
async function main() {
  if (args.includes('--help') || args.includes('-h')) {
    printHelp()
    process.exit(0)
  }

  const targetLocales = resolveTargetLocales()
  const source = loadSourceMessages()
  const apiKey = getArg('key') || process.env.DEEPL_API_KEY

  if (!apiKey) {
    fail('缺少 API Key！请用 --key 参数或 DEEPL_API_KEY 环境变量提供。')
  }

  console.log(`\n🌐 DeepL 翻译脚本启动`)
  console.log(`   源语言：English (${SOURCE_LOCALE}.ts)`)
  console.log(`   目标语言：${targetLocales.join(', ')}\n`)

  for (const locale of targetLocales) {
    if (!APP_ENABLED_LOCALES.includes(locale)) {
      console.log(`   ℹ️ ${locale} 当前还未在前台注册，生成文件后还需要补充 i18n 配置`)
    }
  }

  const translator = new deepl.Translator(apiKey)

  // 验证 API Key 是否有效
  try {
    const usage = await translator.getUsage()
    const used = usage.character?.count ?? 0
    const limit = usage.character?.limit ?? 0
    console.log(`✅ API Key 有效，本月已用字符：${used.toLocaleString()} / ${limit.toLocaleString()}\n`)
  } catch (err) {
    console.error(`❌ API Key 无效或网络错误：${err.message}`)
    process.exit(1)
  }

  for (const locale of targetLocales) {
    const deeplLang = DEEPL_LANG_MAP[locale]
    console.log(`📝 正在翻译 → ${locale} (${deeplLang})...`)

    const translated = await translateObject(source, translator, deeplLang)

    // 生成 .ts 文件内容
    const content = `export default ${serializeToTs(translated)}\n`
    const outPath = join(I18N_DIR, `${locale}.ts`)

    writeFileSync(outPath, content, 'utf-8')
    console.log(`   ✅ 已写入 src/i18n/${locale}.ts\n`)
  }

  console.log('🎉 翻译完成！')
  console.log('💡 建议：机翻结果请人工检查一遍，尤其是专业术语和品牌名称。')
}

main().catch(err => {
  console.error('💥 脚本出错：', err)
  process.exit(1)
})
