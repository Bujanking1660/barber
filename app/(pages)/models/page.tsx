'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Plus, Trash2, X, Search } from 'lucide-react';
import AddModelSheet from '@/components/ui/AddModelSheet';
import Loader from '@/components/ui/Loader';

export default function ModelsPage() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loader, setLoader] = useState(false);

  const fetchModels = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('model').select('*');
    if (!error && data) setModels(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Yakin ingin menghapus model ini?');
    if (!confirmDelete) return;
    try {
      const { error } = await supabase.from('model').delete().eq('id', id);
      if (error) throw error;
      alert('Model berhasil dihapus.');
      fetchModels();
    } catch (err) {
      console.error('Error deleting model:', err);
      alert('Terjadi kesalahan saat menghapus data.');
    }
  };

  // 🔍 Filter hasil berdasarkan topName atau sideName
  const filteredModels = models.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.name?.toLowerCase().includes(query) ||
      item.position?.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoader(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <section className="min-h-screen bg-bg px-5 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-accent">Model</h1>
          <p className="text-muted text-sm">Data of haircut</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
            />
          </div>

          {/* Add Model Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
          >
            <Plus className="w-4 h-4" />
            Add Model
          </button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredModels.length > 0 ? (
          filteredModels.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover mr-4 cursor-pointer hover:opacity-90 transition"
                  onClick={() => setSelectedImage(item.image_url)}
                />
                <div>
                  <h2 className="font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-sm text-muted capitalize">
                    {item.position === 'top' ? 'Top of haircut' : 'Side of haircut'}
                  </p>
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

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr className="text-left text-muted text-sm border-b border-gray-200">
                <th className="p-3">ID</th>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Position</th>
                <th className="p-3">Created At</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredModels.length > 0 ? (
                filteredModels.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{item.id}</td>
                    <td className="p-3">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover cursor-pointer hover:opacity-90 transition"
                        onClick={() => setSelectedImage(item.image_url)}
                      />
                    </td>
                    <td className="p-3 text-gray-800 font-medium">{item.name}</td>
                    <td className="p-3 capitalize text-gray-600">{item.position}</td>
                    <td className="p-3 text-muted text-sm">
                      {item.created_at?.split('T')[0]}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Hapus model"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
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

      {/* Add Model Modal */}
      <AddModelSheet
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          fetchModels();
        }}
      />

      {/* Image Preview Modal */}
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
