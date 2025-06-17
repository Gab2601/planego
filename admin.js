import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient('https://ixntiwcgvljrjbjnfjti.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bnRpd2Nndmxqcmpiam5manRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNzk2NzcsImV4cCI6MjA2NTc1NTY3N30.lygU6ARA0EO99u3zPNbZ6GgtzmIKUZMcmlsbDLP4kBk');
const ADMIN_EMAIL = 'gabrielcarlier26@icloud.com.com'; // Changez ceci avec l'adresse de l'admin

const panel = document.getElementById('admin-panel');
const denied = document.getElementById('access-denied');
const planeList = document.getElementById('plane-list');
const form = document.getElementById('add-plane-form');

supabase.auth.getSession().then(({ data: { session } }) => {
  if (!session) return denied.style.display = 'block';
  const user = session.user;
  if (user.email !== ADMIN_EMAIL) return denied.style.display = 'block';
  panel.style.display = 'block';
  loadPlanes();
});

async function loadPlanes() {
  const { data, error } = await supabase.from('planes').select('*');
  if (error) return console.error(error);

  planeList.innerHTML = '';
  data.forEach(plane => {
    const div = document.createElement('div');
    div.innerHTML = `
      <strong>${plane.name}</strong> - ${plane.price} crédits
      <button onclick="deletePlane(${plane.id})">Supprimer</button>
      <input type="number" value="${plane.price}" onchange="updatePrice(${plane.id}, this.value)" />
    `;
    planeList.appendChild(div);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('plane-name').value;
  const price = parseInt(document.getElementById('plane-price').value);
  await supabase.from('planes').insert([{ name, price }]);
  form.reset();
  loadPlanes();
});

window.deletePlane = async (id) => {
  await supabase.from('planes').delete().eq('id', id);
  loadPlanes();
};

window.updatePrice = async (id, newPrice) => {
  await supabase.from('planes').update({ price: parseInt(newPrice) }).eq('id', id);
  loadPlanes();
};
