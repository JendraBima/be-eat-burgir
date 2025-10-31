import { supabase } from "../utils/supabase/client.js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { environment } from "../utils/environment.js";

const upload = multer({ storage: multer.memoryStorage() });
const supabaseUrl = environment.SUPABASE_URL;
export const uploadMiddleware = upload.single("image");

export default {
  async getAll(req, res) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error getAll:", error.message);
      return res.status(500).json({
        status: false,
        pesan: "Gagal mengambil data produk",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "Berhasil mengambil semua produk",
      data,
    });
  },

  async getById(req, res) {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({
        status: false,
        pesan: "Produk tidak ditemukan",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "Berhasil mengambil produk",
      data,
    });
  },

  async create(req, res) {
    try {
      const { name, description, price } = req.body;

      const parsedPrice = parseFloat(price) || 0;

      let imageUrl = null;

      if (req.file) {
        const fileExt = req.file.originalname.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `produk/images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("eat-burgir-bucket")
          .upload(filePath, req.file.buffer, {
            contentType: req.file.mimetype,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("eat-burgir-bucket")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            name,
            description,
            price: parsedPrice,
            image: imageUrl,
          },
        ])
        .select();

      if (error) throw error;

      res.status(201).json({
        status: true,
        pesan: "Produk berhasil ditambahkan",
        data: data[0],
      });
    } catch (error) {
      console.error("Error create:", error.message);
      res.status(400).json({
        status: false,
        pesan: "Gagal menambahkan produk",
        error: error.message,
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price } = req.body;

      const parsedPrice = parseFloat(price) || 0;

      let imageUrl = req.body.image || null;

      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("image")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      if (req.file) {
        if (product?.image) {
          const path = product.image.split(
            `${supabaseUrl}/storage/v1/object/public/eat-burgir-bucket/`
          )[1];
          const { error: deleteError } = await supabase.storage
            .from("eat-burgir-bucket")
            .remove([path]);
          if (deleteError)
            console.warn("Gagal hapus gambar:", deleteError.message);
        }
      }
      if (req.file) {
        const fileExt = req.file.originalname.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `produk/images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("eat-burgir-bucket")
          .upload(filePath, req.file.buffer, {
            contentType: req.file.mimetype,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("eat-burgir-bucket")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const { data, error } = await supabase
        .from("products")
        .update({
          name,
          description,
          price: parsedPrice,
          image: imageUrl,
          updated_at: new Date(),
        })
        .eq("id", id)
        .select();

      if (error) throw error;

      res.status(200).json({
        status: true,
        pesan: "Produk berhasil diperbarui",
        data: data[0],
      });
    } catch (error) {
      console.error("Error update:", error.message);
      res.status(400).json({
        status: false,
        pesan: "Gagal memperbarui produk",
        error: error.message,
      });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("image")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      if (product?.image) {
        const path = product.image.split(
          `${supabaseUrl}/storage/v1/object/public/eat-burgir-bucket/`
        )[1];
        console.log("path", path);
        const { error: deleteError } = await supabase.storage
          .from("eat-burgir-bucket")
          .remove([path]);
        if (deleteError)
          console.warn("Gagal hapus gambar:", deleteError.message);
      }

      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;

      res.status(200).json({
        status: true,
        pesan: "Produk berhasil dihapus",
      });
    } catch (error) {
      console.error("Error delete:", error.message);
      res.status(400).json({
        status: false,
        pesan: "Gagal menghapus produk",
        error: error.message,
      });
    }
  },
};