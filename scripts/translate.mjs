/**
 * DeepL 自动翻译脚本
 * 以 zh.ts 为源语言，自动翻译并更新其他语言文件
 *
 * 使用方法：
 *   npm run translate
 *   npm run translate -- --key YOUR_DEEPL_API_KEY --lang ja
 *   npm run translate -- --key YOUR_DEEPL_API_KEY --lang ja,ko,de,ru,fr,es,ar
 *   npm run translate -- --key YOUR_DEEPL_API_KEY --all
 *
 * 也可以设置环境变量替代 --key 参数：
 *   .env => DEEPL_API_KEY=your-key
 *   npm run translate
 */

import * as deepl from 'deepl-node'
import ts from 'typescript'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = join(__dirname, '..')
const I18N_DIR = join(PROJECT_ROOT, 'src/i18n')
const MESSAGES_DIR = join(I18N_DIR, 'messages')
const LOCALES_CONFIG_PATH = join(I18N_DIR, 'locales.ts')

const ENV_FILES = ['.env']
const LOCALE_DEFINITIONS = loadLocaleDefinitions()
const SOURCE_LOCALE_DEFINITION = LOCALE_DEFINITIONS.find(locale => locale.isSource)
const SOURCE_LOCALE = SOURCE_LOCALE_DEFINITION?.code ?? 'zh'
const SOURCE_LANG = SOURCE_LOCALE_DEFINITION?.deeplSource ?? SOURCE_LOCALE_DEFINITION?.deeplTarget ?? 'ZH'
const SOURCE_LABEL = SOURCE_LOCALE_DEFINITION?.label ?? SOURCE_LOCALE.toUpperCase()
const HUMAN_MAINTAINED_LOCALES = new Set(
  LOCALE_DEFINITIONS.filter(locale => locale.manual).map(locale => locale.code),
)

// 当前项目已接入的语言。--all 只会翻这些语言，避免生成前台不可达的死文件。
const APP_ENABLED_LOCALES = LOCALE_DEFINITIONS.map(locale => locale.code)

// key: 我们项目中的 locale 标识符
// value: DeepL API 的目标语言代码
const DEEPL_LANG_MAP = Object.fromEntries(
  LOCALE_DEFINITIONS
    .filter(locale => locale.deeplTarget)
    .map(locale => [locale.code, locale.deeplTarget]),
)

const SKIP_TRANSLATION_PATTERNS = [
  /^[©\d\s.,!?:;()\-_/\\]+$/,
  /^(Windows|macOS|Linux|GitHub|npm|yarn|pnpm|bun|nvmd|nvs|nvm|VSCode|Cursor|WebStorm|Tauri)$/,
]

loadEnvFiles()

// ===== 解析命令行参数 =====
const args = process.argv.slice(2)

function getArg(name) {
  const idx = args.indexOf(`--${name}`)
  return idx !== -1 ? args[idx + 1] : null
}

function loadLocaleDefinitions() {
  const raw = readFileSync(LOCALES_CONFIG_PATH, 'utf-8')
  const sourceFile = ts.createSourceFile(LOCALES_CONFIG_PATH, raw, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const exportAssignment = sourceFile.statements.find(statement => ts.isExportAssignment(statement))

  if (!exportAssignment) {
    throw new Error(`未在 ${LOCALES_CONFIG_PATH} 中找到 export default`)
  }

  const localeDefinitions = parseStaticExpression(exportAssignment.expression, 'locale definitions')

  if (!Array.isArray(localeDefinitions) || localeDefinitions.length === 0) {
    throw new Error('语言配置不能为空')
  }

  return localeDefinitions
}

function loadEnvFiles() {
  for (const file of ENV_FILES) {
    const envPath = join(PROJECT_ROOT, file)
    if (!existsSync(envPath)) continue

    const lines = readFileSync(envPath, 'utf-8').split(/\r?\n/)
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      const separatorIndex = trimmed.indexOf('=')
      if (separatorIndex === -1) continue

      const key = trimmed.slice(0, separatorIndex).trim()
      let value = trimmed.slice(separatorIndex + 1).trim()

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }

      if (key && !(key in process.env)) {
        process.env[key] = value
      }
    }
  }
}

function printHelp() {
  console.log(`
DeepL 自动翻译脚本

用法：
  npm run translate
  npm run translate -- --lang ja
  npm run translate -- --lang ja,ko,de,ru,fr,es,ar
  npm run translate -- --all

参数：
  --key <DEEPL_API_KEY>  可选，未传时读取环境变量 DEEPL_API_KEY
  --lang <codes>         指定目标语言，多个用逗号分隔
  --all                  显式翻译当前项目已启用的所有机翻语言
  --help                 查看帮助

说明：
  也支持项目根目录的 .env 文件
  不传参数时默认执行 --all
  --all 当前只会覆盖：${APP_ENABLED_LOCALES.filter(locale => locale !== SOURCE_LOCALE && !HUMAN_MAINTAINED_LOCALES.has(locale)).join(', ')}
  若要只翻部分语言，请显式传入 --lang xx
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
  const langArg = getArg('lang')

  if (!langArg) {
    return APP_ENABLED_LOCALES.filter(
      locale => locale !== SOURCE_LOCALE && !HUMAN_MAINTAINED_LOCALES.has(locale),
    )
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
    if (locale === SOURCE_LOCALE) {
      fail(`语言 ${locale} 是当前源语言，不需要再翻译回自己。`)
    }

    if (!DEEPL_LANG_MAP[locale]) {
      fail(`不支持的语言代码：${locale}\n   支持的语言：${Object.keys(DEEPL_LANG_MAP).join(', ')}`)
    }
  }

  return locales
}

function shouldSkipTranslation(value) {
  if (SKIP_TRANSLATION_PATTERNS.some(pattern => pattern.test(value))) return true
  return !/[\p{L}\p{N}]/u.test(value)
}

// ===== 加载源文件 =====
function loadSourceMessages() {
  const sourcePath = join(MESSAGES_DIR, `${SOURCE_LOCALE}.ts`)
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
    if (shouldSkipTranslation(obj)) return obj

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
  console.log(`   源语言：${SOURCE_LABEL} (${SOURCE_LOCALE}.ts / ${SOURCE_LANG})`)
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
    const outPath = join(MESSAGES_DIR, `${locale}.ts`)

    writeFileSync(outPath, content, 'utf-8')
    console.log(`   ✅ 已写入 src/i18n/messages/${locale}.ts\n`)
  }

  console.log('🎉 翻译完成！')
  console.log('💡 建议：机翻结果请人工检查一遍，尤其是专业术语和品牌名称。')
}

main().catch(err => {
  console.error('💥 脚本出错：', err)
  process.exit(1)
})
