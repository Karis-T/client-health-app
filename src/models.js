const { all, get, run } = require('./db');

// SELECT all client rows with funding source
async function getAllClients() {
   const sql = `
    SELECT c.id, c.client_name, c.date_of_birth,
           c.main_language, c.secondary_language,
           c.funding_source_id, f.code AS funding_source_code
    FROM clients c
    JOIN funding_sources f ON f.id = c.funding_source_id
    ORDER BY c.id
   `;
   
    return all(sql);
}

// SELECT a client row with funding source
async function getClientById(id) {
    const sql = `
    SELECT c.id, c.client_name, c.date_of_birth,
           c.main_language, c.secondary_language,
           c.funding_source_id, f.code AS funding_source_code
    FROM clients c
    JOIN funding_sources f ON f.id = c.funding_source_id
    WHERE c.id = ?
   `;

    return get(sql, [id]);
}

// INSERT new client row
async function createClient(newClient) {
    const { client_name, date_of_birth, main_language, secondary_language, funding_source_id } = newClient;
    
    const sql = `
        INSERT INTO clients (client_name, date_of_birth, main_language, secondary_language, funding_source_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    const resolve = await run(sql, [client_name, date_of_birth, main_language, secondary_language ?? null, funding_source_id]);
    return getClientById(resolve.lastID);
}

// UPDATE client row
async function updateClient(id, patch) {
    const [fields, params] = [[], []];
    
    for (const [key, value] of Object.entries(patch)) {
        fields.push(`${key} = ?`);
        params.push(value);
    }

    if (!fields.length) return getClientById(id);
    
    params.push(id);
    await run(`UPDATE clients SET ${fields.join(', ')} WHERE id = ?`, params);
    return getClientById(id);
}

// DELETE client row
async function deleteClient(id) {
    const resolve = await run(`DELETE FROM clients WHERE id = ?`, [id]);
    return { affected: resolve.changes };
}

// SELECT all funding source rows
async function getAllFunding() {
    const sql = `
        SELECT id, code 
        FROM funding_sources 
        ORDER BY id
    `;
    
  return all(sql);
}

module.exports = {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    getAllFunding
};