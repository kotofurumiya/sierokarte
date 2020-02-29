const { CloudFirestoreConnector} = require('./connector/cloudfirestore');
const { Fetcher } = require('./lib/fetcher');
const { DiscordSender } = require('./lib/sender');

const express = require('express');
const app = express();

async function main() {
  const connector = new CloudFirestoreConnector();
  const fetcher = new Fetcher({connector});
  const sender = new DiscordSender();

  const articleFetch = await fetcher.fetchArticleData();
  const {recentArticles, pastArticles, newArticles} = articleFetch;

  if(articleFetch.isInitialFetch) {
    const lines = [
      'こんにちは〜。',
      '皆さんにグラブルの最新ニュースをお届けする準備ができました〜。',
      '新しい公式ニュースを見つけたらお知らせするので、これからよろしくお願いします〜。'
    ];

    await sender.sendMessage(lines.join('\n'));
    await connector.writePastArticles(recentArticles);
    return;
  }

  for(const article of newArticles) {
    const lines = [
      `新しいニュースが届きました〜！`,
      '',
      article.title,
      article.url
    ];

    await sender.sendMessage(lines.join('\n'));
  }

  const limit = 10;
  await connector.writePastArticles([...newArticles, ...pastArticles].slice(0, limit));
};

app.get('/', (req, res) => {
  main().then(() => res.sendStatus(200));
});

const port = process.env.PORT || 8080;
app.listen(port);