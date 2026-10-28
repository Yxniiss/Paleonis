const Dashboard = require("../models/Dashboard");

exports.getDashboard = async (req, res, next) => {
  try {
    const [chiffreAffaires, serveurs] = await Promise.all([
      Dashboard.chiffreAffaires(),
      Dashboard.serveursParDatacenter(),
    ]);
    res.status(200).json({ chiffreAffaires, serveurs });
  } catch (err) {
    next(err);
  }
};