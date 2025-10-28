import { supabase } from "../utils/supabase/client.js";

export const adminMiddleware = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        status: false,
        pesan: "User tidak ditemukan dalam request",
      });
    }

    const { data: userData, error } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", userId)
      .single();

    if (error || !userData) {
      return res.status(404).json({
        status: false,
        pesan: "Data user tidak ditemukan di database",
      });
    }

    if (userData.role !== "admin") {
      return res.status(403).json({
        status: false,
        pesan: "Akses ditolak - Anda bukan admin",
      });
    }

    next();
  } catch (err) {
    console.error("AdminMiddleware Error:", err);
    return res.status(500).json({
      status: false,
      pesan: "Terjadi kesalahan pada verifikasi admin",
    });
  }
};