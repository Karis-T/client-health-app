const API = '';

async function toJson(res) {
  if (!res.ok) throw new Error(await res.text().catch(()=>'HTTP '+res.status));
  const len = res.headers.get('content-length');
  if (res.status === 204 || len === '0' || len === null) return null;
  return res.json();
}

async function getFunding() {
  const res = await fetch(`${API}/funding-sources`);
  return res.json();
}
async function getClients() {
  const res = await fetch(`${API}/clients`);
  return res.json();
}
async function getClient(id) {
  const res = await fetch(`${API}/clients/${id}`);
  return res.json();
}
async function createClient(payload) {
  const res = await fetch(`${API}/clients`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return toJson(res);
}
async function updateClient(id, payload) {
  const res = await fetch(`${API}/clients/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return toJson(res);
}
async function deleteClient(id) {
  const res = await fetch(`/clients/${id}`, { method: 'DELETE' });
  if (res.status === 404) return;
  if (!res.ok) throw new Error('Delete failed');
}

const els = {
  tableBody: document.querySelector('#clients-table tbody'),
  reload: document.getElementById('reload'),
  form: document.getElementById('client-form'),
  cancel: document.getElementById('cancel'),
  id: document.getElementById('client-id'),
  clientName: document.getElementById('client_name'),
  dateOfBirth: document.getElementById('date_of_birth'),
  mainLang: document.getElementById('main_language'),
  secondLang: document.getElementById('secondary_language'),
  funding: document.getElementById('funding_source_id')
};

async function loadFunding() {
  const opts = await getFunding();
  els.funding.innerHTML = opts.map(o => `<option value="${o.id}">${o.code}</option>`).join('');
}

async function loadClients() {
  const rows = await getClients();
  els.tableBody.innerHTML = rows.map(r => `
    <tr>
      <td>${r.client_name}</td>
      <td>${r.date_of_birth}</td>
      <td>${r.main_language}</td>
      <td>${r.secondary_language ? r.secondary_language : ''}</td>
      <td>${r.funding_source_code ?? r.funding_source_id}</td>
      <td>
        <button data-edit="${r.id}">Edit</button>
        <button data-del="${r.id}">Delete</button>
      </td>
    </tr>
  `).join('');
}

function readForm() {
  return {
    client_name: els.clientName.value.trim(),
    date_of_birth: els.dateOfBirth.value.trim(),
    main_language: els.mainLang.value.trim(),
    secondary_language: els.secondLang.value.trim() || null,
    funding_source_id: Number(els.funding.value)
  };
}

function resetForm() {
  els.id.value = '';
  els.form.reset();
}

els.tableBody.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  if (btn.dataset.edit) {
    const item = await getClient(Number(btn.dataset.edit));
    els.id.value = item.id;
    els.clientName.value = item.client_name;
    els.dateOfBirth.value = item.date_of_birth;
    els.mainLang.value = item.main_language;
    els.secondLang.value = item.secondary_language ?? '';
    els.funding.value = item.funding_source_id;
    window.scrollTo(0, document.body.scrollHeight);
  }
  if (btn.dataset.del) {
    const id = Number(btn.dataset.del);
    if (Number.isNaN(id)) return;
    if (confirm('Delete this client?')) {
      await deleteClient(id);
      await loadClients();
    }
  }
});

els.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = readForm();
  if (els.id.value) {
    await updateClient(Number(els.id.value), payload);
  } else {
    await createClient(payload);
  }
  await loadClients();
  resetForm();
});

els.cancel.addEventListener('click', resetForm);
els.reload.addEventListener('click', loadClients);

(async function init() {
  await loadFunding();
  await loadClients();
})();