const pool = require("../database/")

let tableChecked = false

async function ensureSavedVehicleTable() {
  if (tableChecked) return

  const createTableSql = `
    CREATE TABLE IF NOT EXISTS public.saved_vehicle (
      saved_id SERIAL PRIMARY KEY,
      account_id INTEGER NOT NULL REFERENCES public.account(account_id) ON DELETE CASCADE,
      inv_id INTEGER NOT NULL REFERENCES public.inventory(inv_id) ON DELETE CASCADE,
      saved_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT saved_vehicle_unique UNIQUE (account_id, inv_id)
    )`
  const createIndexSql = `
    CREATE INDEX IF NOT EXISTS idx_saved_vehicle_account_id
    ON public.saved_vehicle(account_id)`

  await pool.query(createTableSql)
  await pool.query(createIndexSql)
  tableChecked = true
}

/* ***************************
 *  Check whether a vehicle is saved by an account
 * ************************** */
async function isVehicleSaved(account_id, inv_id) {
  await ensureSavedVehicleTable()
  const sql = "SELECT saved_id FROM public.saved_vehicle WHERE account_id = $1 AND inv_id = $2"
  const data = await pool.query(sql, [account_id, inv_id])
  return data.rowCount > 0
}

/* ***************************
 *  Save a vehicle for an account
 * ************************** */
async function saveVehicle(account_id, inv_id) {
  await ensureSavedVehicleTable()
  const sql = `
    INSERT INTO public.saved_vehicle (account_id, inv_id)
    VALUES ($1, $2)
    ON CONFLICT (account_id, inv_id) DO NOTHING
    RETURNING *`
  const data = await pool.query(sql, [account_id, inv_id])
  return data.rows[0] || null
}

/* ***************************
 *  Get all saved vehicles for an account
 * ************************** */
async function getSavedVehiclesByAccountId(account_id) {
  await ensureSavedVehicleTable()
  const sql = `
    SELECT sv.saved_id, sv.saved_on, i.*
    FROM public.saved_vehicle AS sv
    JOIN public.inventory AS i ON sv.inv_id = i.inv_id
    WHERE sv.account_id = $1
    ORDER BY sv.saved_on DESC`
  const data = await pool.query(sql, [account_id])
  return data.rows
}

/* ***************************
 *  Get saved inventory ids for an account
 * ************************** */
async function getSavedInvIdsByAccountId(account_id) {
  await ensureSavedVehicleTable()
  const sql = "SELECT inv_id FROM public.saved_vehicle WHERE account_id = $1"
  const data = await pool.query(sql, [account_id])
  return data.rows.map((row) => row.inv_id)
}

/* ***************************
 *  Remove a saved vehicle for an account
 * ************************** */
async function removeSavedVehicle(account_id, inv_id) {
  await ensureSavedVehicleTable()
  const sql = "DELETE FROM public.saved_vehicle WHERE account_id = $1 AND inv_id = $2 RETURNING *"
  const data = await pool.query(sql, [account_id, inv_id])
  return data.rows[0] || null
}

module.exports = {
  isVehicleSaved,
  saveVehicle,
  addSavedVehicle: saveVehicle,
  getSavedVehiclesByAccountId,
  getSavedInvIdsByAccountId,
  removeSavedVehicle
}
