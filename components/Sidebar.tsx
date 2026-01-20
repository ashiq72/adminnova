
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { LogOut, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, collapsed, setCollapsed, onLogout }) => {
  return (
    <div className={`fixed left-0 top-0 h-full bg-slate-900 text-slate-300 transition-all duration-300 z-50 ${collapsed ? 'w-20' : 'w-64'} flex flex-col`}>
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="bg-indigo-600 p-1.5 rounded-lg mr-3 text-white">
          <Zap size={20} />
        </div>
        {!collapsed && <span className="font-bold text-lg text-white tracking-tight">SuperNova</span>}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 mt-6 px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className={`${activeTab === item.id ? 'text-white' : 'text-slate-400'}`}>
              {item.icon}
            </span>
            {!collapsed && <span className="ml-3 font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center px-3 py-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span className="ml-3">Collapse</span>}
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2 hover:bg-rose-500/10 rounded-lg text-rose-400 transition-all"
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3 font-medium">End Session</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
