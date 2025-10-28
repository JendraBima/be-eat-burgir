
import { supabase } from '../utils/supabase/client.js';

export default {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getAll(req, res) {
    const { data, error } = await supabase
      .from("produk_reviews")
      .select("*, products(id, name), users(id, name)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error getAll:", error.message);
      return res.status(500).json({
        status: false,
        pesan: "Gagal mengambil data reviews",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "Berhasil mengambil semua reviews",
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
      .from("produk_reviews")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({
        status: false,
        pesan: "reviews tidak ditemukan",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "Berhasil mengambil reviews",
      data,
    });
  },

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async create(req, res) {
    const { rating, review } = req.body;

    const { data, error } = await supabase
      .from("produk_reviews")
      .insert([{ rating, review }])
      .select();

    if (error) {
      console.error("Error create:", error.message);
      return res.status(400).json({
        status: false,
        pesan: "Gagal menambahkan reviews",
        error: error.message,
      });
    }

    return res.status(201).json({
      status: true,
      pesan: "reviews berhasil ditambahkan",
      data: data[0],
    });
  },

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async update(req, res) {
    const { id } = req.params;
    const { rating, review } = req.body;

    const { data, error } = await supabase
      .from("produk_reviews")
      .update({
        rating,
        review,
        updated_at: new Date(),
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error update:", error.message);
      return res.status(400).json({
        status: false,
        pesan: "Gagal memperbarui reviews",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "reviews berhasil diperbarui",
      data: data[0],
    });
  },

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async remove(req, res) {
    const { id } = req.params;

    const { error } = await supabase.from("produk_reviews").delete().eq("id", id);

    if (error) {
      console.error("Error delete:", error.message);
      return res.status(400).json({
        status: false,
        pesan: "Gagal menghapus reviews",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "reviews berhasil dihapus",
    });
  },
};
