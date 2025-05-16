import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsers, setUsers } from '../../../lib/usersData';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let users = getUsers();
  console.log('Current users in index:', users);

  if (req.method === 'GET') {
    return res.status(200).json(users);
  }

  if (req.method === 'POST') {
    const { username, password, roles } = req.body;
    console.log('Creating new user:', { username, password, roles });

    // Validate required fields
    if (!username || !password || !roles) {
      return res.status(400).json({ message: 'Username, password, and roles are required' });
    }

    // Check if username already exists
    if (users.some(u => u.username === username)) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const id = (users.length + 1).toString();
    const newUser = { 
      id, 
      username, 
      password, 
      roles: Array.isArray(roles) ? roles : [roles] 
    };
    console.log('New user object:', newUser);

    // Add new user to the array
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    
    // Verify the user was added
    const currentUsers = getUsers();
    console.log('Users after adding new user:', currentUsers);

    return res.status(201).json(newUser);
  }

  res.status(405).end();
} 