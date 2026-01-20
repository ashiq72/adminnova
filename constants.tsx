import React from 'react';
import { LayoutDashboard, Users, ShieldCheck, Activity, Settings, Bell, Search, LogOut } from 'lucide-react';
// Fix: Removed SystemLog which is not exported from types.ts, and added UserRoleEnum for proper type-safe role mapping
import { User, Metric, UserRoleEnum } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'users', label: 'User Management', icon: <Users size={20} /> },
  { id: 'security', label: 'Security & Auth', icon: <ShieldCheck size={20} /> },
  { id: 'analytics', label: 'System Analytics', icon: <Activity size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

export const MOCK_METRICS: Metric[] = [
  { label: 'Total Revenue', value: '$128,430', change: 12.5, trend: 'up' },
  { label: 'Active Users', value: '43,201', change: 8.2, trend: 'up' },
  { label: 'Server Uptime', value: '99.98%', change: 0.02, trend: 'neutral' },
  { label: 'Pending Support', value: '24', change: -5.4, trend: 'down' },
];

// Fix: Corrected MOCK_USERS to use UserRoleEnum values and removed unknown __v property to strictly adhere to the User type definition
export const MOCK_USERS: User[] = [
  { _id: '1', name: 'Alex Rivera', phone: '+1 (555) 010-1234', role: UserRoleEnum.SUPER_ADMIN, isDeleted: false, createdAt: '2023-10-01T12:00:00Z', updatedAt: '2023-10-01T12:00:00Z' },
  { _id: '2', name: 'Sarah Chen', phone: '+1 (555) 020-5678', role: UserRoleEnum.ADMIN, isDeleted: false, createdAt: '2023-10-02T09:30:00Z', updatedAt: '2023-10-02T09:30:00Z' },
  { _id: '3', name: 'Michael Scott', phone: '+1 (555) 030-9012', role: UserRoleEnum.USER, isDeleted: false, createdAt: '2023-09-15T14:20:00Z', updatedAt: '2023-09-15T14:20:00Z' },
  { _id: '4', name: 'Elena Rodriguez', phone: '+1 (555) 040-3456', role: UserRoleEnum.ADMIN, isDeleted: true, createdAt: '2023-08-20T11:45:00Z', updatedAt: '2023-08-20T11:45:00Z' },
  { _id: '5', name: 'James Wilson', phone: '+1 (555) 050-7890', role: UserRoleEnum.ADMIN, isDeleted: false, createdAt: '2023-11-05T08:15:00Z', updatedAt: '2023-11-05T08:15:00Z' },
  { _id: '6', name: 'Sofia Patel', phone: '+1 (555) 060-1234', role: UserRoleEnum.USER, isDeleted: false, createdAt: '2023-11-10T16:50:00Z', updatedAt: '2023-11-10T16:50:00Z' },
];

export const SYSTEM_CHART_DATA = [
  { name: 'Mon', traffic: 4000, users: 2400 },
  { name: 'Tue', traffic: 3000, users: 1398 },
  { name: 'Wed', traffic: 2000, users: 9800 },
  { name: 'Thu', traffic: 2780, users: 3908 },
  { name: 'Fri', traffic: 1890, users: 4800 },
  { name: 'Sat', traffic: 2390, users: 3800 },
  { name: 'Sun', traffic: 3490, users: 4300 },
];