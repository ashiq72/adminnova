
import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import UserTable from './components/UserTable';
import AIAssistant from './components/AIAssistant';
import LoginPage from './components/LoginPage';
import { Bell, Search, Settings, Loader2, RefreshCw, AlertCircle, LogOut } from 'lucide-react';
import { User, ApiResponse, Metric, UserRoleEnum } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWaking, setIsWaking] = useState(false);

  // Auth initialization
  useEffect(() => {
    const savedToken = localStorage.getItem('supernova_token');
    const savedUser = localStorage.getItem('supernova_user');
    if (savedToken && savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (token: string, user: User) => {
    localStorage.setItem('supernova_token', token);
    localStorage.setItem('supernova_user', JSON.stringify(user));
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('supernova_token');
    localStorage.removeItem('supernova_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const fetchAllData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    setIsWaking(false);
    const wakingTimer = setTimeout(() => setIsWaking(true), 3000);

    try {
      const response = await fetch('https://base360.onrender.com/api/v1/users/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('supernova_token')}` }
      });
      if (!response.ok) throw new Error('API server is currently unreachable.');
      const result: ApiResponse<User[]> = await response.json();
      if (result.success) {
        setUsers(result.data || []);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || 'Connection failed. Please check your internet or API status.');
    } finally {
      clearTimeout(wakingTimer);
      setLoading(false);
      setIsWaking(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  // Derived Statistics
  const stats: Metric[] = useMemo(() => {
    const total = users.length;
    const active = users.filter(u => !u.isDeleted).length;
    const deleted = users.filter(u => u.isDeleted).length;
    
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const newToday = users.filter(u => new Date(u.createdAt) > oneDayAgo).length;

    return [
      { label: 'Total Database', value: total, change: 100, trend: 'neutral' },
      { label: 'Active Users', value: active, change: Math.round((active/total)*100) || 0, trend: 'up' },
      { label: 'Deleted/Inactive', value: deleted, change: Math.round((deleted/total)*100) || 0, trend: 'down' },
      { label: 'New Today', value: newToday, change: newToday > 0 ? 100 : 0, trend: 'up' },
    ];
  }, [users]);

  // Derived Chart Data
  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dataMap: Record<string, { name: string, traffic: number, users: number }> = {};
    
    for(let i=6; i>=0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      dataMap[dayName] = { name: dayName, traffic: Math.floor(Math.random() * 5000) + 1000, users: 0 };
    }

    users.forEach(u => {
      const dayName = days[new Date(u.createdAt).getDay()];
      if (dataMap[dayName]) {
        dataMap[dayName].users += 1;
      }
    });

    return Object.values(dataMap);
  }, [users]);

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500">Real-time metrics for {users.length} registry entries.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchAllData}
            className="bg-white px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="text-sm font-semibold">Sync All</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((metric, i) => (
          <StatCard key={i} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Traffic Load</h3>
              <p className="text-sm text-slate-500">Infrastructure density monitoring</p>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="traffic" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900">Signup Trends</h3>
            <p className="text-sm text-slate-500">Registration velocity</p>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="users" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
        <p className="text-slate-500">Managing {users.length} live records from database.</p>
      </div>
      <UserTable users={users} loading={loading} error={error} onRefresh={fetchAllData} isWaking={isWaking} />
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        onLogout={handleLogout}
      />
      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'} p-8 max-w-[1600px] mx-auto`}>
        <div className="flex items-center justify-end mb-10 gap-6">
          <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 w-96 shadow-sm">
            <Search size={18} className="text-slate-400 mr-2" />
            <input type="text" placeholder="Global search..." className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder-slate-400" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-2 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{currentUser?.name}</p>
                <p className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">SuperAdmin</p>
              </div>
              <img src={`https://ui-avatars.com/api/?name=${currentUser?.name}&background=6366f1&color=fff&bold=true`} alt="Profile" className="w-10 h-10 rounded-xl border-2 border-slate-100 group-hover:border-indigo-200 transition-all" />
            </div>
          </div>
        </div>

        {error && activeTab === 'dashboard' ? (
          <div className="bg-white rounded-3xl p-16 flex flex-col items-center justify-center text-center border-2 border-slate-100 border-dashed">
            <AlertCircle size={48} className="text-rose-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-900">Synchronization Error</h3>
            <p className="text-slate-500 mb-6 max-w-md">{error}</p>
            <button onClick={fetchAllData} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">Retry Handshake</button>
          </div>
        ) : loading && activeTab === 'dashboard' ? (
           <div className="py-40 flex flex-col items-center justify-center">
             <Loader2 size={48} className="animate-spin text-indigo-600 mb-4" />
             <p className="text-slate-500 font-medium tracking-wide">
               {isWaking ? 'The database engine is warming up...' : 'Assembling analytics...'}
             </p>
           </div>
        ) : renderContent()}

        <AIAssistant users={users} stats={stats} />
      </main>
    </div>
  );

  function renderContent() {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'users': return renderUsers();
      default: return (
        <div className="flex flex-col items-center justify-center py-40 text-slate-400">
          <Settings size={64} className="animate-spin-slow mb-4 opacity-20" />
          <h2 className="text-xl font-medium">Under Development</h2>
          <p>This security module is locked until next patch.</p>
        </div>
      );
    }
  }
};

export default App;
