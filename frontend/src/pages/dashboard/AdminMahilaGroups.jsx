import { useState, useEffect } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';

export default function AdminMahilaGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => { fetchGroups(); }, [page, search, filter]);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.append('search', search);
      if (filter) params.append('status', filter);
      const { data } = await API.get(`/mahila-groups?${params}`);
      setGroups(data.data);
      setPagination(data.pagination);
    } catch (err) { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const handleStatus = async (id, status) => {
    try {
      await API.put(`/mahila-groups/${id}/${status}`);
      toast.success(`Group ${status}ed`);
      fetchGroups();
    } catch (err) { toast.error('Failed'); }
  };

  const columns = [
    { header: 'Group Name', render: (r) => <span className="font-medium text-gray-900 dark:text-white">{r.groupName}</span> },
    { header: 'Contact', accessor: 'contactNumber' },
    { header: 'Village', accessor: 'village' },
    { header: 'Taluka', accessor: 'taluka' },
    { header: 'District', accessor: 'district' },
    { header: 'Members', render: (r) => r.members?.length || 0 },
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
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mahila Bachat Gath</h1><p className="text-gray-500 dark:text-gray-400">Manage all SHG groups</p></div>
        <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }} className="input-field w-auto text-sm"><option value="">All Status</option><option value="draft">Draft</option><option value="submitted">Submitted</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select>
      </div>
      <DataTable columns={columns} data={groups} loading={loading} searchable onSearch={(v) => { setSearch(v); setPage(1); }} pagination={pagination} onPageChange={setPage} />
    </div>
  );
}
