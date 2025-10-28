
import { supabase } from '../utils/supabase/client.js';

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
    const { name, role, phone, address, avatar, remember_token } = req.body;

    const { data, error } = await supabase
      .from("users")
      .update({
        name,
        role,
        phone,
        address,
        avatar,
        remember_token,
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
