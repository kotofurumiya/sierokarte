# Sierokarte

グラブル公式サイトのニュースをDiscordにお知らせするbot。

![](./doc/img/news.png)

## 前準備

Discordの準備

1. お知らせを投稿したいチャンネルの設定画面を開く
2. 「ウェブフック」を選び、各項目を適当に入力しウェブフックを作成する
3. 生成されたウェブフックURLをメモしておく

Firebaseの準備

1. 適当なFirebaseプロジェクトを作成する
2. プロジェクトの「Database」を開き、Cloud Firestoreを「本番ルール」「asia-northeast1リージョン」で作成（※1）する
4. Firebaseの設定画面からFirebase Admin SDKサービスアカウントの秘密鍵を生成する
5. 生成された秘密鍵JSONファイルをダウンロードする

（※1） 他のリージョンを選択すると定期実行が難しくなる場合がある

## ビルド

Dockerを用いてコンテナをビルドする。

```
docker build -t sierokarte .
```

## ローカルでの手動による単発実行

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

![](./doc/img/hello.png)

## クラウドでの定期実行（推奨）

一定周期で新着記事をチェックするには、定期的にサーバを叩く必要がある。

クラウドサービスで動作させるには以下の設定をする。
 
1. Fargate（AWS）やCloud Run（GCP）に適切な環境変数とともにコンテナをデプロイする
2. Lambda（AWS）やCloud Scheduler（GCP）でコンテナに対する定期的なHTTPリクエストを設定する

コンテナのポート番号はデフォルトで8080になる。変更したい場合は環境変数PORTを指定する。

## 自前のサーバでの定期実行（非推奨）

サポート対象外ではあるが、自分のサーバやパソコンで動作させることもできる。
以下の手順となる。

1. コンテナを起動する
2. cronなどでコンテナに定期的なHTTPリクエストを送る