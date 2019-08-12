# youtube-meta-analyzer

特定の動画のタグやら投稿時間やらを収集したい

## Usage

1. `config.json` を作成

```json
{
  "key": ""
}
```

2. `input.json` を作成し ID を書き込む

```json
["fLC5TE_KYcw", "0V1vk83iV-o", "TeKTVFgw1hM", "NasyGUeNMTs", "cqncAh_28Es"]
```

3. `npm i` でインストール

4. `npm start -- -f input.json` を実行

5. 完了すれば、 `export/` に JSON が出力される。

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

- `npm run search -- -s <word>` で検索 TOP10 の動画 ID を取得できる
