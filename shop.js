import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient('https://<project>.supabase.co', '<eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bnRpd2Nndmxqcmpiam5manRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNzk2NzcsImV4cCI6MjA2NTc1NTY3N30.lygU6ARA0EO99u3zPNbZ6GgtzmIKUZMcmlsbDLP4kBk>');
let user;

const planes = [
  { type: 'A400M', price: 1000 },
  { type: 'C130', price: 1000 },
  { type: 'A380', price: 1000 },
  { type: 'F16', price: 3000 }
];

supabase.auth.getUser().then(({ data }) => {
  user = data.user;
  if (!user) location.href = 'login.html';
  else renderShop();
});

async function renderShop() {
  const { data } = await supabase.from('users').select('credits').eq('id', user.id).single();
  const shop = document.getElementById('shop');

  planes.forEach(p => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${p.type}</h3>
      <p>Prix: ${p.price} crédits</p>
      <button>Acheter</button>
    `;
    div.querySelector('button').addEventListener('click', async () => {
      if (data.credits < p.price) return alert('Crédits insuffisants');
      await supabase.from('owned_planes').insert({ user_id: user.id, plane_type: p.type });
      await supabase.from('users').update({ credits: data.credits - p.price }).eq('id', user.id);
      alert(`${p.type} acheté !`);
      location.reload();
    });
    shop.appendChild(div);
  });
}
