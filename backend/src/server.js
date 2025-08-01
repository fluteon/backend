const { app } = require(".");
const { connectDb } = require("./config/db");

const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  await connectDb();
  console.log("ecommerce api listing on port", PORT);
});
