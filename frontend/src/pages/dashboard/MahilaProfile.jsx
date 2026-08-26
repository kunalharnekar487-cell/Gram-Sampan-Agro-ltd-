import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiSend, FiPlus, FiX, FiUser, FiCamera } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://gram-sampan-backend.onrender.com';

export default function MahilaProfile() {
  const [form, setForm] = useState({
    groupName: '', address: '', village: '', taluka: '', district: '', pincode: '',
    contactNumber: '', members: [], productsManufactured: [], machinesAvailable: [],
    annualIncome: '', villagePopulation: '', landArea: '', sellingMethod: '', problems: '', supportNeeded: '',
  });
  const [productImages, setProductImages] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', age: '', role: '', mobile: '' });
  const [newMachine, setNewMachine] = useState({ name: '', quantity: '' });
  const imageInputRef = useRef(null);
  const profileInputRef = useRef(null);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/mahila-groups/profile');
      if (data.data) {
        const { productImages: pi, profilePhoto: ppUrl, status, approvedBy, approvedAt, isProfileComplete, createdAt, updatedAt, __v, _id, userId, ...fields } = data.data;
        setForm(prev => ({ ...prev, ...fields }));
        setProductImages(pi || []);
        setProfilePhoto(ppUrl || '');
      }
    } catch (err) { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (mode = 'draft') => {
    if (saving) return;
    setSaving(true);
    try {
      const endpoint = mode === 'draft' ? '/mahila-groups/draft' : '/mahila-groups/submit';
      await API.post(endpoint, form);
      toast.success(mode === 'draft' ? 'Draft saved!' : 'Submitted for approval!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleUpload = async (files) => {
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach(f => fd.append('images', f));
      const { data } = await API.post('/mahila-groups/upload-images', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProductImages(data.data.productImages);
      toast.success('Images uploaded!');
    } catch (err) { toast.error(err.response?.data?.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const handleDeleteImage = async (url) => {
    try {
      const { data } = await API.delete('/mahila-groups/delete-image', { data: { url } });
      setProductImages(data.data.productImages);
      toast.success('Image removed');
    } catch (err) { toast.error('Failed to remove image'); }
  };

  const handleProfilePhotoUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('images', file);
      const { data } = await API.post('/mahila-groups/upload-profile-photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfilePhoto(data.data.profilePhoto);
      toast.success('Profile photo updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const addMember = () => {
    if (!newMember.name) return toast.error('Enter member name');
    setForm({ ...form, members: [...form.members, newMember] });
    setNewMember({ name: '', age: '', role: '', mobile: '' });
  };

  const removeMember = (i) => { setForm({ ...form, members: form.members.filter((_, idx) => idx !== i) }); };

  const addProduct = () => {
    const p = prompt('Enter product name:');
    if (p) setForm({ ...form, productsManufactured: [...form.productsManufactured, p] });
  };

  const removeProduct = (i) => { setForm({ ...form, productsManufactured: form.productsManufactured.filter((_, idx) => idx !== i) }); };

  const addMachine = () => {
    if (!newMachine.name) return toast.error('Enter machine name');
    setForm({ ...form, machinesAvailable: [...form.machinesAvailable, newMachine] });
    setNewMachine({ name: '', quantity: '' });
  };

  const removeMachine = (i) => { setForm({ ...form, machinesAvailable: form.machinesAvailable.filter((_, idx) => idx !== i) }); };

  if (loading) return <LoadingSkeleton type="profile" count={6} />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Group Profile</h1><p className="text-gray-500 dark:text-gray-400">Complete your SHG profile</p></div>
        <div className="flex gap-3">
          <button onClick={() => handleSubmit('draft')} disabled={saving} className="btn-outline text-sm"><FiSave className="inline mr-1" />Save Draft</button>
          <button onClick={() => handleSubmit('submit')} disabled={saving} className="btn-primary text-sm"><FiSend className="inline mr-1" />{saving ? 'Saving...' : 'Submit'}</button>
        </div>
      </div>

      <input ref={profileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleProfilePhotoUpload(e.target.files[0])} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
              {profilePhoto ? (
                <img src={profilePhoto.startsWith('http') ? profilePhoto : `${API_BASE}/${profilePhoto}`} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-3xl font-bold">{form.groupName?.charAt(0)?.toUpperCase() || 'G'}</span>
              )}
            </div>
            <button onClick={() => profileInputRef.current?.click()} disabled={uploading} className="absolute -bottom-1 -right-1 p-2 bg-pink-600 text-white rounded-xl shadow-lg hover:bg-pink-700 transition-colors">
              <FiCamera size={14} />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Group Photo</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Click the camera icon to upload a photo</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Group Name</label><input type="text" value={form.groupName} onChange={e => setForm({...form, groupName: e.target.value})} className="input-field" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label><input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Village</label><input type="text" value={form.village} onChange={e => setForm({...form, village: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Taluka</label><input type="text" value={form.taluka} onChange={e => setForm({...form, taluka: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">District</label><input type="text" value={form.district} onChange={e => setForm({...form, district: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pincode</label><input type="text" value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Number</label><input type="tel" value={form.contactNumber} onChange={e => setForm({...form, contactNumber: e.target.value})} className="input-field" /></div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Members</h2>
        <div className="space-y-3 mb-4">
          {form.members.map((m, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-3"><FiUser className="text-gray-400" /><div><p className="text-sm font-medium text-gray-900 dark:text-white">{m.name}</p><p className="text-xs text-gray-500">{m.role} | Age: {m.age} | {m.mobile}</p></div></div>
              <button onClick={() => removeMember(i)} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><FiX size={16} /></button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input type="text" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} placeholder="Name" className="input-field text-sm" />
          <input type="text" value={newMember.age} onChange={e => setNewMember({...newMember, age: e.target.value})} placeholder="Age" className="input-field text-sm" />
          <input type="text" value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} placeholder="Role" className="input-field text-sm" />
          <button onClick={addMember} className="btn-primary text-sm"><FiPlus className="inline mr-1" />Add</button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Products & Machines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Products Manufactured</label>
            <div className="flex flex-wrap gap-2 mb-3">{form.productsManufactured.map((p, i) => (<span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm">{p}<button onClick={() => removeProduct(i)} className="text-green-500 hover:text-red-500"><FiX size={14} /></button></span>))}</div>
            <button onClick={addProduct} className="btn-outline text-sm w-full"><FiPlus className="inline mr-1" />Add Product</button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Machines Available</label>
            <div className="space-y-2 mb-3">{form.machinesAvailable.map((m, i) => (<div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg"><span className="text-sm">{m.name} (x{m.quantity})</span><button onClick={() => removeMachine(i)} className="text-red-500"><FiX size={14} /></button></div>))}</div>
            <div className="flex gap-2"><input type="text" value={newMachine.name} onChange={e => setNewMachine({...newMachine, name: e.target.value})} placeholder="Machine name" className="input-field text-sm flex-1" /><input type="text" value={newMachine.quantity} onChange={e => setNewMachine({...newMachine, quantity: e.target.value})} placeholder="Qty" className="input-field text-sm w-20" /><button onClick={addMachine} className="btn-primary text-sm"><FiPlus /></button></div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Product Images</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Upload photos of your group's products</p>
        <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleUpload(e.target.files)} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {productImages.map((photo, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <img src={photo.startsWith('http') ? photo : `${API_BASE}/${photo}`} alt="" className="w-full h-full object-cover" />
              <button onClick={() => handleDeleteImage(photo)} className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><FiX size={14} /></button>
            </div>
          ))}
          <button onClick={() => imageInputRef.current?.click()} disabled={uploading} className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-primary-500 transition-colors">
            <FiCamera size={24} />
            <span className="text-xs">{uploading ? 'Uploading...' : 'Add Image'}</span>
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Additional Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Annual Income (₹)</label><input type="text" value={form.annualIncome} onChange={e => setForm({...form, annualIncome: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Village Population</label><input type="text" value={form.villagePopulation} onChange={e => setForm({...form, villagePopulation: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Land Area (acres)</label><input type="text" value={form.landArea} onChange={e => setForm({...form, landArea: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selling Method</label><input type="text" value={form.sellingMethod} onChange={e => setForm({...form, sellingMethod: e.target.value})} className="input-field" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Problems</label><textarea rows={3} value={form.problems} onChange={e => setForm({...form, problems: e.target.value})} className="input-field resize-none" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Support Needed</label><textarea rows={3} value={form.supportNeeded} onChange={e => setForm({...form, supportNeeded: e.target.value})} className="input-field resize-none" /></div>
        </div>
      </motion.div>
    </div>
  );
}
