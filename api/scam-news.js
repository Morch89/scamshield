export default async function handler(req, res) {
  try {
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "NEWS_API_KEY is missing."
      });
    }

    const query = encodeURIComponent(
      'scam OR fraud OR phishing OR "Macau scam" OR "online scam"'
    );

    const url =
      `https://newsapi.org/v2/everything?` +
      `q=${query}&` +
      `language=en&` +
      `sortBy=publishedAt&` +
      `pageSize=6&` +
      `domains=thestar.com.my,malaymail.com,nst.com.my,freemalaysiatoday.com,bernama.com`;

    const response = await fetch(url, {
      headers: {
        "X-Api-Key": apiKey
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || "Failed to fetch scam news."
      });
    }

    const articles = (data.articles || []).map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source?.name || "News",
      publishedAt: article.publishedAt
    }));

    return res.status(200).json({
      articles
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
