'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Plus, Trash2, X, Search } from 'lucide-react';
import AddOrderSheet from '@/components/ui/AddOrderSheet';

export default function OrderPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('order')
        .select('*')
        .order('created_at', { ascending: false });

      if (orderError) throw orderError;

      const { data: modelData, error: modelError } = await supabase
        .from('model')
        .select('*');
      if (modelError) throw modelError;

      const merged = orderData.map((o) => {
        const topModel = modelData.find((m) => m.id === o.top);
        const sideModel = modelData.find((m) => m.id === o.side);
        return {
          ...o,
          topName: topModel?.name || o.top,
          sideName: sideModel?.name || o.side,
        };
      });

      setOrders(merged);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Yakin ingin menghapus order ini?');
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from('order').delete().eq('id', id);
      if (error) throw error;
      alert('Order berhasil dihapus.');
      fetchOrders();
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('Terjadi kesalahan saat menghapus data.');
    }
  };

  // 🔍 Filter pencarian
  const filteredOrders = orders.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.customer_name?.toLowerCase().includes(q) ||
      item.topName?.toLowerCase().includes(q) ||
      item.sideName?.toLowerCase().includes(q)
    );
  });

  return (
    <section className="min-h-screen bg-bg px-5 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-accent">Order</h1>
          <p className="text-muted text-sm">Data of customers</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search customer or haircut..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
            />
          </div>

          {/* Add button */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
          >
            <Plus className="w-4 h-4" />
            Add Order
          </button>
        </div>
      </div>

      {/* 📱 Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-surface border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center">
                <img
                  src={item.image_url || '/placeholder.png'}
                  alt={item.customer_name}
                  className="w-16 h-16 rounded-xl object-cover mr-4 cursor-pointer hover:opacity-90 transition"
                  onClick={() => setSelectedImage(item.image_url)}
                />
                <div>
                  <h2 className="font-semibold text-gray-800">{item.customer_name}</h2>
                  <p className="text-sm text-muted capitalize">
                    {item.topName} - {item.sideName}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">{item.price}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 italic text-sm">No results found...</p>
        )}
      </div>

      {/* 💻 Desktop Table View */}
      <div className="hidden md:block">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr className="text-left text-muted text-sm border-b border-gray-200">
                <th className="p-3">ID</th>
                <th className="p-3">Image</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Haircut</th>
                <th className="p-3">Price</th>
                <th className="p-3">Created At</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-gray-400 italic text-sm"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{item.id}</td>
                    <td className="p-3">
                      <img
                        src={item.image_url || '/placeholder.png'}
                        alt={item.customer_name}
                        className="w-14 h-14 rounded-lg object-cover cursor-pointer hover:opacity-90 transition"
                        onClick={() => setSelectedImage(item.image_url)}
                      />
                    </td>
                    <td className="p-3 font-medium text-gray-800">
                      {item.customer_name}
                    </td>
                    <td className="p-3 capitalize text-gray-600">
                      {item.topName} - {item.sideName}
                    </td>
                    <td className="p-3 text-gray-800">{item.price}</td>
                    <td className="p-3 text-muted text-sm">
                      {item.created_at?.split('T')[0]}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-gray-400 italic text-sm"
                  >
                    No results found...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ➕ Add Order Sheet */}
      <AddOrderSheet
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          fetchOrders();
        }}
      />

      {/* 🖼️ Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-lg"
            />
            <button
              className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded-full hover:bg-black transition"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
