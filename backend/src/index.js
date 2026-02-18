const express=require("express")
const cors=require('cors');
const helmet = require("helmet");
const { generalLimiter } = require("./middleware/rateLimiter.js");
const app=express();

// Trust proxy for Render deployment (required for rate limiting)
app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "img-src": ["'self'", "data:", "https:"],
        "script-src": ["'self'", "'unsafe-inline'", "https:"],
        "style-src": ["'self'", "'unsafe-inline'", "https:"],
        "font-src": ["'self'", "https:", "data:"],
      },
    },
  })
);
app.use(express.json())

// Apply general rate limiting to all requests
app.use(generalLimiter);

app.use(cors({
  origin: [
    'https://fluteon.com',
    'https://www.fluteon.com',
    'https://fluteon.vercel.app',
    /^https:\/\/.*\.vercel\.app$/, // Allow all Vercel preview URLs
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true
}))

app.get("/",(req,res)=>{
    return res.status(200).send({message:"welcome to ecommerce api - node"})
})

// Health check endpoint for Render and monitoring
app.get('/health', async (req, res) => {
  const mongoose = require('mongoose');
  const health = {
    status: 'ok',
    timestamp: Date.now(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: 'checking...',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
    }
  };
  
  try {
    // Check database connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
      health.database = 'connected';
      health.dbStatus = 'healthy';
    } else {
      health.database = 'disconnected';
      health.dbStatus = 'unhealthy';
      health.status = 'degraded';
    }
    
    const statusCode = health.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    health.database = 'error';
    health.dbStatus = 'unhealthy';
    health.status = 'error';
    health.error = error.message;
    res.status(503).json(health);
  }
});

const sitemapRoutes = require("./routes/sitemapRoutes.js");
app.use('/', sitemapRoutes);
const authRouter=require("./routes/auth.routes.js")
app.use("/auth",authRouter)

const userRouter=require("./routes/user.routes.js");
app.use("/api/users",userRouter)

const productRouter=require("./routes/product.routes.js");
app.use("/api/products",productRouter);

const adminProductRouter=require("./routes/product.admin.routes.js");
app.use("/api/admin/products",adminProductRouter);

const categoryRouter=require("./routes/category.routes.js");
app.use("/api/admin/categories",categoryRouter);

const cartRouter=require("./routes/cart.routes.js")
app.use("/api/cart", cartRouter);

const cartItemRouter=require("./routes/cartItem.routes.js")
app.use("/api/cart_items",cartItemRouter);

const orderRouter=require("./routes/order.routes.js");
app.use("/api/orders",orderRouter);

const paymentRouter=require("./routes/payment.routes.js");
app.use('/api/payments',paymentRouter)

const reviewRouter=require("./routes/review.routes.js");
app.use("/api/reviews",reviewRouter);

const ratingRouter=require("./routes/rating.routes.js");
app.use("/api/ratings",ratingRouter);

const userQueryRoute=require("./routes/userQueryRoute.js");

app.use("/api/user",userQueryRoute);

// for search 


// admin routes handler
const adminOrderRoutes=require("./routes/adminOrder.routes.js");
app.use("/api/admin/orders",adminOrderRoutes);

const couponRoutes = require("../src/routes/coupon.routes.js")
app.use("/api/coupons", couponRoutes);

const chatRoutes = require("../src/routes/chatRoute.js")
app.use("/api",chatRoutes)

const homepageSectionRoutes = require("./routes/homepageSection.routes.js");
app.use("/api/homepage-sections", homepageSectionRoutes);

// // admin dashboard
// app.use("/api/admin/orders", adminOrderRoutes);

module.exports={app};