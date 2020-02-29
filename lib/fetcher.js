const axios = require('axios');
const { JSDOM } = require('jsdom');

// partial.phpで3記事ずつ取得できる
// partial.php?p=2 とかで2ページ目取得できる
const OFFICIAL_NEWS_URL = 'https://granbluefantasy.jp/news/partial.php';

// 直近の記事を取得して返す
// 戻り値は Array<{ title: string, url: string }>
const fetchRecentArticles = async () => {
  const dom = await axios.get(OFFICIAL_NEWS_URL, { responseType: 'text '})
                         .then((res) => new JSDOM(res.data));
  const document = dom.window.document;

  const limit = 5;
  const recentArticleElements = Array.from(document.querySelectorAll('article')).slice(0, limit);

  const recentArticles = recentArticleElements.map((article) => {
    const anchor = article.querySelector('a');
    const url = anchor.href;
    const title = anchor.textContent;
    return { title, url };
  });

  return recentArticles;
};

class Fetcher {
  #connector;

  constructor({connector}) {
    this.#connector = connector;
  }

  async fetchArticleData() {
    const recentArticles = await fetchRecentArticles();
    const pastArticles = await this.#connector.getPastArticles();
    const pastUrls = pastArticles.map(({url}) => url);
    const newArticles = recentArticles.filter((a) => !pastUrls.includes(a.url));

    const isInitialFetch = pastArticles.length === 0;

    return {
      isInitialFetch,
      recentArticles,
      pastArticles,
      newArticles
    };
  }
}

module.exports = {
  Fetcher
};