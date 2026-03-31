const http = require('http');

console.log('Sending multipart request...');
const bound = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

let body = '';
body += '--' + bound + '\r\n';
body += 'Content-Disposition: form-data; name="title"\r\n\r\n';
body += 'Test Product\r\n';

body += '--' + bound + '\r\n';
body += 'Content-Disposition: form-data; name="discountedPrice"\r\n\r\n';
body += '90\r\n';

body += '--' + bound + '\r\n';
body += 'Content-Disposition: form-data; name="discountPersent"\r\n\r\n';
body += '10\r\n';

body += '--' + bound + '\r\n';
body += 'Content-Disposition: form-data; name="price"\r\n\r\n';
body += '100\r\n';

body += '--' + bound + '\r\n';
body += 'Content-Disposition: form-data; name="quantity"\r\n\r\n';
body += '50\r\n';

body += '--' + bound + '\r\n';
body += 'Content-Disposition: form-data; name="brand"\r\n\r\n';
body += 'TestBrand\r\n';

body += '--' + bound + '\r\n';
body += 'Content-Disposition: form-data; name="color"\r\n\r\n';
body += '["Red"]\r\n';

body += '--' + bound + '\r\n';
body += 'Content-Disposition: form-data; name="topLavelCategory"\r\n\r\n';
body += 'women\r\n';

body += '--' + bound + '\r\n';
body += 'Content-Disposition: form-data; name="secondLavelCategory"\r\n\r\n';
body += 'bottom_wear\r\n';

body += '--' + bound + '\r\n';
body += 'Content-Disposition: form-data; name="thirdLavelCategory"\r\n\r\n';
body += 'cotton_pants\r\n';

body += '--' + bound + '\r\n';
body += 'Content-Disposition: form-data; name="size"\r\n\r\n';
body += '[{"name":"S","quantity":50}]\r\n';

body += '--' + bound + '\r\n';
body += 'Content-Disposition: form-data; name="existingImages"\r\n\r\n';
body += '["img1", "img2", "img3", "img4"]\r\n';

body += '--' + bound + '--\r\n';

const req = http.request({
  hostname: '127.0.0.1',
  port: 8000,
  path: '/api/admin/products/687797d20c229ed03eb32643',
  method: 'PUT',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=' + bound,
    'Content-Length': Buffer.byteLength(body)
  }
}, res => {
  let data = '';
  console.log('STATUS:', res.statusCode);
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => console.log('RESPONSE:', data));
});

req.on('error', e => console.log('ERROR:', e.message));
req.write(body);
req.end();
