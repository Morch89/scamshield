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
    const hasChineseArticles = uniqueArticles.some(
  (article) => article.language === "zh"
);

if (!hasChineseArticles) {
  uniqueArticles.push(
    {
      title: "误信24小时可获双倍回酬 华裔女会计师被骗逾15万",
      description: "中国报报道，一名女子误信投资可在短时间内获得高回报，结果被骗超过15万令吉。",
      url: "https://www.chinapress.com.my/20260514/%e8%af%af%e4%bf%a124%e5%b0%8f%e6%97%b6%e5%8f%af%e8%8e%b7%e5%8f%8c%e5%80%8d%e5%9b%9e%e9%85%ac-%e5%8d%8e%e8%a3%94%e5%a5%b3%e4%bc%9a%e8%ae%a1%e5%b8%88%e8%a2%ab%e9%aa%97%e9%80%be15%e4%b8%87/",
      source: "中国报",
      publishedAt: "2026-05-14T00:00:00.000Z",
      language: "zh"
    },
    {
      title: "误信投资赚进164万 退休教师提现失败方知被骗35万",
      description: "中国报报道，一名退休教师误信投资骗局，在无法提现后才发现被骗35万令吉。",
      url: "https://www.chinapress.com.my/20260514/%e8%af%af%e4%bf%a1%e6%8a%95%e8%b5%84%e8%b5%9a%e8%bf%9b164%e4%b8%87-%e9%80%80%e4%bc%91%e6%95%99%e5%b8%88%e6%8f%90%e7%8e%b0%e5%a4%b1%e8%b4%a5-%e6%96%b9%e7%9f%a5%e8%a2%ab%e8%af%8835%e4%b8%87/",
      source: "中国报",
      publishedAt: "2026-05-14T00:00:00.000Z",
      language: "zh"
    }
  );
}
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
