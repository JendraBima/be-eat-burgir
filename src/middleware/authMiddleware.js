import { supabase } from "../utils/supabase/client.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({
        status: false,
        pesan: "Unauthorized - Tidak ada token yang disediakan",
      });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({
        status: false,
        pesan: error?.message || "Unauthorized - Token Invalid",
      });
    }

    req.user = data.user;

    next();
    
  } catch (err) {
    console.error("AuthMiddleware Error:", err);
    return res.status(500).json({
      status: false,
      pesan: "Internal Server Error",
    });
  }
};