const axios = require('axios');

async function testProductsAPI() {
  try {
    console.log('🧪 Testing Products API...\n');
    
    // Test 1: Health check
    const health = await axios.get('http://localhost:8000/health');
    console.log('✅ Health Check:', health.data.status);
    console.log('   Database:', health.data.database);
    console.log('');
    
    // Test 2: Get products
    const products = await axios.get('http://localhost:8000/api/products?pageSize=5');
    console.log('✅ Products API Response:');
    console.log('   Current Page:', products.data.currentPage);
    console.log('   Total Pages:', products.data.totalPages);
    console.log('   Products Found:', products.data.content.length);
    
    if (products.data.content.length > 0) {
      console.log('\n📦 Sample Product:');
      const sample = products.data.content[0];
      console.log('   Title:', sample.title);
      console.log('   Price:', sample.price);
      console.log('   Discounted Price:', sample.discountedPrice);
      console.log('   Category:', sample.category?.name || 'N/A');
    } else {
      console.log('\n⚠️  No products found in database!');
    }
    
  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.status);
      console.error('   Message:', error.response.data);
    } else if (error.request) {
      console.error('❌ Network Error: Could not connect to server');
      console.error('   Make sure backend is running on port 8000');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

testProductsAPI();
