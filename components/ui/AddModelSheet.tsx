'use client';

import { motion, useDragControls } from 'framer-motion';
import AddModelForm from '../forms/AddModelForm';

export default function AddModelSheet({ isOpen, onClose }: any) {
  const controls = useDragControls();

  return (
    <motion.div
      className={`fixed inset-x-0 bottom-0 z-60 mx-auto max-w-md bg-surface rounded-t-3xl shadow-lg ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      drag="y"
      dragControls={controls}
      dragConstraints={{ top: 0, bottom: 150 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 100) onClose();
      }}
      initial={{ y: '100%' }}
      animate={{ y: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* indikator drag */}
      <div
        className="w-10 h-1 bg-muted rounded-full mx-auto mt-3 cursor-pointer"
        onPointerDown={(e) => controls.start(e)}
      />

      {/* header */}
      <div className="flex justify-between items-center px-6 pt-4 pb-2">
        <h2 className="text-lg font-semibold">Add Model</h2>
        <button onClick={onClose} className="text-muted text-xl">
          ✕
        </button>
      </div>

      {/* form */}
      <div className="px-6 pb-8">
        <AddModelForm onSuccess={onClose} />
      </div>
    </motion.div>
  );
}
