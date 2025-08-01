// backend/routes/sitemap.js
const express=require("express");
const router=express.Router();

router.get('/sitemap.xml', async (req, res) => {
  const baseUrl = "https://www.fluteon.com";

  // Mock product/category data - replace with DB query
  const categories = [
    "/women",
    "/women/bottom_wear",
    "/women/bottom_wear/formal_pants",
    "/men/shirts"
  ];

  const products = [
    "/product/formal-pants-001",
    "/product/shirt-white-005"
  ];

  const urls = [...categories, ...products];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map(
      (url) => `
        <url>
          <loc>${baseUrl}${url}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `
    ).join("")}
  </urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(sitemap);
});

module.exports=router;