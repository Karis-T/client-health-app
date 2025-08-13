const { all } = require('../db');

// SELECT all funding source rows
async function getAllFunding() {
    const sql = `
        SELECT * 
        FROM funding_sources 
        ORDER BY id
    `;
    
  return all(sql);
}

module.exports = { getAllFunding };