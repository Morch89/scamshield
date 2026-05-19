import Parser from "rss-parser";

const parser = new Parser();

export default async function handler(req, res) {
  try {
    const feeds = [
      // =========================
      // ENGLISH
      // =========================
      {
        url:
          "https://news.google.com/rss/search?q=Malaysia+scam+OR+fraud+OR+phishing&hl=en-MY&gl=MY&ceid=MY:en",
        language: "en"
      },

      // =========================
      // BAHASA MELAYU
      // =========================
      {
        url:
          "https://news.google.com/rss/search?q=Malaysia+penipuan+OR+scam+OR+phishing&hl=ms&gl=MY&ceid=MY:ms",
        language: "ms"
      },

      // =========================
      // CHINESE
      // =========================
      {
        url:
          "https://rsshub.app/sinchew/tag/%E8%AF%88%E9%AA%97",
        language: "zh"
      }
    ];

    const allArticles = [];

    for (const feedInfo of feeds) {
      try {
        const feed = await parser.parseURL(feedInfo.url);

        console.log(
          "Feed success:",
          feedInfo.language,
          feed.items?.length || 0
        );

        const articles = (feed.items || []).map((item) => ({
          title: item.title || "Untitled article",

          description:
            item.contentSnippet ||
            item.content ||
            "Read full article for more details.",

          url: item.link,

          source:
            item.source?.title ||
            (feedInfo.language === "zh"
              ? "Sin Chew"
              : "Google News"),

          publishedAt: item.pubDate || "",

          language: feedInfo.language
        }));

        allArticles.push(...articles);

      } catch (err) {
        console.error(
          "Feed failed:",
          feedInfo.language,
          err.message
        );
      }
    }

    // Remove duplicates
    const seen = new Set();

    const uniqueArticles = allArticles.filter((article) => {
      if (seen.has(article.url)) return false;

      seen.add(article.url);

      return true;
    });

    // Sort newest first
    uniqueArticles.sort((a, b) => {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });

    return res.status(200).json({
      articles: uniqueArticles.slice(0, 30)
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message,
      articles: []
    });
  }
}
