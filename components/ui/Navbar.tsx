'use client';

import { Home, Scissors, Folders, Scroll, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
  const [active, setActive] = useState('Home');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Gallery', icon: Folders, path: '/gallery' },
    { name: 'Order', icon: Scroll, path: '/orders' },
    { name: 'Model', icon: Scissors, path: '/models' },
  ];

  return (
    <>
      {/* Hamburger button di pojok kanan atas */}
      <div className="fixed top-5 right-5 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-surface p-3 rounded-full shadow-lg border border-border hover:bg-gray-100 transition"
        >
          {isOpen ? <X size={24} className="text-gray-600" /> : <Menu size={24} className="text-gray-600" />}
        </button>
      </div>

      {/* Animated Menu Panel muncul di bawah tengah layar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-3 bg-surface p-6 rounded-2xl shadow-lg border border-border min-w-[200px]"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActive(item.name);
                    router.push(item.path);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 transition w-full justify-start"
                >
                  <Icon
                    className={`transition-all duration-300 ${
                      isActive ? 'text-primary scale-110' : 'text-gray-400'
                    }`}
                    size={20}
                  />
                  <span className={`font-medium ${isActive ? 'text-primary' : 'text-gray-700'}`}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
