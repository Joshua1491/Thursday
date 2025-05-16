import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RoleGuard } from '../../../components/RoleGuard';
import Layout from '../../../components/Layout';
import Link from 'next/link';

type User = {
  id: string;
  username: string;
  roles: string[];
};

const ALL_ROLES = [
  'IT Team Admin',
  'System Admin',
  'Warehouse Manager',
  'Inventory Clerk',
  'Quality Inspector',
  'Managing Director',
];

async function fetchUsers(): Promise<User[]> {
  const res = await fetch('/api/users');
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    username: '',
    password: '',
    roles: [] as string[],
  });

  // Create user
  const createMutation = useMutation({
    mutationFn: async (newUser: typeof form) => {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) throw new Error('Failed to create user');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowForm(false);
      setEditingUser(null);
      setForm({ username: '', password: '', roles: [] });
    },
  });

  // Edit user
  const editMutation = useMutation({
    mutationFn: async (user: typeof form & { id: string }) => {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error('Failed to update user');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowForm(false);
      setEditingUser(null);
      setForm({ username: '', password: '', roles: [] });
    },
  });

  // Delete user
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({
        ...prev,
        roles: checked
          ? [...prev.roles, value]
          : prev.roles.filter((role) => role !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setForm({ username: user.username, password: '', roles: user.roles });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      editMutation.mutate({ ...form, id: editingUser.id });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <RoleGuard allowedRoles={['IT Team Admin']}>
      <Layout>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              setShowForm(true);
              setEditingUser(null);
              setForm({ username: '', password: '', roles: [] });
            }}
          >
            + New User
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                onClick={() => {
                  setShowForm(false);
                  setEditingUser(null);
                  setForm({ username: '', password: '', roles: [] });
                }}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">
                {editingUser ? 'Edit User' : 'New User'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">Roles</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_ROLES.map((role) => (
                      <label key={role} className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          name="roles"
                          value={role}
                          checked={form.roles.includes(role)}
                          onChange={handleFormChange}
                        />
                        <span>{role}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={createMutation.isPending || editMutation.isPending}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  {editingUser
                    ? editMutation.isPending
                      ? 'Saving...'
                      : 'Save Changes'
                    : createMutation.isPending
                    ? 'Creating...'
                    : 'Create User'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Loading/Error */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error instanceof Error ? error.message : 'Failed to load users'}
          </div>
        )}

        {/* Users Table */}
        {!isLoading && users && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.roles.join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleEdit(user)}
                        disabled={editMutation.isPending || createMutation.isPending}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => deleteMutation.mutate(user.id)}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Layout>
    </RoleGuard>
  );
} 