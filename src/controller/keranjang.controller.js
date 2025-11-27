
import { supabase } from '../utils/supabase/client.js';

export default {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getAll(req, res) {
    const { data, error } = await supabase
      .from("carts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error getAll:", error.message);
      return res.status(500).json({
        status: false,
        pesan: "Gagal mengambil data keranjang",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "Berhasil mengambil semua keranjang",
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
      .from("carts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({
        status: false,
        pesan: "keranjang tidak ditemukan",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "Berhasil mengambil keranjang",
      data,
    });
  },

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async create(req, res) {
    const { quantity, product_id, user_id } = req.body;

    const { data, error } = await supabase
      .from("carts")
      .insert([{ quantity, user_id, product_id }])
      .select('*, users(name, phone), products(name, price, image)');

    if (error) {
      console.error("Error create:", error.message);
      return res.status(400).json({
        status: false,
        pesan: "Gagal menambahkan keranjang",
        error: error.message,
      });
    }

    return res.status(201).json({
      status: true,
      pesan: "keranjang berhasil ditambahkan",
      data: data[0],
    });
  },

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async update(req, res) {
    const { id } = req.params;
    const { quantity } = req.body;

    const { data, error } = await supabase
      .from("carts")
      .update({
        quantity,
        updated_at: new Date(),
      })
      .eq("id", id)
      .select('*, users(name, phone), products(name, price, image)');

    if (error) {
      console.error("Error update:", error.message);
      return res.status(400).json({
        status: false,
        pesan: "Gagal memperbarui keranjang",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "keranjang berhasil diperbarui",
      data: data[0],
    });
  },

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async remove(req, res) {
    const { id } = req.params;

    const { error } = await supabase.from("carts").delete().eq("id", id);

    if (error) {
      console.error("Error delete:", error.message);
      return res.status(400).json({
        status: false,
        pesan: "Gagal menghapus keranjang",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "keranjang berhasil dihapus",
    });
  },
};
