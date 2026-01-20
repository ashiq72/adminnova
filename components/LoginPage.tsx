
import React, { useState } from 'react';
import { Zap, Phone, Lock, Eye, EyeOff, Loader2, AlertCircle, ShieldAlert } from 'lucide-react';
import { ApiResponse, LoginResponseData, User, UserRoleEnum } from '../types';

interface LoginPageProps {
  onLoginSuccess: (token: string, user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://base360.onrender.com/api/v1/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const result: ApiResponse<LoginResponseData> = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Login failed');
      }

      const token = result.data.accessToken;

      // Fetch users to verify the role of the logged-in user
      const usersRes = await fetch('https://base360.onrender.com/api/v1/users/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const usersResult: ApiResponse<User[]> = await usersRes.json();
      
      const loggedInUser = usersResult.data.find(u => u.phone === phone);

      if (!loggedInUser) {
        throw new Error('User profile could not be verified in the database.');
      }

      // Strictly check 'role' field as per user requirement
      if (loggedInUser.role !== UserRoleEnum.SUPER_ADMIN) {
        throw new Error(`Access Denied: Your account role (${loggedInUser.role || 'none'}) does not have SuperAdmin privileges.`);
      }

      onLoginSuccess(token, loggedInUser);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-600 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-900 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex bg-indigo-600 p-3 rounded-2xl text-white mb-6 shadow-2xl shadow-indigo-600/40">
            <Zap size={32} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">SuperNova</h1>
          <p className="text-slate-400 font-medium tracking-wide">Infrastructure Command Center</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Identity (Phone)</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <Phone size={20} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="017XXXXXXXX"
                  className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-600"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-12 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in zoom-in duration-300">
                <div className="mt-0.5 text-rose-500">
                  {error.includes('Denied') ? <ShieldAlert size={20} /> : <AlertCircle size={20} />}
                </div>
                <p className="text-sm font-medium text-rose-200 leading-tight">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <span>Establish Connection</span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-slate-500 text-xs font-medium uppercase tracking-[0.2em]">
          SuperNova Secure Access Protocol V2.4
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
