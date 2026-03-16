const { format } = require('date-fns');

const createSitemap = async (news) => {
  const baseUrl = process.env.BASE_URL || 'https://nnc-news-platform.vercel.app';
  
  const categories = [
    'Politics', 'International','Shares', 'Technology', 'Sports', 'Business', 'Entertainment', 'Health'
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Homepage -->
      <url>
        <loc>${baseUrl}</loc>
        <changefreq>always</changefreq>
        <priority>1.0</priority>
      </url>
      
      <!-- Category Pages -->
      ${categories.map(category => `
        <url>
          <loc>${baseUrl}/category/${category.toLowerCase()}</loc>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
      
      <!-- News Articles -->
      ${news.map(article => `
        <url>
          <loc>${baseUrl}/news/${article._id}</loc>
          <lastmod>${format(new Date(article.updatedAt || article.createdAt), 'yyyy-MM-dd')}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>
      `).join('')}
    </urlset>
  `;

  return sitemap.trim();
};

module.exports = { createSitemap };