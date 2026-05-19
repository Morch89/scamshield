import Parser from "rss-parser";

const parser = new Parser();

export default async function handler(req, res) {
  try {
    const feeds = [
      {
        url:
          "https://news.google.com/rss/search?q=Malaysia+scam+OR+fraud+OR+phishing&hl=en-MY&gl=MY&ceid=MY:en",
        language: "en"
      },
      {
        url:
          "https://news.google.com/rss/search?q=Malaysia+online+scam+OR+Macau+scam+OR+bank+scam&hl=en-MY&gl=MY&ceid=MY:en",
        language: "en"
      },
      {
        url:
          "https://news.google.com/rss/search?q=Malaysia+penipuan+OR+scam+OR+phishing&hl=ms&gl=MY&ceid=MY:ms",
        language: "ms"
      },
      {
        url:
          "https://news.google.com/rss/search?q=penipuan+dalam+talian+OR+scam+bank+OR+penipuan+parcel&hl=ms&gl=MY&ceid=MY:ms",
        language: "ms"
      },
// =========================
// CHINESE - Malaysia
// =========================

{
  url:
    `https://news.google.com/rss/search?q=${encodeURIComponent(
      "马来西亚 诈骗"
    )}&hl=zh-CN&gl=MY&ceid=MY:zh-CN`,
  language: "zh"
},

{
  url:
    `https://news.google.com/rss/search?q=${encodeURIComponent(
      "大马 诈骗"
    )}&hl=zh-CN&gl=MY&ceid=MY:zh-CN`,
  language: "zh"
},

{
  url:
    `https://news.google.com/rss/search?q=${encodeURIComponent(
      "投资骗局 马来西亚"
    )}&hl=zh-CN&gl=MY&ceid=MY:zh-CN`,
  language: "zh"
},

{
  url:
    `https://news.google.com/rss/search?q=${encodeURIComponent(
      "线上投资诈骗 马来西亚"
    )}&hl=zh-CN&gl=MY&ceid=MY:zh-CN`,
  language: "zh"
},

{
  url:
    `https://news.google.com/rss/search?q=${encodeURIComponent(
      "中国报 诈骗"
    )}&hl=zh-CN&gl=MY&ceid=MY:zh-CN`,
  language: "zh"
},

{
  url:
    `https://news.google.com/rss/search?q=${encodeURIComponent(
      "东方日报 诈骗"
    )}&hl=zh-CN&gl=MY&ceid=MY:zh-CN`,
  language: "zh"
},

{
  url:
    `https://news.google.com/rss/search?q=${encodeURIComponent(
      "星洲日报 诈骗"
    )}&hl=zh-CN&gl=MY&ceid=MY:zh-CN`,
  language: "zh"
}
    ];

    const allArticles = [];

    for (const feedInfo of feeds) {
      try {
        const feed = await parser.parseURL(feedInfo.url);

        const articles = (feed.items || []).map((item) => ({
          title: item.title || "Untitled article",
          description:
            item.contentSnippet ||
            item.content ||
            "Read full article for more details.",
          url: item.link,
          source: item.source?.title || "Google News",
          publishedAt: item.pubDate || "",
          language: feedInfo.language
        }));

        allArticles.push(...articles);
      } catch (err) {
        console.error("Feed failed:", feedInfo.language, err.message);
      }
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 14);

    const filteredArticles = allArticles.filter((article) => {
      if (!article.publishedAt) return false;
      return new Date(article.publishedAt) >= cutoffDate;
    });

    filteredArticles.sort((a, b) => {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });

    return res.status(200).json({
      articles: filteredArticles.slice(0, 24)
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      articles: []
    });
  }
}
