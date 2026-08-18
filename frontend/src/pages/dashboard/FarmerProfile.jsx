import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiSend, FiCamera, FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const summerOptions = ['Rice', 'Wheat', 'Jowar', 'Bajra', 'Maize', 'Groundnut', 'Soybean', 'Cotton', 'Sugarcane', 'Tur', 'Moong', 'Udid'];
const monsoonOptions = ['Rice', 'Wheat', 'Jowar', 'Bajra', 'Maize', 'Groundnut', 'Soybean', 'Cotton', 'Sugarcane', 'Tur', 'Moong', 'Udid'];
const farmingTypes = ['Organic', 'Chemical', 'Mixed'];

export default function FarmerProfile() {
  const [form, setForm] = useState({
    fullName: '', address: '', village: '', taluka: '', district: '', pincode: '', mobile: '',
    landArea: '', farmingType: '', summerCrops: [], monsoonCrops: [], sellingMethod: '',
    annualIncome: '', distanceFromHighway: '', villagePopulation: '', farmingProblems: '', supportRequired: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/farmers/profile');
      if (data.data) {
        const { farmPhotos, productPhotos, status, approvedBy, approvedAt, isProfileComplete, createdAt, updatedAt, __v, _id, userId, ...fields } = data.data;
        setForm(prev => ({ ...prev, ...fields }));
      }
    } catch (err) { toast.error('Failed to load profile'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (mode = 'submit') => {
    setSaving(true);
    try {
      const endpoint = mode === 'draft' ? '/farmers/draft' : '/farmers/submit';
      const { data } = await API.post(endpoint, form);
      toast.success(mode === 'draft' ? 'Draft saved!' : 'Profile submitted for approval!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const toggleCrop = (field, crop) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(crop) ? prev[field].filter(c => c !== crop) : [...prev[field], crop],
    }));
  };

  if (loading) return <LoadingSkeleton type="profile" count={6} />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Farmer Profile</h1><p className="text-gray-500 dark:text-gray-400">Complete your profile to get started</p></div>
        <div className="flex gap-3">
          <button onClick={() => handleSubmit('draft')} disabled={saving} className="btn-outline text-sm"><FiSave className="inline mr-1" />Save Draft</button>
          <button onClick={() => handleSubmit('submit')} disabled={saving} className="btn-primary text-sm"><FiSend className="inline mr-1" />{saving ? 'Saving...' : 'Submit'}</button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label><input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label><input type="tel" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} className="input-field" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label><input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Village</label><input type="text" value={form.village} onChange={e => setForm({...form, village: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Taluka</label><input type="text" value={form.taluka} onChange={e => setForm({...form, taluka: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">District</label><input type="text" value={form.district} onChange={e => setForm({...form, district: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pincode</label><input type="text" value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} className="input-field" /></div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Agricultural Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Land Area (acres)</label><input type="text" value={form.landArea} onChange={e => setForm({...form, landArea: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type of Farming</label><select value={form.farmingType} onChange={e => setForm({...form, farmingType: e.target.value})} className="input-field"><option value="">Select farming type</option>{farmingTypes.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}</select></div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Summer Crops</label>
          <div className="flex flex-wrap gap-2">{summerOptions.map(crop => <button key={crop} type="button" onClick={() => toggleCrop('summerCrops', crop)} className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${form.summerCrops.includes(crop) ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'}`}>{crop}</button>)}</div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Monsoon Crops</label>
          <div className="flex flex-wrap gap-2">{monsoonOptions.map(crop => <button key={crop} type="button" onClick={() => toggleCrop('monsoonCrops', crop)} className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${form.monsoonCrops.includes(crop) ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'}`}>{crop}</button>)}</div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Additional Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Selling Method</label><input type="text" value={form.sellingMethod} onChange={e => setForm({...form, sellingMethod: e.target.value})} className="input-field" placeholder="e.g., Local market, Mandi" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Annual Income (₹)</label><input type="text" value={form.annualIncome} onChange={e => setForm({...form, annualIncome: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Distance from Highway (km)</label><input type="text" value={form.distanceFromHighway} onChange={e => setForm({...form, distanceFromHighway: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Village Population</label><input type="text" value={form.villagePopulation} onChange={e => setForm({...form, villagePopulation: e.target.value})} className="input-field" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Problems in Farming</label><textarea rows={3} value={form.farmingProblems} onChange={e => setForm({...form, farmingProblems: e.target.value})} className="input-field resize-none" placeholder="Describe any problems you face in farming..." /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Support Required</label><textarea rows={3} value={form.supportRequired} onChange={e => setForm({...form, supportRequired: e.target.value})} className="input-field resize-none" placeholder="What kind of support do you need?" /></div>
        </div>
      </motion.div>
    </div>
  );
}
