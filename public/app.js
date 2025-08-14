const API = '';

// helper JSON function
async function toJson(response) {
  if (!response.ok) throw new Error(await res.text().catch(()=>'HTTP '+response.status));
  const length = response.headers.get('content-length');
  if (response.status === 204 || length === '0' || length === null) return null;
  return response.json();
}

async function getFunding() {
  const response = await fetch(`${API}/funding-sources`);
  return response.json();
}

async function getClients() {
  const response = await fetch(`${API}/clients`);
  return response.json();
}

async function getClient(id) {
  const response = await fetch(`${API}/clients/${id}`);
  return response.json();
}

async function createClient(payload) {
  const response = await fetch(`${API}/clients`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return toJson(response);
}

async function updateClient(id, payload) {
  const response = await fetch(`${API}/clients/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return toJson(response);
}

async function deleteClient(id) {
  await fetch(`${API}/clients/${id}`, { method: 'DELETE' });
}

// collect form field data into elements object
const properties = 'reload form cancel id clientName dateOfBirth mainLang secondLang funding'.split(' ');
const ids = 'reload client-form cancel client-id client_name date_of_birth main_language secondary_language funding_source_id'.split(' ');

const elements = properties.reduce((object, property, index) => {
  object[property] = document.getElementById(ids[index]);
  return object;
}, {});

elements.tableBody = document.querySelector('#clients-table tbody');

// populate funding dropdown in client form
async function loadFunding() {
  const options = await getFunding();
  elements.funding.innerHTML = options.map(option => `
    <option value="${option.id}">${option.code}</option>
    `).join('');
}

// populate client data in client list
async function loadClients() {
  const rows = await getClients();
  elements.tableBody.innerHTML = rows.map(row => `
    <tr>
      <td>${row.client_name}</td>
      <td>${row.date_of_birth}</td>
      <td>${row.main_language}</td>
      <td>${row.secondary_language ? row.secondary_language : ''}</td>
      <td>${row.funding_source_code ?? row.funding_source_id}</td>
      <td>
        <button data-edit="${row.id}">Edit</button>
        <button data-del="${row.id}">Delete</button>
      </td>
    </tr>
  `).join('');
}

// read form data
function readForm() {
  return {
    client_name: elements.clientName.value.trim(),
    date_of_birth: elements.dateOfBirth.value.trim(),
    main_language: elements.mainLang.value.trim(),
    secondary_language: elements.secondLang.value.trim() || null,
    funding_source_id: Number(elements.funding.value)
  };
}

// clear form data
function resetForm() {
  elements.id.value = '';
  elements.form.reset();
}

// click on edit or delete button
elements.tableBody.addEventListener('click', async (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  if (button.dataset.edit) {
    const item = await getClient(Number(button.dataset.edit));
    elements.id.value = item.id;
    elements.clientName.value = item.client_name;
    elements.dateOfBirth.value = item.date_of_birth;
    elements.mainLang.value = item.main_language;
    elements.secondLang.value = item.secondary_language ?? '';
    elements.funding.value = item.funding_source_id;
    window.scrollTo(0, document.body.scrollHeight);
  }
  if (button.dataset.del) {
    if (confirm('Delete this client?')) {
      await deleteClient(Number(button.dataset.del));
      await loadClients();
    }
  }
});

// click on submit button
elements.form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = readForm();
  if (elements.id.value) {
    await updateClient(Number(elements.id.value), payload);
  } else {
    await createClient(payload);
  }
  await loadClients();
  resetForm();
});

// click on cancel button
elements.cancel.addEventListener('click', resetForm);

// click on reload button
elements.reload.addEventListener('click', loadClients);

// render list and dropdown data on app startup
(async function init() {
  await loadFunding();
  await loadClients();
})();