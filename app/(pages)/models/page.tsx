'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import AddModelSheet from '@/components/ui/AddModelSheet';
import { supabase } from '@/lib/supabaseClient';

export default function ModelsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil data dari Supabase
  async function fetchModels() {
    setLoading(true);
    const { data, error } = await supabase
      .from('model')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching models:', error);
    } else {
      setModels(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <section className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-accent">Model</h1>
          <p className="text-muted text-sm">Data of haircut</p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="border border-accent rounded-full p-2 hover:bg-primary hover:text-surface hover:border-primary transition"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Loading state */}
      {loading && <p className="text-center text-muted py-4">Loading...</p>}

      {/* 📱 Mobile Card View */}
      {!loading && (
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {models.length > 0 ? (
            models.map((item) => (
              <div
                key={item.id}
                className="flex items-center bg-surface border border-border rounded-2xl p-3 shadow-sm"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover mr-4"
                />
                <div>
                  <h2 className="font-semibold text-accent">{item.name}</h2>
                  <p className="text-sm text-muted capitalize">
                    {item.position}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted py-4">Belum ada model...</p>
          )}
        </div>
      )}

      {/* 💻 Desktop Table View */}
      {!loading && (
        <div className="hidden md:block">
          <div className="bg-surface rounded-2xl shadow p-6 border border-border">
            {models.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border text-left text-muted">
                    <th className="p-3">ID</th>
                    <th className="p-3">Image</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Position</th>
                    <th className="p-3">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {models.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border hover:bg-bg transition"
                    >
                      <td className="p-3">{item.id}</td>
                      <td className="p-3">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-14 h-14 rounded-md object-cover"
                        />
                      </td>
                      <td className="p-3">{item.name}</td>
                      <td className="p-3 capitalize">{item.position}</td>
                      <td className="p-3 text-sm text-muted">
                        {item.created_at?.split('T')[0]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-muted py-4">
                Belum ada model...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Sheet tambah model */}
      <AddModelSheet
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          fetchModels(); // refresh data setelah tambah
        }}
      />
    </section>
  );
}
