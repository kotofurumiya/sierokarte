# Sierokarte

グラブル公式サイトのニュースをDiscordにお知らせするbot。

## 前準備

Discordの準備

1. お知らせを投稿したいチャンネルの設定画面を開く
2. 「ウェブフック」を選び、ウェブフックを作成する
3. 生成されたウェブフックURLをメモしておく

Firebaseの準備

1. Firebaseプロジェクトを作成する
2. プロジェクトを開き、Cloud Firestoreを作成する
3. Firebaseの設定画面からFirebase Admin SDKサービスアカウントの秘密鍵を生成する
4. 生成された秘密鍵JSONファイルをダウンロードする

## ビルド

Dockerを用いてコンテナをビルドする。

```
docker build -t sierokarte .
```

## 単発実行

各種環境変数を設定し実行する

* PROJECT_ID
  * 秘密鍵JSONファイルの中に記載されているのでコピーする
* PRIVATE_KEY
  * 秘密鍵JSONファイルの中に記載されているのでコピーする
* CLIENT_EMAIL
  * 秘密鍵JSONファイルの中に記載されているのでコピーする
* DISCORD_WEBHOOK_URL
  * 最初にメモしたウェブフックのURL

Dockerコマンドでサーバを起動する。

```
docker run --rm -it -p 8080:8080 \
           --env PROJECT_ID=your-firebase-id \
           --env PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nxxxxxx\n-----END PRIVATE KEY-----\n" \
           --env CLIENT_EMAIL=xxxx@example.iam.gserviceaccount.com \
           --env DISCORD_WEBHOOK_URL=https://discordapp.com/api/webhooks/xxxxxx \
           sierokarte
```

curlコマンドなどでサーバを叩く(GETメソッド)。

```
curl http://localhost:8080/
```

サーバを叩くと1度だけ公式サイトをチェックし、新規記事があった場合はDiscordに投稿する。
ただし初回実行時はDiscordにシェロからの挨拶を投稿する。

## 定期実行

定期的に新着記事をチェックするには、定期的にサーバを叩く必要がある。
cronやCloud Scheduler(GCP)を使うことで自動で実行することができる。