import pool from "../db.js";

export async function getApiKeys(adminId) {
  try {
    const result = await pool.query(
      'SELECT id, name, masked_key as "key", revoked_at as "revokedAt", created_at as "createdAt" FROM api_keys WHERE admin_id = $1 ORDER BY created_at DESC',
      [adminId],
    );
    return result.rows;
  } catch (err) {
    if (err.code === "42703") {
      await ensureRevokedAtColumn();
      const retry = await pool.query(
        'SELECT id, name, masked_key as "key", revoked_at as "revokedAt", created_at as "createdAt" FROM api_keys WHERE admin_id = $1 ORDER BY created_at DESC',
        [adminId],
      );
      return retry.rows;
    }
    throw err;
  }
}

async function ensureRevokedAtColumn() {
  try {
    await pool.query(
      "ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;",
    );
  } catch (migrationErr) {
    console.warn("Auto-migration of revoked_at failed:", migrationErr.message);
  }
}

export async function addApiKey(adminId, name, hash, maskedKey) {
  const result = await pool.query(
    'INSERT INTO api_keys (admin_id, name, key_hash, masked_key) VALUES ($1, $2, $3, $4) RETURNING id, name, created_at as "createdAt"',
    [adminId, name, hash, maskedKey],
  );
  return result.rows[0];
}

export async function revokeApiKey(id, adminId) {
  try {
    const result = await pool.query(
      'UPDATE api_keys SET revoked_at = NOW() WHERE id = $1 AND admin_id = $2 AND revoked_at IS NULL RETURNING id, name, masked_key as "key", revoked_at as "revokedAt", created_at as "createdAt"',
      [id, adminId],
    );
    return result.rows[0] || null;
  } catch (err) {
    if (err.code === "42703") {
      await ensureRevokedAtColumn();
      const retry = await pool.query(
        'UPDATE api_keys SET revoked_at = NOW() WHERE id = $1 AND admin_id = $2 AND revoked_at IS NULL RETURNING id, name, masked_key as "key", revoked_at as "revokedAt", created_at as "createdAt"',
        [id, adminId],
      );
      return retry.rows[0] || null;
    }
    throw err;
  }
}

export async function deleteApiKey(id, adminId) {
  const result = await pool.query(
    "DELETE FROM api_keys WHERE id = $1 AND admin_id = $2",
    [id, adminId],
  );
  return result.rowCount;
}

export async function findByKeyHash(hash) {
  try {
    const result = await pool.query(
      'SELECT id, admin_id as "adminId", name, masked_key as "maskedKey", revoked_at as "revokedAt" FROM api_keys WHERE key_hash = $1',
      [hash],
    );
    return result.rows;
  } catch (err) {
    if (err.code === "42703") {
      await ensureRevokedAtColumn();
      const retry = await pool.query(
        'SELECT id, admin_id as "adminId", name, masked_key as "maskedKey", revoked_at as "revokedAt" FROM api_keys WHERE key_hash = $1',
        [hash],
      );
      return retry.rows;
    }
    throw err;
  }
}
