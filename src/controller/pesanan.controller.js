
import { supabase } from '../utils/supabase/client.js';

export default {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getAll(req, res) {
    const { data, error } = await supabase
      .from("pesanan")
      .select(`*, users(name, phone, address, image)`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error getAll:", error.message);
      return res.status(500).json({
        status: false,
        pesan: "Gagal mengambil data pesanan",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "Berhasil mengambil semua pesanan",
      data,
    });
  },

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getMine(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: false,
          pesan: "User tidak ditemukan dalam request",
        });
      }

      const { data, error } = await supabase
        .from("pesanan")
        .select(`*, users(name, phone, address, image)`)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error getMine:", error.message);
        return res.status(500).json({
          status: false,
          pesan: "Gagal mengambil data pesanan user",
          error: error.message,
        });
      }

      return res.status(200).json({
        status: true,
        pesan: "Berhasil mengambil pesanan user",
        data,
      });
    } catch (err) {
      console.error("getMine Error:", err);
      return res.status(500).json({
        status: false,
        pesan: "Terjadi kesalahan saat mengambil pesanan user",
      });
    }
  },

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getById(req, res) {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("pesanan")
      .select(`*, users(name, phone, address, image)`)
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({
        status: false,
        pesan: "pesanan tidak ditemukan",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "Berhasil mengambil pesanan",
      data,
    });
  },

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async create(req, res) {
    const { status, total_amount } = req.body;
    const userId = req.user?.id;

    const { data, error } = await supabase
      .from("pesanan")
      .insert([
        {
          user_id: userId,
          status,
          total_amount,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ])
      .select();

    if (error) {
      console.error("Error create:", error.message);
      return res.status(400).json({
        status: false,
        pesan: "Gagal menambahkan pesanan",
        error: error.message,
      });
    }

    return res.status(201).json({
      status: true,
      pesan: "pesanan berhasil ditambahkan",
      data: data[0],
    });
  },

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async update(req, res) {
    const { id } = req.params;
    const { status, total_amount } = req.body;

    const { data, error } = await supabase
      .from("pesanan")
      .update({
        status,   
        total_amount,
        updated_at: new Date(),
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error update:", error.message);
      return res.status(400).json({
        status: false,
        pesan: "Gagal memperbarui pesanan",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "pesanan berhasil diperbarui",
      data: data[0],
    });
  },

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async remove(req, res) {
    const { id } = req.params;

    const { error } = await supabase.from("pesanan").delete().eq("id", id);

    if (error) {
      console.error("Error delete:", error.message);
      return res.status(400).json({
        status: false,
        pesan: "Gagal menghapus pesanan",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: true,
      pesan: "pesanan berhasil dihapus",
    });
  },
};
