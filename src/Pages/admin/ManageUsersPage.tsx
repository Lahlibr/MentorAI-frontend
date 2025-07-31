import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, MoreHorizontal, UserCheck, UserX, Edit, Trash2 } from 'lucide-react';
import LoadingSpinner from '@/Components/common/LoadingSpinner';
import Button from '@/Components/common/Button';
import Modal from '@/Components/common/Modal';
import { ErrorMessage, SuccessMessage } from '@/Components/common/Messages';

interface User {
  id: string;
  email: string;
  role: 'Student' | 'Reviewer' | 'Admin';
  status: 'Active' | 'Inactive' | 'Suspended';
  createdAt: string;
  lastLogin?: string;
  reviewsCompleted?: number;
  problemsSolved?: number;
}

const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setUsers([
          {
            id: '1',
            email: 'alice.student@example.com',
            role: 'Student',
            status: 'Active',
            createdAt: '2024-01-15T10:00:00Z',
            lastLogin: '2024-01-20T14:30:00Z',
            problemsSolved: 23,
            reviewsCompleted: 0
          },
          {
            id: '2',
            email: 'bob.reviewer@example.com',
            role: 'Reviewer',
            status: 'Active',
            createdAt: '2024-01-10T09:00:00Z',
            lastLogin: '2024-01-21T11:15:00Z',
            problemsSolved: 0,
            reviewsCompleted: 156
          },
          {
            id: '3',
            email: 'charlie.student@example.com',
            role: 'Student',
            status: 'Inactive',
            createdAt: '2024-01-12T16:45:00Z',
            lastLogin: '2024-01-18T08:20:00Z',
            problemsSolved: 8,
            reviewsCompleted: 0
          },
          {
            id: '4',
            email: 'diana.admin@example.com',
            role: 'Admin',
            status: 'Active',
            createdAt: '2024-01-01T00:00:00Z',
            lastLogin: '2024-01-21T15:45:00Z',
            problemsSolved: 0,
            reviewsCompleted: 0
          }
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load users');
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = async (action: string, userId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (action === 'activate' || action === 'deactivate') {
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, status: action === 'activate' ? 'Active' : 'Inactive' }
            : user
        ));
        setSuccess(`User ${action}d successfully`);
      } else if (action === 'delete') {
        setUsers(prev => prev.filter(user => user.id !== userId));
        setSuccess('User deleted successfully');
      }
    } catch (err) {
      setError(`Failed to ${action} user`);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'Reviewer': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'Student': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'Inactive': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'Suspended': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Manage Users
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              View and manage all users on the platform
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Users</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3">
              <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Active</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">
                  {users.filter(u => u.status === 'Active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center space-x-3">
              <UserX className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Inactive</p>
                <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">
                  {users.filter(u => u.status === 'Inactive').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">This Month</p>
                <p className="text-xl font-bold text-purple-700 dark:text-purple-300">+24</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Role Filter */}
          <select
            aria-label="Filter by role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option value="">All Roles</option>
            <option value="Student">Student</option>
            <option value="Reviewer">Reviewer</option>
            <option value="Admin">Admin</option>
          </select>

          {/* Status Filter */}
          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Messages */}
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">Activity</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">Joined</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {user.role === 'Student' && (
                        <p>{user.problemsSolved} problems solved</p>
                      )}
                      {user.role === 'Reviewer' && (
                        <p>{user.reviewsCompleted} reviews completed</p>
                      )}
                      {user.role === 'Admin' && (
                        <p>Admin privileges</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {user.status === 'Active' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUserAction('deactivate', user.id)}
                          leftIcon={<UserX className="w-4 h-4" />}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUserAction('activate', user.id)}
                          leftIcon={<UserCheck className="w-4 h-4" />}
                        >
                          Activate
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleUserAction('delete', user.id)}
                        leftIcon={<Trash2 className="w-4 h-4" />}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No users found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;
