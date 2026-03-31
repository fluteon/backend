const http = require('http');

const payload = JSON.stringify({
  title: "Test Product",
  description: "Test Desc",
  price: 100,
  discountedPrice: 90,
  discountPersent: 10,
  quantity: 50,
  brand: "TestBrand",
  color: "Red",
  topLavelCategory: "women",
  secondLavelCategory: "bottom_wear",
  thirdLavelCategory: "cotton_pants",
  size: '[{"name":"S","quantity":50}]',
  existingImages: '["img1", "img2", "img3", "img4"]'
});

console.log('Sending request...');
const req = http.request({
  hostname: '127.0.0.1',
  port: 8000,
  path: '/api/admin/products/687797d20c229ed03eb32643',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, res => {
  let data = '';
  console.log('STATUS:', res.statusCode);
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => console.log('RESPONSE:', data));
});

req.on('error', e => console.log('ERROR:', e.message));
req.write(payload);
req.end();
