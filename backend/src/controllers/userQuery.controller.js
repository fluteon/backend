const userQueryService = require("../services/userQuery.Service");
exports.createUserQuery = async (req, res) => {
  try {
    const { name, phone, message } = req.body;
    const user = req.user; // Must be attached by auth middleware

    const query = await userQueryService.saveUserQuery({
      name,
      phone,
      message,
      user,
    });

    res.status(201).json({
      success: true,
      message: "Query submitted successfully.",
      data: query,
    });
  } catch (err) {
    console.error("Error creating user query:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while submitting your query.",
    });
  }
};
