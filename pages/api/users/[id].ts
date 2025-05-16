import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsers, setUsers } from '../../../lib/usersData';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let users = getUsers();
  const { id } = req.query;
  if (req.method === 'PUT') {
    const { username, password, roles } = req.body;
    users = users.map(u => u.id === id ? { ...u, username, password: password || u.password, roles } : u);
    setUsers(users);
    return res.status(200).json(users.find(u => u.id === id));
  }
  if (req.method === 'DELETE') {
    users = users.filter(u => u.id !== id);
    setUsers(users);
    return res.status(204).end();
  }
  res.status(405).end();
} 