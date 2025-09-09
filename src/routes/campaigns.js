import express from "express";
import { supabase } from "../supabaseClient.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { account_id } = req.query;
    let q = supabase.from("campaigns").select("*").order("created_at", { ascending: false });
    if (account_id) q = q.eq("account_id", account_id);
    const { data, error } = await q;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    console.error("GET /api/campaigns error", err);
    res.status(500).json({ error: String(err) });
  }
});

router.post("/", async (req, res) => {
  try {
    const { account_id, name, sequence } = req.body;
    if (!account_id || !name || !sequence) return res.status(400).json({ error: "account_id, name and sequence required" });
    const { data, error } = await supabase.from("campaigns").insert([{ account_id, name, sequence, status: "draft" }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  } catch (err) {
    console.error("POST /api/campaigns error", err);
    res.status(500).json({ error: String(err) });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("campaigns").delete().eq("id", id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, deleted: data });
  } catch (err) {
    console.error("DELETE /api/campaigns error", err);
    res.status(500).json({ error: String(err) });
  }
});

export default router;
