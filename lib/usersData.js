import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json');

// Ensure the data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

// Shared users data for all API routes
let users = [
  {
    id: '1',
    username: 'Joshua',
    password: 'Joshua',
    roles: ['IT Team Admin', 'System Admin']
  },
  {
    id: '2',
    username: 'Alice',
    password: 'Alice123',
    roles: ['Warehouse Manager']
  },
  {
    id: '3',
    username: 'Bob',
    password: 'Bob123',
    roles: ['Inventory Clerk']
  },
  {
    id: '4',
    username: 'David',
    password: 'David14',
    roles: ['Managing Director']
  }
];

// Initialize the file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

export function getUsers() {
  return users;
}

export function setUsers(newUsers) {
  users = newUsers;
} 