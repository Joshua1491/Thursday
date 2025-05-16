import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsers } from '../../../lib/usersData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;
  console.log('Login attempt:', { username, password });

  // Validate request body
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const users = getUsers();
  console.log('Available users:', users);

  // Find user with exact username match
  const user = users.find((u) => {
    const match = u.username === username && u.password === password;
    console.log(`Checking user ${u.username}:`, { 
      usernameMatch: u.username === username, 
      passwordMatch: u.password === password 
    });
    return match;
  });

  console.log('Found user:', user);

  if (user) {
    return res.status(200).json({
      access_token: 'fake-jwt-token',
      user: {
        username: user.username,
        roles: user.roles,
      },
    });
  }

  return res.status(401).json({ message: 'Invalid username or password' });
} 