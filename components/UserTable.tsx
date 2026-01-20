
import React, { useState } from 'react';
import { Edit2, MoreHorizontal, UserX, Search, Loader2, RefreshCw, Phone, AlertCircle } from 'lucide-react';
import { User, UserRoleEnum } from '../types';
import EditUserModal from './EditUserModal';

interface UserTableProps {
  users: User[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  isWaking: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ users, loading, error, onRefresh, isWaking }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(u => 
    (u.name?.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (u.phone?.includes(searchTerm))
  );

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + (parts[parts.length - 1]?.[0] || '')).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-24 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600 mb-6" size={48} />
        <h3 className="text-lg font-bold text-slate-900 mb-2">Syncing Data</h3>
        <p className="text-slate-500 font-medium text-center">
          {isWaking ? "Waking the Render server instance..." : "Pulling live user records..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-16 flex flex-col items-center justify-center text-center">
        <AlertCircle size={44} className="text-rose-500 mb-6" />
        <h3 className="text-xl font-bold text-slate-900 mb-3">Connection Lost</h3>
        <p className="text-slate-500 mb-8 max-w-md">{error}</p>
        <button onClick={onRefresh} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
          Retry Sync
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-700">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search name or phone..."
            className="w-full pl-12 pr-4 py-3 border border-slate-100 bg-slate-50/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all text-sm shadow-inner outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onRefresh} className="p-3 border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
            <RefreshCw size={18} />
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            Add Record
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
              <th className="px-8 py-5">Full Name</th>
              <th className="px-8 py-5">Phone Contact</th>
              <th className="px-8 py-5">System Role</th>
              <th className="px-8 py-5">Account Status</th>
              <th className="px-8 py-5">Joined</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-indigo-50/10 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-indigo-100 ring-2 ring-white">
                      {user.image ? (
                        <img src={user.image} alt="" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        getInitials(user.name)
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{user.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">#{(user._id || '').slice(-6)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center text-sm font-medium text-slate-600 gap-2">
                    <Phone size={14} className="text-slate-300" />
                    {user.phone}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-widest border ${
                    user.role === UserRoleEnum.SUPER_ADMIN 
                      ? 'text-indigo-600 bg-indigo-50 border-indigo-100' 
                      : 'text-slate-500 bg-slate-50 border-slate-100'
                  }`}>
                    {user.role || 'N/A'}
                  </span>
                </td>
                <td className="px-8 py-5">
                  {user.isDeleted ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase bg-rose-50 text-rose-600 border border-rose-100">
                      Deleted
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-8 py-5 text-sm text-slate-500 font-medium">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setEditingUser(user)}
                      className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-100 hover:border-indigo-100"
                      title="Edit Profile"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-300 hover:text-slate-500 transition-all border border-transparent hover:border-slate-100">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center">
          <UserX size={64} className="text-slate-100 mb-4" />
          <h4 className="text-lg font-bold text-slate-700">No users found</h4>
          <p className="text-sm text-slate-400">We couldn't find any accounts matching that query.</p>
        </div>
      )}

      {editingUser && (
        <EditUserModal 
          user={editingUser} 
          onClose={() => setEditingUser(null)} 
          onUpdateSuccess={onRefresh}
        />
      )}
    </div>
  );
};

export default UserTable;
