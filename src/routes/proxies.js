import express from "express";
import { supabase } from "../supabaseClient.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("proxies").select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    console.error("GET /api/proxies error", err);
    res.status(500).json({ error: String(err) });
  }
});

router.post("/", async (req, res) => {
  try {
    const { proxy_url } = req.body;
    if (!proxy_url) return res.status(400).json({ error: "proxy_url required" });
    const { data, error } = await supabase.from("proxies").insert([{ proxy_url }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  } catch (err) {
    console.error("POST /api/proxies error", err);
    res.status(500).json({ error: String(err) });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("proxies").delete().eq("id", id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, deleted: data });
  } catch (err) {
    console.error("DELETE /api/proxies error", err);
    res.status(500).json({ error: String(err) });
  }
});

export default router;
