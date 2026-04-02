const fs = require('fs');
const { rewardeSuperCoins } = require('./src/services/order.service.js');
fs.writeFileSync('function_dump.txt', rewardeSuperCoins.toString());
process.exit(0);
