'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AddModelForm({ onSuccess }: any) {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('top');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image) {
      alert('Nama dan gambar wajib diisi!');
      return;
    }

    try {
      setLoading(true);

      // Upload ke storage
      const filePath = `model/${position}/${Date.now()}-${image.name}`;
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, image);
      if (uploadError) throw uploadError;

      // Ambil URL publik
      const { data: publicUrl } = supabase
        .storage
        .from('gallery')
        .getPublicUrl(filePath);

      // Simpan ke tabel model
      const { error: insertError } = await supabase.from('model').insert([
        { name, position, image_url: publicUrl.publicUrl },
      ]);
      if (insertError) throw insertError;

      alert('Model berhasil ditambahkan ✅');
      setName('');
      setImage(null);
    } catch (err: any) {
      console.error(err);
      alert(`Gagal menambahkan model: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Haircut name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border-b border-foreground/40 bg-transparent p-2 outline-none"
          placeholder="Taper Fade"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Type of haircut</label>
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full border-b border-foreground/40 bg-transparent p-2 outline-none"
        >
          <option value="top">Top</option>
          <option value="side">Side</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Upload image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full border-b border-foreground/40 p-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground py-2 rounded-xl mt-3"
      >
        {loading ? 'Saving...' : 'Add'}
      </button>
    </form>
  );
}
