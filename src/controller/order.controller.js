import { supabase } from "../utils/supabase/client.js";

export default {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getAll(req, res) {
    const { data, error } = await supabase
      .from("order_items")
      .select("*, pesanan(id, status, total_amount), products(id, name, price, image)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error getAll:", error.message);
      return res.status(500).json({
        status: false,
        pesan: "Gagal order data",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "Berhasil",
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
      .from("order_items")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({
        status: false,
        pesan: "order tidak ditemukan",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "Berhasil",
      data,
    });
  },

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */

  async create(req, res) {
    const { quantity, pesanan_id, product_id } = req.body;

    const { data, error } = await supabase
      .from("order_items")
      .insert([
        {
          quantity,
          pesanan_id,
          product_id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ])
      .select();

    if (error) {
      console.error("Error create:", error.message);
      return res.status(400).json({
        status: false,
        pesan: "Gagal menambahkan order",
        error: error.message,
      });
    }

    return res.status(201).json({
      status: true,
      pesan: "Order berhasil ditambahkan",
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
      .from("order_items")
      .update({
        quantity,
        updated_at: new Date(),
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error update:", error.message);
      return res.status(400).json({
        status: false,
        pesan: "Gagal memperbarui order",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "order berhasil diperbarui",
      data: data[0],
    });
  },

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async remove(req, res) {
    const { id } = req.params;

    const { error } = await supabase.from("order_items").delete().eq("id", id);

    if (error) {
      console.error("Error delete:", error.message);
      return res.status(400).json({
        status: false,
        pesan: "Gagal menghapus order",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "Order berhasil dihapus",
    });
  },
};
