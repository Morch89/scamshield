import Parser from "rss-parser";

const parser = new Parser();
function cleanDescription(text, language = "en") {
  const cleaned = String(text || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    if (language === "zh") {
      return "点击阅读全文了解更多诈骗相关新闻。";
    }

    if (language === "ms") {
      return "Klik untuk membaca artikel penuh berkaitan scam.";
    }

    return "Read the full article for more details.";
  }

  // Chinese summarisation
  if (language === "zh") {
    return cleaned.slice(0, 70) + (cleaned.length > 70 ? "..." : "");
  }

  // BM summarisation
  if (language === "ms") {
    return cleaned.slice(0, 120) + (cleaned.length > 120 ? "..." : "");
  }

  // English summarisation
  return cleaned.slice(0, 140) + (cleaned.length > 140 ? "..." : "");
}
function isMalaysiaRelevantArticle(item, language = "en") {
  const text = `${item.title || ""} ${item.contentSnippet || ""} ${item.content || ""} ${item.link || ""}`;

  if (language !== "zh") return true;

  const malaysiaSignals = [
    "马来西亚",
    "大马",
    "我国",
    "全国",
    "吉隆坡",
    "雪兰莪",
    "槟城",
    "柔佛",
    "新山",
    "霹雳",
    "怡保",
    "森美兰",
    "马六甲",
    "彭亨",
    "登嘉楼",
    "吉兰丹",
    "沙巴",
    "砂拉越",
    "令吉",
    "警方",
    "商业罪案",
    "武吉阿曼",
    "国家银行",
    "报案",
    "女会计师",
    "退休教师"
  ];

  return malaysiaSignals.some((word) => text.includes(word));
}
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
// CHINESE - Malaysia via RSSHub mirror
// =========================

{
  url: "https://rsshub.rssforever.com/sinchew/tag/%E8%AF%88%E9%AA%97",
  language: "zh",
  sourceName: "星洲日报"
},

{
  url: "https://rsshub.rssforever.com/sinchew/tag/%E9%AA%97%E5%B1%80",
  language: "zh",
  sourceName: "星洲日报"
},

{
  url: "https://rsshub.rssforever.com/sinchew/tag/%E6%8A%95%E8%B5%84%E9%AA%97%E5%B1%80",
  language: "zh",
  sourceName: "星洲日报"
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

        const articles = (feed.items || [])
  .filter((item) => isMalaysiaRelevantArticle(item, feedInfo.language))
  .map((item) => ({
    title: item.title || "Untitled article",
    description: cleanDescription(
      item.contentSnippet || item.content,
      feedInfo.language
    ),
    url: item.link,
    source:
      feedInfo.sourceName ||
      item.source?.title ||
      "Google News",
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
