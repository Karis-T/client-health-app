const { all } = require('../db');

async function getAllFunding() {
    const sql = `
        SELECT * 
        FROM funding_sources 
        ORDER BY id
    `;
    
  return all(sql);
}

module.exports = { getAllFunding };