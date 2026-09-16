import pool from "../db.js";

export async function getLogs(adminId) {
  const result = await pool.query(
    `SELECT 
       vl.id, 
       vl.user_name as "userName", 
       vl.score, 
       vl.status, 
       vl.timestamp,
       vl.api_key_id as "apiKeyId",
       ak.name as "apiKeyName",
       ak.masked_key as "apiKeyMasked"
     FROM verification_logs vl
     LEFT JOIN api_keys ak ON vl.api_key_id = ak.id
     WHERE vl.admin_id = $1 
     ORDER BY vl.timestamp DESC 
     LIMIT 100`,
    [adminId],
  );

  return result.rows;
}
