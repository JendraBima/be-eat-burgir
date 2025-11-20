import { supabase } from "../utils/supabase/client.js";
import multer from "multer";
import { environment } from "../utils/environment.js";

const upload = multer({ storage: multer.memoryStorage() });
export const uploadMiddleware = upload.single("image");
const supabaseUrl = environment.SUPABASE_URL;


export default {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getAll(req, res) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error getAll:", error.message);
      return res.status(500).json({
        status: false,
        pesan: "Gagal mengambil data users",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "Berhasil mengambil semua users",
      data,
    });
  },

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getById(req, res) {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({
        status: false,
        pesan: "users tidak ditemukan",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "Berhasil mengambil users",
      data,
    });
  },

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async create(req, res) {
    const { name, role, phone, address, avatar, remember_token } = req.body;

    const { data, error } = await supabase
      .from("users")
      .insert([{ name, role, phone, address, avatar, remember_token }])
      .select();

    if (error) {
      console.error("Error create:", error.message);
      return res.status(400).json({
        status: false,
        pesan: "Gagal menambahkan users",
        error: error.message,
      });
    }

    return res.status(201).json({
      status: true,
      pesan: "Users berhasil ditambahkan",
      data: data[0],
    });
  },

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async update(req, res) {
    const { id } = req.params;
    const { name, phone, address, image } = req.body;

    let imageUrl = req.body.image || null;

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("image")
      .eq("id", id)
      .single();

      if(userError) {
        return res.status(404).json({
          status: false,
          pesan: "users tidak ditemukan",
          error: userError.message,
        });
      }

    if (req.file) {
      if (user?.image) {
        const avatarPath = user.image.split(
            `${supabaseUrl}/storage/v1/object/public/eat-burgir-bucket/`
          )[1];
        const { error: deleteError } = await supabase.storage
          .from("eat-burgir-bucket")
          .remove([avatarPath]);

        if (deleteError) {
          console.error("Error menghapus avatar lama:", deleteError.message);
        }
      }

      const filePath = `avatars/${Date.now()}_${req.file.originalname}`;
      const { error: uploadError } = await supabase.storage
        .from("eat-burgir-bucket")
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) {
        console.error("Error mengunggah avatar baru:", uploadError.message);
        return res.status(500).json({
          status: false,
          pesan: "Gagal mengunggah avatar baru",
          error: uploadError.message,
        });
      }

      const { data: publicUrlData } = supabase.storage
        .from("eat-burgir-bucket")
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        name,
        phone,
        address,
        image: imageUrl,
        updated_at: new Date(),
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error update:", error.message);
      return res.status(400).json({
        status: false,
        pesan: "Gagal memperbarui users",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "users berhasil diperbarui",
      data: data[0],
    });
  },

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async remove(req, res) {
    const { id } = req.params;

    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      console.error("Error delete:", error.message);
      return res.status(400).json({
        status: false,
        pesan: "Gagal menghapus users",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "users berhasil dihapus",
    });
  },
};
