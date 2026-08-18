import { useState, useEffect } from 'react';
import { FiCheck, FiX, FiEye, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

export default function CRPFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);

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

  const handleExport = async (format) => {
    toast.success(`Exporting ${format}...`);
  };

  const columns = [
    { header: 'Name', render: (r) => <button onClick={() => setSelected(r)} className="font-medium text-primary-600 dark:text-primary-400 hover:underline text-left">{r.fullName}</button> },
    { header: 'Mobile', accessor: 'mobile' },
    { header: 'Village', accessor: 'village' },
    { header: 'Taluka', accessor: 'taluka' },
    { header: 'Land', accessor: 'landArea' },
    { header: 'Farming', accessor: 'farmingType' },
    { header: 'Status', render: (r) => <Badge status={r.status}>{r.status}</Badge> },
    { header: 'Actions', render: (r) => (
      <div className="flex gap-2">
        {r.status === 'submitted' && <><button onClick={() => handleStatus(r._id, 'approve')} className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg"><FiCheck size={16} /></button><button onClick={() => handleStatus(r._id, 'reject')} className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg"><FiX size={16} /></button></>}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Farmers</h1><p className="text-gray-500 dark:text-gray-400">Manage & verify farmer data</p></div>
        <div className="flex gap-2">
          <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }} className="input-field w-auto text-sm"><option value="">All</option><option value="submitted">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select>
          <button onClick={() => handleExport('pdf')} className="btn-outline text-sm"><FiDownload className="inline mr-1" />PDF</button>
          <button onClick={() => handleExport('excel')} className="btn-outline text-sm"><FiDownload className="inline mr-1" />Excel</button>
        </div>
      </div>

      <DataTable columns={columns} data={farmers} loading={loading} searchable onSearch={(v) => { setSearch(v); setPage(1); }} pagination={pagination} onPageChange={setPage} />

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Farmer Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Name', selected.fullName], ['Mobile', selected.mobile], ['Village', selected.village],
                ['Taluka', selected.taluka], ['District', selected.district], ['Land Area', `${selected.landArea || '-'} acres`],
                ['Farming Type', selected.farmingType || '-'], ['Annual Income', `₹${selected.annualIncome || '-'}`],
                ['Selling Method', selected.sellingMethod || '-'], ['Crops (Summer)', selected.summerCrops?.join(', ') || '-'],
                ['Crops (Monsoon)', selected.monsoonCrops?.join(', ') || '-'], ['Status', selected.status],
              ].map(([label, value], i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"><p className="text-xs text-gray-500 mb-1">{label}</p><p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p></div>
              ))}
            </div>
            {selected.farmingProblems && <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"><p className="text-xs text-gray-500 mb-1">Problems</p><p className="text-sm text-gray-900 dark:text-white">{selected.farmingProblems}</p></div>}
            {selected.supportRequired && <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"><p className="text-xs text-gray-500 mb-1">Support Required</p><p className="text-sm text-gray-900 dark:text-white">{selected.supportRequired}</p></div>}
          </div>
        )}
      </Modal>
    </div>
  );
}
