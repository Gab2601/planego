import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient('https://<project>.supabase.co', '<eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bnRpd2Nndmxqcmpiam5manRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNzk2NzcsImV4cCI6MjA2NTc1NTY3N30.lygU6ARA0EO99u3zPNbZ6GgtzmIKUZMcmlsbDLP4kBk>');

const profilePhoto = document.getElementById('profile-photo');
const points = document.getElementById('points');
const credits = document.getElementById('credits');
const hangar = document.getElementById('hangar');
const upload = document.getElementById('upload');

let user;

supabase.auth.onAuthStateChange(async (_, session) => {
  if (session) {
    user = session.user;
    await loadProfile();
    await loadHangar();
  } else {
    location.href = 'login.html';
  }
});

document.getElementById('btn-logout')?.addEventListener('click', async () => {
  await supabase.auth.signOut();
  location.href = 'login.html';
});

async function loadProfile() {
  const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();
  if (error) return;
  profilePhoto.src = data.profile_photo_url || 'assets/default.png';
  points.textContent = `Points: ${data.points}`;
  credits.textContent = `Crédits: ${data.credits}`;
  document.getElementById('user-email').textContent = data.email;
}

async function loadHangar() {
  const { data } = await supabase.from('planes').select('*').eq('user_id', user.id);
  hangar.innerHTML = '';
  data.forEach(p => {
    const img = document.createElement('img');
    img.src = p.photo_url;
    img.className = 'photo';
    hangar.appendChild(img);
  });
  document.getElementById('plane-count').textContent = `Avions: ${data.length}`;
}

upload?.addEventListener('change', async e => {
  const file = e.target.files[0];
  const { data, error } = await supabase.storage.from('photos').upload(`${user.id}/${Date.now()}.jpg`, file);
  if (error) return alert('Erreur upload');

  const publicUrl = supabase.storage.from('photos').getPublicUrl(data.path).data.publicUrl;
  await supabase.from('planes').insert({ user_id: user.id, photo_url: publicUrl });
  await supabase.from('users').update({ points: supabase.literal('points + 300'), credits: supabase.literal('credits + 2000') }).eq('id', user.id);
  await loadProfile();
  await loadHangar();
});
