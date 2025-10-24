'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Plus } from 'lucide-react';
import AddOrderSheet from '@/components/ui/AddOrderSheet';

export default function OrderPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <section className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-accent">Order</h1>
          <p className="text-muted text-sm">Data of customers</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="border border-accent rounded-full p-2 hover:bg-primary hover:text-surface hover:border-primary transition"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {loading && <p className="text-center text-muted py-4">Loading...</p>}

      {/* 📱 Mobile Card View */}
      {!loading && (
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {orders.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-surface border border-border rounded-2xl p-3 shadow-sm"
            >
              <img
                src={item.image_url || '/placeholder.png'}
                alt={item.customer_name}
                className="w-16 h-16 rounded-lg object-cover mr-4"
              />
              <div>
                <h2 className="font-semibold text-accent">{item.customer_name}</h2>
                <p className="text-sm text-muted capitalize">
                  {item.topName} - {item.sideName}
                </p>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <p className="text-center py-4 text-muted">Belum ada order...</p>
          )}
        </div>
      )}

      {/* 💻 Desktop Table View */}
      {!loading && (
        <div className="hidden md:block">
          <div className="bg-surface rounded-2xl shadow p-6 border border-border">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="p-3">ID</th>
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Haircut</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Created At</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-bg">
                    <td className="p-3">{item.id}</td>
                    <td className="p-3">
                      <img
                        src={item.image_url || '/placeholder.png'}
                        className="w-14 h-14 rounded-md object-cover"
                        alt={item.customer_name}
                      />
                    </td>
                    <td className="p-3">{item.customer_name}</td>
                    <td className="p-3 capitalize">
                      {item.topName} - {item.sideName}
                    </td>
                    <td className="p-3">{item.price}</td>
                    <td className="p-3 text-sm text-muted">
                      {item.created_at?.split('T')[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {orders.length === 0 && (
              <p className="text-center py-4 text-muted">Belum ada order...</p>
            )}
          </div>
        </div>
      )}

      {/* 🪄 Add Order Sheet */}
      <AddOrderSheet
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          fetchOrders(); // refresh data setelah tambah
        }}
      />
    </section>
  );
}
