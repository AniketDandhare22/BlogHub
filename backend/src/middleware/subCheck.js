import userModel from "../models/user.js";

const checkSubscription = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.userId)
      .select("plan planExpiry aiToken");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const now = new Date();

    // 🔹 PRO PLAN CHECK
    if (user.plan === "Pro") {
      if (user.planExpiry && user.planExpiry > now) {
        req.user = user;
        return next();
      }

      // Expired Pro → Downgrade
      user.plan = "Free";
      user.planExpiry = null;
      user.aiToken = 0;
      await user.save();

      return res.status(403).json({
        message: "Your Pro subscription has expired. Please renew.",
        code: "PRO_EXPIRED",
      });
    }

    // 🔹 TOKEN CHECK (Plus / Free users)
    if (user.aiToken > 0) {
      req.user = user;
      return next();
    }

    // 🔻 Tokens exhausted → Downgrade if not Free
    if (user.plan !== "Free") {
      user.plan = "Free";
      user.aiToken = 0;
      await user.save();
    }

    return res.status(403).json({
      message: "AI tokens exhausted. Please purchase more.",
      code: "TOKENS_EXHAUSTED",
    });

  } catch (err) {
    console.error("checkSubscription error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export default checkSubscription;
