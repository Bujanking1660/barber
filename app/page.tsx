// 'use client';

// import { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
// } from 'recharts';
// import { format } from 'date-fns';
// import { id } from 'date-fns/locale';
// import { motion } from 'framer-motion';

// export default function DashboardPage() {
//   const [topData, setTopData] = useState<any[]>([]);
//   const [sideData, setSideData] = useState<any[]>([]);
//   const [recentOrders, setRecentOrders] = useState<any[]>([]);
//   const [recentModels, setRecentModels] = useState<any[]>([]);
//   const [totalOrders, setTotalOrders] = useState<number>(0);

//   const today = format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id });

//   useEffect(() => {
//     const fetchData = async () => {
//       const { data: models } = await supabase.from('model').select('id, name, position');
//       const { data: orders } = await supabase.from('order').select('id, top, side');

//       if (!models || !orders) return;

//       const topCounts = models
//         .filter((m) => m.position === 'top')
//         .map((m) => ({
//           name: m.name,
//           count: orders.filter((o) => o.top === m.id).length,
//         }));

//       const sideCounts = models
//         .filter((m) => m.position === 'side')
//         .map((m) => ({
//           name: m.name,
//           count: orders.filter((o) => o.side === m.id).length,
//         }));

//       setTopData(topCounts);
//       setSideData(sideCounts);
//       setTotalOrders(orders.length);
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     const fetchRecents = async () => {
//       const { data: orders } = await supabase
//         .from('order')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(5);

//       const { data: models } = await supabase
//         .from('model')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(5);

//       setRecentOrders(orders || []);
//       setRecentModels(models || []);
//     };

//     fetchRecents();
//   }, []);

//   return (
//     <div className="p-8 space-y-10 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//         <p className="text-gray-500">{today}</p>
//       </div>

//       {/* Scrollable Summary Cards */}
//       <motion.div
//         className="flex space-x-5 overflow-x-auto pb-3 no-scrollbar"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.4 }}
//       >
//         {[
//           { title: 'Total Model', value: topData.length + sideData.length },
//           { title: 'Total Order', value: totalOrders },
//           { title: 'Potongan Atas', value: topData.length },
//           { title: 'Potongan Samping', value: sideData.length },
//         ].map((item, i) => (
//           <motion.div
//             key={i}
//             whileHover={{ y: -4 }}
//             className="min-w-[220px] bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-center"
//           >
//             <h2 className="text-sm text-gray-500">{item.title}</h2>
//             <p className="text-3xl font-semibold text-gray-900 mt-1">{item.value}</p>
//           </motion.div>
//         ))}
//       </motion.div>

//       {/* Grafik */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Grafik Potongan Atas */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white p-6 rounded-2xl shadow-sm"
//         >
//           <h2 className="text-lg font-semibold text-gray-800 mb-4 flex justify-between">
//             <span>Grafik Potongan Atas</span>
//             <span className="text-sm text-gray-400 font-normal">Jumlah Order</span>
//           </h2>

//           <ResponsiveContainer width="100%" height={320}>
//             <BarChart data={topData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
//               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
//               <XAxis
//                 dataKey="name"
//                 tick={{ fill: '#6b7280', fontSize: 12 }}
//                 interval={0}
//                 angle={-15}
//                 height={60}
//               />
//               <YAxis
//                 tickFormatter={(v) => `${Math.round(Number(v))}`}
//                 tick={{ fill: '#6b7280', fontSize: 12 }}
//                 allowDecimals={false}
//               />
//               <Tooltip
//                 formatter={(v) => `${Math.round(Number(v))} Order`}
//                 labelStyle={{ color: '#374151', fontWeight: 600 }}
//               />
//               <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
//             </BarChart>
//           </ResponsiveContainer>
//         </motion.div>

//         {/* Grafik Potongan Samping */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="bg-white p-6 rounded-2xl shadow-sm"
//         >
//           <h2 className="text-lg font-semibold text-gray-800 mb-4 flex justify-between">
//             <span>Grafik Potongan Samping</span>
//             <span className="text-sm text-gray-400 font-normal">Jumlah Order</span>
//           </h2>

//           <ResponsiveContainer width="100%" height={320}>
//             <BarChart data={sideData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
//               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
//               <XAxis
//                 dataKey="name"
//                 tick={{ fill: '#6b7280', fontSize: 12 }}
//                 interval={0}
//                 angle={-15}
//                 height={60}
//               />
//               <YAxis
//                 tickFormatter={(v) => `${Math.round(Number(v))}`}
//                 tick={{ fill: '#6b7280', fontSize: 12 }}
//                 allowDecimals={false}
//               />
//               <Tooltip
//                 formatter={(v) => `${Math.round(Number(v))} Order`}
//                 labelStyle={{ color: '#374151', fontWeight: 600 }}
//               />
//               <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
//             </BarChart>
//           </ResponsiveContainer>
//         </motion.div>
//       </div>

//       {/* Recent Data */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Recent Orders */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.4 }}
//           className="bg-white p-6 rounded-2xl shadow-sm"
//         >
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
//           <ul className="divide-y divide-gray-100">
//             {recentOrders.map((order) => (
//               <li key={order.id} className="py-3 flex justify-between items-center">
//                 <div>
//                   <p className="font-medium text-gray-800">{order.customer_name}</p>
//                   <p className="text-gray-500 text-xs">
//                     {format(new Date(order.created_at), 'dd MMM yyyy HH:mm', { locale: id })}
//                   </p>
//                 </div>
//                 <span className="text-gray-700 font-semibold">
//                   Rp{Number(order.price || 0).toLocaleString('id-ID')}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </motion.div>

//         {/* Recent Models */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.45 }}
//           className="bg-white p-6 rounded-2xl shadow-sm"
//         >
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Models</h2>
//           <ul className="divide-y divide-gray-100">
//             {recentModels.map((model) => (
//               <li key={model.id} className="py-3">
//                 <p className="font-medium text-gray-800">{model.name}</p>
//                 <p className="text-gray-500 text-xs">
//                   {format(new Date(model.created_at), 'dd MMM yyyy HH:mm', { locale: id })}
//                 </p>
//               </li>
//             ))}
//           </ul>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [topData, setTopData] = useState<any[]>([]);
  const [sideData, setSideData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentModels, setRecentModels] = useState<any[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);

  const today = format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id });

  useEffect(() => {
    const fetchData = async () => {
      const { data: models } = await supabase.from('model').select('id, name, position');
      const { data: orders } = await supabase.from('order').select('id, top, side');

      if (!models || !orders) return;

      const topCounts = models
        .filter((m) => m.position === 'top')
        .map((m) => ({
          name: m.name,
          count: orders.filter((o) => o.top === m.id).length,
        }));

      const sideCounts = models
        .filter((m) => m.position === 'side')
        .map((m) => ({
          name: m.name,
          count: orders.filter((o) => o.side === m.id).length,
        }));

      setTopData(topCounts);
      setSideData(sideCounts);
      setTotalOrders(orders.length);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchRecents = async () => {
      const { data: orders } = await supabase
        .from('order')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: models } = await supabase
        .from('model')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentOrders(orders || []);
      setRecentModels(models || []);
    };

    fetchRecents();
  }, []);

  return (
    <div className="min-h-screen px-5 py-8 space-y-10 bg-linear-to-br from-bg via-white to-gray-100">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-accent">
          Dashboard
        </h1>
        <p className="text-gray-500">{today}</p>
      </div>

      {/* Scrollable Stats Card */}
      <motion.div
        className="flex space-x-4 overflow-x-auto pb-3 no-scrollbar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {[
          { title: 'Total Model', value: topData.length + sideData.length },
          { title: 'Total Order', value: totalOrders },
          { title: 'Potongan Atas', value: topData.length },
          { title: 'Potongan Samping', value: sideData.length },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(212,175,55,0.25)' }}
            transition={{ duration: 0.2 }}
            className="relative min-w-[220px] bg-white border border-gray-100 rounded-2xl shadow-sm p-5 overflow-hidden"
          >
            {/* Gradient bar accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary to-[#facc15]" />
            <div className="relative">
              <h2 className="text-sm text-gray-500">{item.title}</h2>
              <p className="text-3xl font-semibold text-gray-900 mt-1">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Grafik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Potongan Atas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Grafik Potongan Atas
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topData}>
              <defs>
                <linearGradient id="barBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#6b7280' }}
                interval={0}
                angle={-15}
                height={60}
              />
              <YAxis
                tickFormatter={(v: number) => Math.round(v).toString()}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip
                formatter={(v: number) => Math.round(v).toString()}
                contentStyle={{ borderRadius: '8px' }}
              />
              <Bar dataKey="count" fill="url(#barBlue)" radius={[6, 6, 0, 0]} barSize={35} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Potongan Samping */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Grafik Potongan Samping
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sideData}>
              <defs>
                <linearGradient id="barGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#6b7280' }}
                interval={0}
                angle={-15}
                height={60}
              />
              <YAxis
                tickFormatter={(v: number) => Math.round(v).toString()}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip
                formatter={(v: number) => Math.round(v).toString()}
                contentStyle={{ borderRadius: '8px' }}
              />
              <Bar dataKey="count" fill="url(#barGreen)" radius={[6, 6, 0, 0]} barSize={35} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
          <ul className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <li key={order.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{order.customer_name}</p>
                  <p className="text-gray-500 text-xs">
                    {format(new Date(order.created_at), 'dd MMM yyyy HH:mm', { locale: id })}
                  </p>
                </div>
                <span className="text-gray-700 font-semibold">
                  Rp{Number(order.price || 0).toLocaleString('id-ID')}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Models */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Models</h2>
          <ul className="divide-y divide-gray-100">
            {recentModels.map((model) => (
              <li key={model.id} className="py-3">
                <p className="font-medium text-gray-800">{model.name}</p>
                <p className="text-gray-500 text-xs">
                  {format(new Date(model.created_at), 'dd MMM yyyy HH:mm', { locale: id })}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
