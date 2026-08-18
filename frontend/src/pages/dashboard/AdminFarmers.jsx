import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiEye, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';

export default function AdminFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => { fetchFarmers(); }, [page, search, filter]);

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.append('search', search);
      if (filter) params.append('status', filter);
      const { data } = await API.get(`/farmers?${params}`);
      setFarmers(data.data);
      setPagination(data.pagination);
    } catch (err) { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const handleStatus = async (id, status) => {
    try {
      await API.put(`/farmers/${id}/${status}`);
      toast.success(`Farmer ${status}ed`);
      fetchFarmers();
    } catch (err) { toast.error('Failed'); }
  };

  const columns = [
    { header: 'Name', render: (r) => <span className="font-medium text-gray-900 dark:text-white">{r.fullName}</span> },
    { header: 'Mobile', accessor: 'mobile' },
    { header: 'Village', accessor: 'village' },
    { header: 'Taluka', accessor: 'taluka' },
    { header: 'District', accessor: 'district' },
    { header: 'Land (acres)', accessor: 'landArea' },
    { header: 'Status', render: (r) => <Badge status={r.status}>{r.status}</Badge> },
    { header: 'Actions', render: (r) => (
      <div className="flex gap-2">
        {r.status !== 'approved' && <button onClick={() => handleStatus(r._id, 'approve')} className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg hover:bg-green-100"><FiCheck size={16} /></button>}
        {r.status !== 'rejected' && <button onClick={() => handleStatus(r._id, 'reject')} className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-100"><FiX size={16} /></button>}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Farmers</h1><p className="text-gray-500 dark:text-gray-400">Manage all registered farmers</p></div>
        <div className="flex gap-2">
          <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }} className="input-field w-auto text-sm"><option value="">All Status</option><option value="draft">Draft</option><option value="submitted">Submitted</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select>
        </div>
      </div>
      <DataTable columns={columns} data={farmers} loading={loading} searchable onSearch={(v) => { setSearch(v); setPage(1); }} pagination={pagination} onPageChange={setPage} />
    </div>
  );
}
