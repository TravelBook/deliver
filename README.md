# deliver

TypeScript で作成した JavaScript ユーティリティを jsDelivr CDN 経由で配信するプロジェクト

## 開発環境

このプロジェクトは **TypeScript** と **Jest** を使用した開発ワークフローを採用しています。

### 前提条件
- Node.js v18以上 (v22以上推奨)

### プロジェクト構成


（例）
```
deliver/
├── src/                           # TypeScript ソースファイル
│   └── valid-jpn-phone-number.ts
├── test/                          # Jest テストファイル
│   └── valid-jpn-phone-number.test.ts
├── scripts/
│   └── build-all.mjs              # ビルドスクリプト
└── valid-jpn-phone-number.js      # ビルド済み配信ファイル
```

### 開発コマンド

```bash
# 依存関係をインストール
npm install

# TypeScript から JavaScript をビルド
npm run build

# 全てのテストを実行 (Jest + TypeScript)
npm test

# テストを監視モードで実行
npm run test:watch
```

## ビルドプロセス

1. **TypeScript コンパイル**: `tsc` でJavaScriptに変換
2. **後処理**: import/export 文を除去してブラウザ用に変換
3. **一時ディレクトリの自動削除**: ビルド後のクリーンアップ

生成される JavaScript ファイルは TypeScript ソースとほぼ同一で、グローバル関数として使用できます。

## 新しいユーティリティの追加

```bash
# 1. TypeScript ファイルを作成
echo 'export function newUtility() { return "hello"; }' > src/new-utility.ts

# 2. テストファイルを作成
echo 'import { newUtility } from "../src/new-utility";' > test/new-utility.test.ts

# 3. ビルド実行
npm run build
# → new-utility.js がルートディレクトリに自動生成される
```

## ブラウザでの使用方法

生成されたファイルは CDN 経由でグローバル関数として使用できます：

```html
<!-- CDN から読み込み -->
<script src="https://cdn.jsdelivr.net/gh/ユーザー名/deliver/valid-jpn-phone-number.js"></script>

<script>
  // グローバル関数として直接使用可能
  console.log(isValidJpnPhoneNumber('09012345678')); // true
  console.log(isTooSequential('01234567', 6, 1));   // true
</script>
```

## jsDelivr 配信設定

### 前提条件

- GitHub リポジトリが **公開 (public)** であること
- 配信したいファイル（例: `.js`, `.css`, 画像など）がリポジトリ内に存在すること

### 配信方法

1. **GitHub にコードを公開**
   リポジトリを public として公開します。

2. **jsDelivr の URL 形式**
   以下の形式でアクセスすると、最新コミットからファイルを配信します。

   ```
   https://cdn.jsdelivr.net/gh/{GitHubユーザー名}/{リポジトリ名}/{ファイル名.js}
   ```

   - `{GitHubユーザー名}`: GitHub のユーザー名（例: `travelbook`）
   - `{リポジトリ名}`: リポジトリ名（例: `deliver`）
   - `{パス/to/ファイル.ext}`: 配信したいファイルの相対パス（例: `valid-jpn-phone-number.js`）

   **例:** `https://cdn.jsdelivr.net/gh/travelbook/deliver/valid-jpn-phone-number.js`

3. **特定のコミットやタグを指定する場合**
   コミット SHA やタグ名を指定可能です。
   ```
   https://cdn.jsdelivr.net/gh/{ユーザー名}/{リポジトリ名}@{タグ名またはSHA}/{パス/to/ファイル.ext}
   ```

   **例:** `https://cdn.jsdelivr.net/gh/travelbook/my-project@v1.2.3/dist/main.js`

## キャッシュのパージ (Purge)

jsDelivr はグローバル CDN のためキャッシュ反映に数分〜数十分かかる場合があります。
すぐに最新ファイルを配信したい場合は、以下の Purge ツールを利用してください。

- **URL:** https://www.jsdelivr.com/tools/purge

### 手順

1. 上記ページを開く
2. 「Purge now」フォームに配信 URL を貼り付け
3. **Purge now** ボタンをクリック

![Purge Tool のスクリーンショット](docs/jsdelivr-purge-screenshot.png)