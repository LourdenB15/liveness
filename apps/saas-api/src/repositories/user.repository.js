import pool from "../db.js";

export async function getUsers(adminId) {
  const result = await pool.query(
    `SELECT 
       u.id, 
       u.name, 
       u.enrolled_at as "enrolledAt",
       u.api_key_id as "apiKeyId",
       ak.name as "apiKeyName",
       ak.masked_key as "apiKeyMasked"
     FROM users u
     LEFT JOIN api_keys ak ON u.api_key_id = ak.id
     WHERE u.admin_id = $1 
     ORDER BY u.enrolled_at DESC`,
    [adminId],
  );
  return result.rows;
}

export async function deleteUser(id, adminId) {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 AND admin_id = $2",
    [id, adminId],
  );
  return result.rowCount;
}
