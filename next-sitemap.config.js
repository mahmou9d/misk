/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.miskstores.com",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ["/admin", "/dashboard"],
};
