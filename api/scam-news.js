import Parser from "rss-parser";
import * as cheerio from "cheerio";

const parser = new Parser();

async function fetchChineseTagPage(url, sourceName) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 ScamShieldMalaysiaBot/1.0 (+https://scamshield-malaysia.vercel.app)"
    }
  });

  const html = await response.text();
  const $ = cheerio.load(html);

  const articles = [];

  $("a").each((_, el) => {
    const title = $(el).text().replace(/\s+/g, " ").trim();
    const href = $(el).attr("href");

    if (!title || !href) return;
    if (title.length < 12) return;

    const combined = `${title} ${href}`;

    const isScamRelated =
      combined.includes("诈骗") ||
      combined.includes("骗局") ||
      combined.includes("网络诈骗") ||
      combined.includes("投资") ||
      combined.includes("回酬") ||
      combined.includes("提现") ||
      combined.includes("老千");

    if (!isScamRelated) return;

    const fullUrl = href.startsWith("http") ? href : new URL(href, url).href;

    articles.push({
      title,
      description: "点击阅读全文，了解最新诈骗相关报道。",
      url: fullUrl,
      source: sourceName,
      publishedAt: new Date().toISOString(),
      language: "zh"
    });
  });

  const seen = new Set();

  return articles.filter((article) => {
    if (seen.has(article.url)) return false;
    seen.add(article.url);
    return true;
  });
}

export default async function handler(req, res) {
  try {
    const rssFeeds = [
      {
        url:
          "https://news.google.com/rss/search?q=Malaysia+scam+OR+fraud+OR+phishing&hl=en-MY&gl=MY&ceid=MY:en",
        language: "en"
      },
      {
        url:
          "https://news.google.com/rss/search?q=Malaysia+penipuan+OR+scam+OR+phishing&hl=ms&gl=MY&ceid=MY:ms",
        language: "ms"
      }
    ];

    const allArticles = [];

    for (const feedInfo of rssFeeds) {
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
        console.error("RSS feed failed:", feedInfo.language, err.message);
      }
    }

    const chinesePages = [
      {
        url: "https://www.chinapress.com.my/tag/%E8%AF%88%E9%AA%97/",
        source: "China Press"
      },
      {
        url: "https://www.chinapress.com.my/tag/%E7%BD%91%E7%BB%9C%E8%AF%88%E9%AA%97/",
        source: "China Press"
      },
      {
        url: "https://www.sinchew.com.my/tag/%E8%AF%88%E9%AA%97",
        source: "Sin Chew"
      }
    ];

    for (const page of chinesePages) {
      try {
        const articles = await fetchChineseTagPage(page.url, page.source);
        allArticles.push(...articles);
      } catch (err) {
        console.error("Chinese page failed:", page.source, err.message);
      }
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 14);

    const filteredArticles = allArticles.filter((article) => {
      if (!article.publishedAt) return true;
      return new Date(article.publishedAt) >= cutoffDate;
    });

    filteredArticles.sort((a, b) => {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });

    const seen = new Set();
    const uniqueArticles = filteredArticles.filter((article) => {
      if (seen.has(article.url)) return false;
      seen.add(article.url);
      return true;
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
