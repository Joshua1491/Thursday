import fetch from 'node-fetch';

async function seedMDUser() {
  const res = await fetch('http://localhost:3000/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'mdadmin',
      password: 'MDPass123!',
      roles: ['Managing Director']
    })
  });
  console.log('Seed MD User status:', res.status);
  console.log(await res.json());
}

seedMDUser(); 