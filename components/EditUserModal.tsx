
import React, { useState, useRef } from 'react';
import { X, Camera, Save, Loader2, Globe, MapPin, Info, User as UserIcon } from 'lucide-react';
import { User, GenderEnum, TBloodGroup, UserRoleEnum, ApiResponse } from '../types';

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onUpdateSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: user.name || '',
    gender: user.gender || '',
    bloodGroup: user.bloodGroup || '',
    role: user.role || UserRoleEnum.USER,
    bio: user.bio || '',
    about: user.about || '',
    website: user.website || '',
    location: user.location || '',
    permanentAddress: user.permanentAddress || '',
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.image || null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('supernova_token');
      const submissionData = new FormData();
      
      // Append fields from formData
      Object.entries(formData).forEach(([key, value]) => {
        if (value) submissionData.append(key, value);
      });
      
      // Append file if selected
      if (selectedFile) {
        submissionData.append('file', selectedFile);
      }

      const response = await fetch(`https://base360.onrender.com/api/v1/users/update-user/${user._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submissionData
      });

      const result: ApiResponse<User> = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Update failed');
      }

      onUpdateSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Edit User Profile</h2>
            <p className="text-xs text-slate-500 font-medium">Modifying record #{(user._id || '').slice(-8)}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-600 transition-all border border-transparent hover:border-slate-200">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-28 h-28 rounded-3xl bg-indigo-50 overflow-hidden border-4 border-white shadow-lg ring-1 ring-slate-100">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-indigo-300">
                    <UserIcon size={40} />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2.5 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-500 transition-all group-hover:scale-110 active:scale-95 border-2 border-white"
              >
                <Camera size={18} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Image</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><UserIcon size={14}/></div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Identification</h3>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Access Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm outline-none appearance-none"
                >
                  <option value={UserRoleEnum.USER}>User</option>
                  <option value={UserRoleEnum.ADMIN}>Admin</option>
                  <option value={UserRoleEnum.SUPER_ADMIN}>Super Admin</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm outline-none"
                  >
                    <option value="">Select</option>
                    <option value={GenderEnum.MALE}>Male</option>
                    <option value={GenderEnum.FEMALE}>Female</option>
                    <option value={GenderEnum.OTHER}>Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm outline-none"
                  >
                    <option value="">Select</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Info size={14}/></div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Detailed Bio</h3>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Bio (Short)</label>
                <textarea
                  name="bio"
                  rows={2}
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Elevator pitch..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">About (Long)</label>
                <textarea
                  name="about"
                  rows={3}
                  value={formData.about}
                  onChange={handleInputChange}
                  placeholder="Tell us more..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm outline-none resize-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><Globe size={14}/></div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Connectivity & Location</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Current Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1">Permanent Address</label>
              <textarea
                name="permanentAddress"
                rows={2}
                value={formData.permanentAddress}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm outline-none resize-none"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3 text-rose-500">
            {error && <p className="text-xs font-bold tracking-tight bg-rose-50 px-3 py-2 rounded-lg border border-rose-100">{error}</p>}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-white transition-all"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Commit Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
