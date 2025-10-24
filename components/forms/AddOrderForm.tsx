'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AddOrderForm({ onSuccess }: { onSuccess: () => void }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [top, setTop] = useState('');
    const [side, setSide] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [models, setModels] = useState<any[]>([]);

    // Ambil data model untuk dropdown
    const fetchModels = async () => {
        const { data, error } = await supabase.from('model').select('*');
        if (!error && data) setModels(data);
    };

    useEffect(() => {
        fetchModels();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price || !top || !side || !image) {
            alert('Semua field wajib diisi!');
            return;
        }

        try {
            setLoading(true);

            // Upload image ke storage
            const filePath = `order/${Date.now()}-${image.name}`;
            const { error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(filePath, image);
            if (uploadError) throw uploadError;

            // Ambil URL publik
            const { data: publicUrl } = supabase.storage
                .from('gallery')
                .getPublicUrl(filePath);

            // Insert ke tabel order
            const { error: insertError } = await supabase.from('order').insert([
                {
                    customer_name: name,
                    price,
                    top: Number(top),
                    side: Number(side),
                    image_url: publicUrl.publicUrl,
                },
            ]);
            if (insertError) throw insertError;

            alert('Order berhasil ditambahkan ✅');
            setName('');
            setPrice('');
            setTop('');
            setSide('');
            setImage(null);
            onSuccess();
        } catch (err: any) {
            console.error(err);
            alert(`Gagal menambahkan order: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Customer Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-b border-foreground/40 bg-transparent p-2 outline-none"
                    placeholder="Rizkya Gusnaldy"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full border-b border-foreground/40 bg-transparent p-2 outline-none"
                    placeholder="50000"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Top Haircut</label>
                <select
                    value={top}
                    onChange={(e) => setTop(e.target.value)}
                    className="w-full border-b border-foreground/40 bg-transparent p-2 outline-none"
                >
                    <option value="">Select top haircut</option>
                    {models
                        .filter((m) => m.position === 'top')
                        .map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                        ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Side Haircut</label>
                <select
                    value={side}
                    onChange={(e) => setSide(e.target.value)}
                    className="w-full border-b border-foreground/40 bg-transparent p-2 outline-none"
                >
                    <option value="">Select side haircut</option>
                    {models
                        .filter((m) => m.position === 'side')
                        .map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                        ))}
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
                {loading ? 'Saving...' : 'Add Order'}
            </button>
        </form>
    );
}
