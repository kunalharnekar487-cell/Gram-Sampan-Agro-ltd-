import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';

const categories = ['vegetables', 'fruits', 'grains', 'spices', 'pickles', 'papad', 'masala', 'handmade', 'organic', 'other'];

export default function FarmerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'vegetables', description: '', quantity: '', unit: 'kg', price: '', availability: true });

  useEffect(() => { fetchProducts(); }, [page]);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get(`/products/my?page=${page}&limit=10`);
      setProducts(data.data);
      setPagination(data.pagination);
    } catch (err) { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm({ name: '', category: 'vegetables', description: '', quantity: '', unit: 'kg', price: '', availability: true }); setModalOpen(true); };

  const openEdit = (product) => { setEditing(product); setForm({ name: product.name, category: product.category, description: product.description, quantity: product.quantity, unit: product.unit, price: product.price, availability: product.availability }); setModalOpen(true); };

  const handleSave = async () => {
    try {
      if (editing) {
        await API.put(`/products/${editing._id}`, form);
        toast.success('Product updated');
      } else {
        await API.post('/products', form);
        toast.success('Product created');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) { toast.error('Failed to delete'); }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Category', render: (r) => <Badge status={r.category}>{r.category}</Badge> },
    { header: 'Quantity', render: (r) => `${r.quantity} ${r.unit}` },
    { header: 'Price', render: (r) => `₹${r.price}` },
    { header: 'Status', render: (r) => <Badge status={r.status}>{r.status.replace('_', ' ')}</Badge> },
    { header: 'Approved', render: (r) => r.isApproved ? <span className="text-green-500">Yes</span> : <span className="text-orange-500">Pending</span> },
    { header: 'Actions', render: (r) => <div className="flex gap-2"><button onClick={() => openEdit(r)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><FiEdit2 size={16} /></button><button onClick={() => handleDelete(r._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500"><FiTrash2 size={16} /></button></div> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Products</h1><p className="text-gray-500 dark:text-gray-400">Manage your agricultural products</p></div>
        <button onClick={openCreate} className="btn-primary text-sm"><FiPlus className="inline mr-1" />Add Product</button>
      </div>

      <DataTable columns={columns} data={products} loading={loading} pagination={pagination} onPageChange={setPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add Product'}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Name</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label><textarea rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field resize-none" /></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label><input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit</label><select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} className="input-field"><option value="kg">Kg</option><option value="g">Gram</option><option value="quintal">Quintal</option><option value="ton">Ton</option><option value="piece">Piece</option><option value="litre">Litre</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price (₹)</label><input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="input-field" /></div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked={form.availability} onChange={e => setForm({...form, availability: e.target.checked})} className="rounded border-gray-300 text-primary-600" /> Available for sale</label>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setModalOpen(false)} className="btn-outline text-sm">Cancel</button>
            <button onClick={handleSave} className="btn-primary text-sm">{editing ? 'Update' : 'Create'} Product</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
