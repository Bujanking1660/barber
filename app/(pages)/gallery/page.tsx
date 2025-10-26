"use client";

import { useEffect, useState } from "react";
import GalleryClient from "./GalleryClient";
import Loader from "@/components/ui/Loader";
import { supabase } from "@/lib/supabaseClient";

export default function GalleryPage() {
  const [loading, setLoading] = useState(true);
  const [hasOrder, setHasOrder] = useState<boolean | null>(null);
  const [hasModel, setHasModel] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: orders } = await supabase.from("order").select("id").limit(1);
        const { data: models } = await supabase.from("model").select("id").limit(1);

        setHasOrder(!!orders?.length);
        setHasModel(!!models?.length);
      } finally {
        setTimeout(() => setLoading(false), 1000); // kasih delay dikit biar loader keliatan smooth
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <section className="px-5 py-8 min-h-screen bg-bg">
      <GalleryClient hasOrder={hasOrder} hasModel={hasModel} />
    </section>
  );
}
