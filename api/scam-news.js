import Parser from "rss-parser";

const parser = new Parser();

export default async function handler(req, res) {
  try {
const feeds = [
  // =========================
  // ENGLISH - Malaysia
  // =========================

  {
    url:
      "https://news.google.com/rss/search?q=(site:thestar.com.my+OR+site:nst.com.my+OR+site:freemalaysiatoday.com+OR+site:malaymail.com)+scam+OR+fraud+OR+phishing&hl=en-MY&gl=MY&ceid=MY:en",
    language: "en"
  },

  {
    url:
      "https://news.google.com/rss/search?q=(site:thestar.com.my+OR+site:nst.com.my)+online+scam+OR+Macau+scam+OR+bank+scam&hl=en-MY&gl=MY&ceid=MY:en",
    language: "en"
  },

  // =========================
  // BAHASA MELAYU - Malaysia
  // =========================

  {
    url:
      "https://news.google.com/rss/search?q=(site:hmetro.com.my+OR+site:bharian.com.my+OR+site:sinarharian.com.my+OR+site:kosmo.com.my)+penipuan+OR+scam+OR+phishing&hl=ms&gl=MY&ceid=MY:ms",
    language: "ms"
  },

  {
    url:
      "https://news.google.com/rss/search?q=(site:hmetro.com.my+OR+site:sinarharian.com.my)+penipuan+dalam+talian+OR+scam+bank+OR+penipuan+parcel&hl=ms&gl=MY&ceid=MY:ms",
    language: "ms"
  },

  // =========================
// CHINESE - Malaysia
// =========================

{
  url:
    `https://news.google.com/rss/search?q=${encodeURIComponent(
      "site:orientaldaily.com.my 诈骗"
    )}&hl=zh-CN&gl=MY&ceid=MY:zh-CN`,
  language: "zh"
},

{
  url:
    `https://news.google.com/rss/search?q=${encodeURIComponent(
      "site:orientaldaily.com.my 投资骗局"
    )}&hl=zh-CN&gl=MY&ceid=MY:zh-CN`,
  language: "zh"
},

{
  url:
    `https://news.google.com/rss/search?q=${encodeURIComponent(
      "site:sinchew.com.my 诈骗"
    )}&hl=zh-CN&gl=MY&ceid=MY:zh-CN`,
  language: "zh"
},

{
  url:
    `https://news.google.com/rss/search?q=${encodeURIComponent(
      "site:sinchew.com.my 骗局"
    )}&hl=zh-CN&gl=MY&ceid=MY:zh-CN`,
  language: "zh"
},

{
  url:
    `https://news.google.com/rss/search?q=${encodeURIComponent(
      "site:chinapress.com.my 投资骗局"
    )}&hl=zh-CN&gl=MY&ceid=MY:zh-CN`,
  language: "zh"
},

{
  url:
    `https://news.google.com/rss/search?q=${encodeURIComponent(
      "site:chinapress.com.my 诈骗 OR 骗局"
    )}&hl=zh-CN&gl=MY&ceid=MY:zh-CN`,
  language: "zh"
},

// Chinese fallback - broader Malaysia search
{
  url:
    `https://news.google.com/rss/search?q=${encodeURIComponent(
      "马来西亚 诈骗 OR 骗局 OR 投资骗局 OR 网络诈骗"
    )}&hl=zh-CN&gl=MY&ceid=MY:zh-CN`,
  language: "zh"
}

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
cutoffDate.setDate(cutoffDate.getDate() - 7);

const filteredArticles = allArticles.filter((article) => {
  if (!article.publishedAt) return false;

  return new Date(article.publishedAt) >= cutoffDate;
});
    
    // Sort newest first
    filteredArticles.sort((a, b) => {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });

    return res.status(200).json({
      articles: filteredArticles.slice(0, 16)
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message,
      articles: []
    });
  }
}
