/**
 * DeepL 状态检查脚本
 *
 * 这个脚本只负责检查：
 * - API Key 是否有效
 * - 当前已用字符数
 * - 当前剩余字符数
 * - 使用占比
 *
 * 它不会执行任何翻译，也不会改动 i18n 文案文件。
 *
 * 使用方法：
 *   pnpm deepl:status
 *   pnpm deepl:status -- --key YOUR_DEEPL_API_KEY
 *
 * 也可以设置环境变量替代 --key 参数：
 *   .env => DEEPL_API_KEY=your-key
 *   pnpm deepl:status
 */

import * as deepl from 'deepl-node'
import { existsSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = join(__dirname, '..')
const ENV_FILES = ['.env']

loadEnvFiles()

const args = process.argv.slice(2)

function getArg(name) {
  const idx = args.indexOf(`--${name}`)
  return idx !== -1 ? args[idx + 1] : null
}

function fail(message) {
  console.error(`❌ ${message}`)
  process.exit(1)
}

function maskApiKey(apiKey) {
  if (!apiKey) return '(missing)'
  if (apiKey.length <= 8) return '****'
  return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`
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
DeepL 状态检查脚本

用法：
  pnpm deepl:status
  pnpm deepl:status -- --key YOUR_DEEPL_API_KEY

参数：
  --key <DEEPL_API_KEY>  可选，未传时读取环境变量 DEEPL_API_KEY
  --help                 查看帮助

说明：
  只检查 Key 可用性和额度，不执行任何翻译
  也支持项目根目录的 .env 文件
`)
}

async function main() {
  if (args.includes('--help') || args.includes('-h')) {
    printHelp()
    process.exit(0)
  }

  const apiKey = getArg('key') || process.env.DEEPL_API_KEY

  if (!apiKey) {
    fail('缺少 API Key！请用 --key 参数或 DEEPL_API_KEY 环境变量提供。')
  }

  console.log('\n🔎 DeepL 状态检查')
  console.log(`   API Key：${maskApiKey(apiKey)}`)

  const translator = new deepl.Translator(apiKey)

  try {
    const usage = await translator.getUsage()
    const used = usage.character?.count ?? 0
    const limit = usage.character?.limit ?? 0
    const remaining = limit > 0 ? Math.max(limit - used, 0) : null
    const percent = limit > 0 ? ((used / limit) * 100).toFixed(2) : null

    console.log('✅ API Key 有效')
    console.log(`   已用字符：${used.toLocaleString()}`)

    if (limit > 0) {
      console.log(`   总额度：${limit.toLocaleString()}`)
      console.log(`   剩余额度：${remaining.toLocaleString()}`)
      console.log(`   使用占比：${percent}%`)
    } else {
      console.log('   当前套餐未返回字符上限')
    }

    if (usage.document) {
      const docUsed = usage.document.count ?? 0
      const docLimit = usage.document.limit ?? 0
      console.log(`   文档额度：${docUsed.toLocaleString()} / ${docLimit.toLocaleString()}`)
    }
  } catch (err) {
    fail(`API Key 无效或网络错误：${err.message}`)
  }
}

main().catch(err => {
  console.error('💥 脚本出错：', err)
  process.exit(1)
})
