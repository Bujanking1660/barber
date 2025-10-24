// 'use client';

// import AddOrderForm from "../forms/AddOrderForm";

// export default function AddOrderSheet({
//   isOpen,
//   onClose,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
// }) {
//   return (
//     <div
//       className={`fixed inset-0 z-50 transition-transform duration-300 ${
//         isOpen ? 'translate-y-0' : 'translate-y-full'
//       }`}
//     >
//       {/* Background blur */}
//       <div
//         className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* Sheet container */}
//       <div className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-3xl p-6 shadow-xl border border-border">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold text-accent">Add Order</h2>
//           <button
//             onClick={onClose}
//             className="text-muted hover:text-accent transition"
//           >
//             ✕
//           </button>
//         </div>

//         <AddOrderForm onSuccess={onClose} />
//       </div>
//     </div>
//   );
// }
"use client";

import { motion, useDragControls } from "framer-motion";
import AddOrderForm from "../forms/AddOrderForm";

export default function AddModelSheet({ isOpen, onClose }: any) {
  const controls = useDragControls();

  return (
    <motion.div
      className={`fixed inset-x-0 bottom-0 z-60 mx-auto max-w-md bg-surface rounded-t-3xl shadow-lg ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      drag="y"
      dragControls={controls}
      dragConstraints={{ top: 0, bottom: 150 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 100) onClose();
      }}
      initial={{ y: "100%" }}
      animate={{ y: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* indikator drag */}
      <div
        className="w-10 h-1 bg-muted rounded-full mx-auto mt-3 cursor-pointer"
        onPointerDown={(e) => controls.start(e)}
      />

      {/* header */}
      <div className="flex justify-between items-center px-6 pt-4 pb-2">
        <h2 className="text-lg font-semibold">Add Order</h2>
        <button onClick={onClose} className="text-muted text-xl">
          ✕
        </button>
      </div>

      {/* form (isi utama) */}
      <div className="px-6 pb-8">
        <AddOrderForm onSuccess={onClose} />
      </div>
    </motion.div>
  );
}
