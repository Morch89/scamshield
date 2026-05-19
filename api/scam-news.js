import Parser from "rss-parser";

const parser = new Parser();

export default async function handler(req, res) {
  try {
    const feeds = [
      // English
      {
        url:
          "https://news.google.com/rss/search?q=Malaysia+scam+OR+fraud+OR+phishing&hl=en-MY&gl=MY&ceid=MY:en",
        language: "en"
      },

      // Bahasa Melayu
      {
        url:
          "https://news.google.com/rss/search?q=Malaysia+scam+OR+penipuan+OR+phishing&hl=ms&gl=MY&ceid=MY:ms",
        language: "ms"
      },

      // Chinese
      {
        url:
          "https://news.google.com/rss/search?q=Malaysia+诈骗+OR+骗局+OR+钓鱼&hl=zh-CN&gl=MY&ceid=MY:zh-Hans",
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

    // Sort newest first
    allArticles.sort((a, b) => {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });

    return res.status(200).json({
      articles: allArticles.slice(0, 12)
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message,
      articles: []
    });
  }
}
