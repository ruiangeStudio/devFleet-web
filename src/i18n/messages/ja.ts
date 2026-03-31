export default {
  nav: {
    features: '特徴',
    screenshots: 'スクリーンショット',
    download: 'ダウンロード',
    github: 'GitHub',
    cta: '今すぐダウンロード',
  },
  hero: {
    badge: 'オープンソース - クロスプラットフォームのデスクトップアプリ',
    title: `フロントエンドプロジェクト管理
今までにない`,
    desc: 'DevFleetは、プロジェクト管理、Nodeバージョン切り替え、スクリプト起動、エディタ統合を組み合わせた、フロントエンド開発者のためのオールインワンデスクトップワークステーションです。',
    download: '無料ダウンロード',
    platforms: {
      windows: 'Windows',
      macos: 'macOS',
      linux: 'Linux',
    },
  },
  features: {
    label: '特徴',
    title: 'フロントエンド開発者向け',
    desc: 'プロジェクト管理からNodeのバージョン切り替え、スクリプトの起動からエディタの統合まで、DevFleetは日々の開発ワークフロー全体をカバーします。',
    items: [
      {
        icon: '📦',
        title: 'プロジェクト管理',
        description: 'package.jsonでフォルダを選択してプロジェクトを追加。npmスクリプトとパッケージマネージャ(npm / yarn / pnpm / bun)を自動検出。名前またはパスによるクイック検索をサポート。',
      },
      {
        icon: '🎯',
        title: 'ノードのバージョン管理',
        description: 'nvmd、nvs、nvm、nvm-windowsをサポート。プロジェクトごとに独立したNodeバージョンを割り当て。自動生成された設定ファイルを使用して、ワンクリックでインストール、切り替え、アンインストール。',
      },
      {
        icon: '🚀',
        title: 'スクリプトランチャー',
        description: '外部ターミナルまたはアプリ内マネージドモードでスクリプトを実行。Windows PowerShell、macOS Terminal、Linuxをクロスプラットフォームでサポート。パッケージマネージャに基づいて自動生成されるコマンド。',
      },
      {
        icon: '💻',
        title: 'エディターの統合',
        description: 'ワンクリックでVSCode、Cursor、WebStormのプロジェクトを開くことができます。インストールされているエディタを自動検出し、デフォルトのエディタ設定をサポートします。',
      },
      {
        icon: '🎨',
        title: 'UIとエクスペリエンス',
        description: 'カスタムフレームレスタイトルバーとネイティブウィンドウコントロール。ライトテーマとダークテーマを自由に切り替え。キーボードショートカット。コンポーネントのクラッシュを防ぐエラー境界保護。',
      },
      {
        icon: '⚡',
        title: 'オートアップデート',
        description: 'アプリ内で新バージョンをチェックワンクリックでダウンロードしてインストール。安全で信頼性の高いアップデートのための署名検証を備えたTauri Updaterに基づいて構築されています。',
      },
    ],
  },
  screenshots: {
    label: 'スクリーンショット',
    title: 'エレガントでパワフルなデスクトップ体験',
    desc: 'シームレスな明暗テーマの切り替えが可能な、考え抜かれたデザインのUI。',
    tabs: [
      'プロジェクト',
      'ノード・バージョン',
      'バージョン詳細',
      '自動更新',
      'ライトモード',
    ],
  },
  cta: {
    label: 'ダウンロード',
    title: '開発経験をレベルアップする準備はできていますか？',
    desc: 'DevFleetは完全にフリーでオープンソースです。Windows、macOS、Linuxでご利用いただけます。',
    windows: 'Windows用ダウンロード',
    macos: 'macOS用ダウンロード',
    linux: 'Linux用ダウンロード',
  },
  footer: {
    copyright: '© 2026 DevFleet.無断複写・転載を禁じます。',
    feedback: 'フィードバック',
    changelog: '変更履歴',
  },
}
