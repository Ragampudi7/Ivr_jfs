const API = '/users';

function showStatus(msg, timeout = 2500) {
  const s = document.getElementById('status');
  s.textContent = msg;
  setTimeout(() => { if (s.textContent === msg) s.textContent = ''; }, timeout);
}

async function fetchUsers() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error('Failed to load');
    return await res.json();
  } catch (e) { showStatus('Could not fetch users'); return []; }
}

async function fetchUserById(id) {
  try {
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) throw new Error('Failed to load user');
    return await res.json();
  } catch (e) { showStatus('Could not fetch user details'); return null; }
}

function renderUsers(list) {
  const el = document.getElementById('users');
  if (!list || list.length === 0) { el.innerHTML = '<div class="status">No users yet</div>'; return; }
  el.innerHTML = list.map(u => `
    <div class="user">
      <div class="meta">
        <div class="name">${escapeHtml(u.name || '')}</div>
        <div class="phone">${escapeHtml(u.phone || '')}</div>
      </div>
      <div class="actions">
        <button class="btn" onclick="editUser(${u.id})">Edit</button>
        <button class="btn danger" onclick="deleteUser(${u.id})">Delete</button>
        <a class="btn" href="tel:${encodeURI(u.phone || '')}">Call</a>
      </div>
    </div>
  `).join('');
}

async function deleteUser(id) {
  if (!confirm('Are you sure you want to delete this user?')) return;
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    showStatus('User deleted');
    await loadAndRender();
  } catch (err) { showStatus('Delete failed'); }
}

async function editUser(id) {
  const user = await fetchUserById(id);
  if (!user) return;
  
  document.getElementById('userId').value = user.id;
  document.getElementById('name').value = user.name || '';
  document.getElementById('phone').value = user.phone || '';
  document.getElementById('language').value = user.language || '';
  document.getElementById('location').value = user.location || '';
  
  document.getElementById('formTitle').textContent = 'Edit User';
  document.getElementById('submitBtn').textContent = 'Update User';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clearForm() {
  document.getElementById('userForm').reset();
  document.getElementById('userId').value = '';
  document.getElementById('formTitle').textContent = 'Add / Register User';
  document.getElementById('submitBtn').textContent = 'Save User';
}

function escapeHtml(str){ return String(str).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }

async function loadAndRender(){
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) refreshBtn.disabled = true;
  const users = await fetchUsers();
  renderUsers(users);
  if (refreshBtn) refreshBtn.disabled = false;
}

document.getElementById('refreshBtn')?.addEventListener('click', loadAndRender);
document.getElementById('resetBtn')?.addEventListener('click', clearForm);

document.getElementById('userForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const id = document.getElementById('userId').value;
  const user = {
    name: document.getElementById('name').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    language: document.getElementById('language').value.trim(),
    location: document.getElementById('location').value.trim()
  };
  
  if(!user.name || !user.phone){ showStatus('Name and phone are required'); return; }
  
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API}/${id}` : API;
  const submitBtn = document.getElementById('submitBtn');
  
  try {
    submitBtn.disabled = true;
    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Save failed');
    }
    
    showStatus(id ? 'User updated successfully' : 'User saved successfully');
    clearForm();
    await loadAndRender();
  } catch (err) { 
    showStatus(`Error: ${err.message}`); 
  } finally {
    submitBtn.disabled = false;
  }
});

document.getElementById('search')?.addEventListener('input', async (e)=>{
  const q = e.target.value.toLowerCase();
  const list = await fetchUsers();
  const filtered = list.filter(u=> (u.name||'').toLowerCase().includes(q) || (u.phone||'').toLowerCase().includes(q));
  renderUsers(filtered);
});

// initial load
loadAndRender();
