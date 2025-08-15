// helper modal functions
function openModal(mode = 'create') {
  const overlay = document.getElementById('modal-overlay');
  const title = document.getElementById('modal-title');
  title.textContent = mode === 'edit' ? 'Edit a Client' : 'Add a Client';
  overlay.style.display = 'flex';
  elements.clientName.focus();
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.style.display = 'none';
}

// fetch api functions
async function getFunding() {
  const response = await fetch(`/funding-sources`);
  return response.json();
}

async function getClients() {
  const response = await fetch(`/clients`);
  return response.json();
}

async function getClient(id) {
  const response = await fetch(`/clients/${id}`);
  return response.json();
}

async function createClient(payload) {
  const response = await fetch(`/clients`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return response.json();
}

async function updateClient(id, payload) {
  const response = await fetch(`/clients/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return response.json();
}

async function deleteClient(id) {
  await fetch(`/clients/${id}`, { method: 'DELETE' });
}

// collect form field data into elements object
const properties = 'newClient form cancel id clientName dateOfBirth mainLang secondLang funding'.split(' ');
const ids = 'new-client client-form cancel-modal client-id client_name date_of_birth main_language secondary_language funding_source_id'.split(' ');

const elements = properties.reduce((object, property, index) => {
  object[property] = document.getElementById(ids[index]);
  return object;
}, {});

elements.tableBody = document.querySelector('#clients-table tbody');


// Open modal with new client button
elements.newClient.addEventListener('click', () => {
  resetForm();
  openModal('create');
});


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
    openModal('edit')
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
  closeModal();
});

// click on cancel button
elements.cancel.addEventListener('click', () => {
  resetForm();
  closeModal();
});

// render list and dropdown data on app startup
(async function init() {
  await loadFunding();
  await loadClients();
})();