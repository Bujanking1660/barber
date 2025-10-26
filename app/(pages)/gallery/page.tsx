export const dynamic = 'force-dynamic';

import GalleryClient from "./GalleryClient";
import { createServerClient } from "@/lib/supabaseServer";

export default async function GalleryPage() {
  const supabase = createServerClient()

  // Ambil data awal di server (misalnya hanya jumlah item di tiap kategori)
  const { data: orders } = await supabase
    .from("order")
    .select("id")
    .limit(1);

  const { data: models } = await supabase
    .from("model")
    .select("id")
    .limit(1);

  const hasOrder = orders && orders.length > 0;
  const hasModel = models && models.length > 0;

  return (
    <section className="px-5 py-8 min-h-screen bg-bg">

      {/* Komponen client untuk navigasi dan fetching interaktif */}
      <GalleryClient hasOrder={hasOrder} hasModel={hasModel} />
    </section>
  );
}
