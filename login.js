import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient('https://ixntiwcgvljrjbjnfjti.supabase.co', '<eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bnRpd2Nndmxqcmpiam5manRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNzk2NzcsImV4cCI6MjA2NTc1NTY3N30.lygU6ARA0EO99u3zPNbZ6GgtzmIKUZMcmlsbDLP4kBk>import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);
  location.href = '/index.html';
});

