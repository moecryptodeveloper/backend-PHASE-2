import express from "express";
import { supabase } from "../supabaseClient.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { account_id, status } = req.query;
    let q = supabase.from("automation_tasks").select("*").order("scheduled_for", { ascending: true });
    if (account_id) q = q.eq("account_id", account_id);
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    console.error("GET /api/tasks error", err);
    res.status(500).json({ error: String(err) });
  }
});

router.post("/", async (req, res) => {
  try {
    const { account_id, campaign_id = null, task_type, payload = {}, scheduled_for = null } = req.body;
    if (!account_id || !task_type) return res.status(400).json({ error: "account_id and task_type required" });
    const obj = { account_id, campaign_id, task_type, payload, status: "pending", scheduled_for };
    const { data, error } = await supabase.from("automation_tasks").insert([obj]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  } catch (err) {
    console.error("POST /api/tasks error", err);
    res.status(500).json({ error: String(err) });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    delete updates.id;
    const { data, error } = await supabase.from("automation_tasks").update(updates).eq("id", id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  } catch (err) {
    console.error("PATCH /api/tasks error", err);
    res.status(500).json({ error: String(err) });
  }
});

export default router;
