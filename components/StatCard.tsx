
import React from 'react';
import { Metric } from '../types';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const StatCard: React.FC<Metric> = ({ label, value, change, trend }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
          trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 
          trend === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
        }`}>
          {trend === 'up' && <ArrowUpRight size={14} className="mr-1" />}
          {trend === 'down' && <ArrowDownRight size={14} className="mr-1" />}
          {trend === 'neutral' && <Minus size={14} className="mr-1" />}
          {Math.abs(change)}%
        </div>
      </div>
    </div>
  );
};

export default StatCard;
