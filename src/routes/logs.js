import express from "express";
import { supabase } from "../supabaseClient.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { account_id } = req.query;
    let q = supabase.from("linkedin_activity_logs").select("*").order("created_at", { ascending: false });
    if (account_id) q = q.eq("account_id", account_id);
    const { data, error } = await q;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    console.error("GET /api/logs error", err);
    res.status(500).json({ error: String(err) });
  }
});

router.post("/", async (req, res) => {
  try {
    const { account_id, activity_type, message = null, status = "pending" } = req.body;
    if (!account_id || !activity_type) return res.status(400).json({ error: "account_id and activity_type required" });
    const { data, error } = await supabase.from("linkedin_activity_logs").insert([{ account_id, activity_type, message, status }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  } catch (err) {
    console.error("POST /api/logs error", err);
    res.status(500).json({ error: String(err) });
  }
});

export default router;
