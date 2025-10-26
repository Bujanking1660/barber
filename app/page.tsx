'use client';

import { useEffect, useState } from 'react';
import { Scissors } from 'lucide-react';
import dayjs from 'dayjs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  PieLabelRenderProps,
} from 'recharts';
import { supabase } from '@/lib/supabaseClient';

const COLORS = ['#D4AF37', '#1C1C1C', '#FFB547', '#7B61FF', '#FF6B6B'];

export default function Home() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyTopCut, setWeeklyTopCut] = useState<{ topName: string; sideName: string; count: number } | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

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

      const revenue = merged.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0);
      setTotalRevenue(revenue);

      setTotalOrders(merged.length);

      const startOfWeek = dayjs().startOf('week');
      const weeklyOrders = merged.filter((o) => dayjs(o.created_at).isAfter(startOfWeek));

      const cutCountMap: Record<string, number> = {};
      weeklyOrders.forEach((o) => {
        const key = `${o.topName} - ${o.sideName}`;
        cutCountMap[key] = (cutCountMap[key] || 0) + 1;
      });

      const topCutEntry = Object.entries(cutCountMap).sort((a, b) => b[1] - a[1])[0];
      if (topCutEntry) {
        const [cut, count] = topCutEntry;
        const [topName, sideName] = cut.split(' - ');
        setWeeklyTopCut({ topName, sideName, count });
      } else {
        setWeeklyTopCut(null);
      }

      const chartArray = Object.entries(cutCountMap).map(([name, count]) => ({ name, count }));
      setChartData(chartArray);

      const totalWeekly = chartArray.reduce((acc, c) => acc + c.count, 0);
      const pieArray = chartArray.map((c) => ({ name: c.name, value: c.count / totalWeekly * 100 }));
      setPieData(pieArray);

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
    <main className="min-h-screen bg-bg px-5 py-8 relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center mb-6 z-10">
        <div>
          <h1 className="text-3xl font-bold text-accent">Dashboard</h1>
          <p className="text-muted text-sm">Data of customers</p>
        </div>
      </header>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 z-10">
        <div className="bg-surface rounded-2xl shadow p-4 flex flex-col items-center">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
        </div>
        <div className="bg-surface rounded-2xl shadow p-4 flex flex-col items-center">
          <h3 className="text-gray-500 text-sm">Revenue</h3>
          <p className="text-2xl font-bold text-gray-800">Rp.{totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-surface rounded-2xl shadow p-4 flex flex-col items-center sm:col-span-2">
          <h3 className="text-gray-500 text-sm">Top Haircut (Weekly)</h3>
          {weeklyTopCut ? (
            <p className="text-lg font-semibold text-gray-800 capitalize">
              {weeklyTopCut.topName} - {weeklyTopCut.sideName} ({weeklyTopCut.count})
            </p>
          ) : (
            <p className="text-gray-400 italic">No data yet</p>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 z-10">
        <div className="bg-surface rounded-2xl shadow p-4">
          <h3 className="text-gray-800 font-semibold mb-2 text-center">
            Orders per Haircut (Weekly)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#D4AF37" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-surface rounded-2xl shadow p-4">
          <h3 className="text-gray-800 font-semibold mb-2 text-center">
            Top Haircut Distribution
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={(props: PieLabelRenderProps) => {
                  const { name, percent } = props as PieLabelRenderProps & { percent: number };
                  return `${name} (${(percent * 100).toFixed(0)}%)`;
                }}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(0)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="z-10 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Recent Orders</h3>
        {loading ? (
          <p className="text-gray-400 italic">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-400 italic">No orders yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="bg-surface rounded-2xl shadow p-3 flex flex-col items-center">
                <img
                  src={o.image_url || '/placeholder.png'}
                  alt={o.customer_name}
                  className="w-20 h-20 rounded-xl object-cover mb-2"
                />
                <p className="font-semibold text-gray-800">{o.customer_name}</p>
                <p className="text-gray-500 capitalize">{o.topName} - {o.sideName}</p>
                <p className="text-gray-700 mt-1">${o.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
