const fs = require('fs');
const { createOrder } = require('./src/services/order.service.js');
fs.writeFileSync('create_dump.txt', createOrder.toString());
process.exit(0);
