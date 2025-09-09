import express from "express";
import { supabase } from "../supabaseClient.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    let q = supabase.from("linkedin_accounts").select("*").order("created_at", { ascending: false });
    if (userId) q = q.eq("user_id", userId);
    const { data, error } = await q;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    console.error("GET /api/accounts error", err);
    res.status(500).json({ error: String(err) });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("POST /api/accounts body:", req.body);
    const { userId = null, account_name, cookie, proxy_id } = req.body;
    if (!account_name || !cookie) return res.status(400).json({ error: "account_name and cookie required" });

    const payload = { user_id: userId, account_name, cookie, status: "active" };
    if (proxy_id && String(proxy_id).trim() !== "") payload.proxy_id = proxy_id;

    const { data, error } = await supabase.from("linkedin_accounts").insert([payload]).select();
    if (error) { console.error("Supabase insert error:", error); return res.status(500).json({ error: error.message }); }
    res.json(data[0]);
  } catch (err) {
    console.error("POST /api/accounts error", err);
    res.status(500).json({ error: String(err) });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("linkedin_accounts").delete().eq("id", id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, deleted: data });
  } catch (err) {
    console.error("DELETE /api/accounts error", err);
    res.status(500).json({ error: String(err) });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    delete updates.id;
    delete updates.created_at;
    const { data, error } = await supabase.from("linkedin_accounts").update(updates).eq("id", id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  } catch (err) {
    console.error("PATCH /api/accounts error", err);
    res.status(500).json({ error: String(err) });
  }
});

export default router;
