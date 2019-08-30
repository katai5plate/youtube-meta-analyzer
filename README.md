# youtube-meta-analyzer

特定の動画のタグやら投稿時間やらを収集したい

## 取り扱い説明書

### 必要なもの
- Node.js
- Git
- YouTube API のキー
  - この手順でAPIキーを入手する: https://www.plusdesign.co.jp/blog/?p=7752
- お好きなコーディングエディタ（ vscode, ATOM など ）

### ダウンロードとインストール

0. インストールしたいフォルダをコマンドプロンプト/ターミナルで開く
1. `git clone https://github.com/katai5plate/youtube-meta-analyzer` を実行(要Git)
2. `youtube-meta-analyzer` がダウンロードされるので、ディレクトリをコマンドプロンプト/ターミナルで開く
3. `npm install` を実行(要Node.js)

### 使用方法

0. `youtube-meta-analyzer` ディレクトリに `config.json` と `input.json` というファイルを作成
1. `config.json` は以下のような内容にする。（[文法](http://www.tohoho-web.com/ex/json.html)に注意）
```js
{
  "key": "API-KEY-HERE"
}
```
2. `config.json` の `API-KEY-HERE` のところに、自分の YouTube API キー を入力する
3. `input.json` は以下のような内容にする。英数文字列の部分に、自分がタグを取得したい動画のIDを入力する。（[文法](http://www.tohoho-web.com/ex/json.html)に注意）
```json
[
  "fLC5TE_KYcw",
  "0V1vk83iV-o",
  "TeKTVFgw1hM",
  "NasyGUeNMTs",
  "cqncAh_28Es"
]
```
4. `youtube-meta-analyzer` ディレクトリをコマンドプロンプト/ターミナルで開く
5. `npm start -- -f input.json` を実行(要Node.js)
6. 問題なければ、 `youtube-meta-analyzer/export/` に結果が出力される

- こんな画面になる
```
DONE FETCH CATEGORIES
READY fLC5TE_KYcw
DONE fLC5TE_KYcw
READY 0V1vk83iV-o
DONE 0V1vk83iV-o
READY TeKTVFgw1hM
DONE TeKTVFgw1hM
READY NasyGUeNMTs
DONE NasyGUeNMTs
READY cqncAh_28Es
DONE cqncAh_28Es
FINISH
```

### その他の機能

- `npm run search -- -s <word>` で検索 TOP10 の動画 ID を取得できる。
