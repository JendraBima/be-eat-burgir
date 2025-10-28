
import { supabase } from '../utils/supabase/client.js';

export default {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
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

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
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

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async create(req, res) {
    const { name, description, price, stock, image } = req.body;

    const { data, error } = await supabase
      .from("products")
      .insert([{ name, description, price, stock, image }])
      .select();

    if (error) {
      console.error("Error create:", error.message);
      return res.status(400).json({
        status: false,
        pesan: "Gagal menambahkan produk",
        error: error.message,
      });
    }

    return res.status(201).json({
      status: true,
      pesan: "Produk berhasil ditambahkan",
      data: data[0],
    });
  },

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async update(req, res) {
    const { id } = req.params;
    const { name, description, price, stock, image } = req.body;

    const { data, error } = await supabase
      .from("products")
      .update({
        name,
        description,
        price,
        stock,
        image,
        updated_at: new Date(),
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error update:", error.message);
      return res.status(400).json({
        status: false,
        pesan: "Gagal memperbarui produk",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "Produk berhasil diperbarui",
      data: data[0],
    });
  },

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async remove(req, res) {
    const { id } = req.params;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error delete:", error.message);
      return res.status(400).json({
        status: false,
        pesan: "Gagal menghapus produk",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "Produk berhasil dihapus",
    });
  },
};
