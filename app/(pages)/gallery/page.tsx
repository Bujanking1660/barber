// "use client";

// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import { ArrowLeft } from "lucide-react";

// export default function GalleryPage() {
//   const [level, setLevel] = useState<"root" | "order" | "model" | "top" | "side">("root");
//   const [images, setImages] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [tappedFolder, setTappedFolder] = useState<string | null>(null);

//   const fetchImages = async () => {
//     setLoading(true);
//     setImages([]);

//     try {
//       if (level === "order") {
//         const { data, error } = await supabase
//           .from("order")
//           .select("id, customer_name, image_url");
//         if (!error && data) setImages(data);
//       } else if (level === "top" || level === "side") {
//         const { data, error } = await supabase
//           .from("model")
//           .select("id, name, image_url")
//           .eq("position", level);
//         if (!error && data) setImages(data);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (level !== "root" && level !== "model") fetchImages();
//   }, [level]);

//   const handleOpen = (folder: string) => {
//     setTappedFolder(folder);
//     setTimeout(() => setTappedFolder(null), 200); // reset tap animation

//     if (folder === "Order") setLevel("order");
//     else if (folder === "Model") setLevel("model");
//     else if (folder === "Top") setLevel("top");
//     else if (folder === "Side") setLevel("side");
//   };

//   const handleBack = () => {
//     if (level === "order" || level === "model") setLevel("root");
//     else if (level === "top" || level === "side") setLevel("model");
//   };

//   const renderFolder = (name: string) => {
//     const isTapped = tappedFolder === name;

//     return (
//       <div
//         key={name}
//         onClick={() => handleOpen(name)}
//         className={`flex flex-col items-center justify-center p-5 rounded-xl border border-border bg-surface text-accent shadow-sm cursor-pointer transition-all active:scale-95 ${
//           isTapped ? "border-primary text-primary shadow-md" : "active:border-primary"
//         }`}
//       >
//         <span className="font-semibold tracking-wide text-base sm:text-lg">{name}</span>
//       </div>
//     );
//   };

//   return (
//     <section className="p-4 pb-16 min-h-screen">
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-6 sticky top-0 z-10 pb-3">
        
//         {level !== "root" && (
//           <button
//             onClick={handleBack}
//             className="p-2 rounded-full bg-surface border border-border hover:bg-border/30 active:scale-95 transition"
//           >
//             <ArrowLeft className="w-5 h-5 text-accent" />
//           </button>
//         )}
//         <div>
//           <h1 className="text-2xl font-semibold text-accent">
//             Gallery
//           </h1>

//           <p className="text-muted text-sm">
//             {level === "root"
//               ? "Picture of art"
//               : level === "order"
//               ? "Customer orders"
//               : level === "model"
//               ? "Haircut models"
//               : level === "top"
//               ? "Top haircut photos"
//               : "Side haircut photos"}
//           </p>
//         </div>
//       </div>

//       {/* Folder Grid */}
//       {level === "root" && (
//         <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-10">
//           {renderFolder("Order")}
//           {renderFolder("Model")}
//         </div>
//       )}

//       {/* Subfolder untuk Model */}
//       {level === "model" && (
//         <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-10">
//           {renderFolder("Top")}
//           {renderFolder("Side")}
//         </div>
//       )}

//       {/* Image Grid */}
//       {(level === "order" || level === "top" || level === "side") && (
//         <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//           {loading ? (
//             <p className="col-span-full text-center text-muted">Loading...</p>
//           ) : images.length > 0 ? (
//             images.map((img) => (
//               <div
//                 key={img.id}
//                 className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm active:scale-95 transition"
//               >
//                 <img
//                   src={img.image_url}
//                   alt={img.customer_name || img.name}
//                   className="w-full h-40 object-cover"
//                 />
//                 <p className="text-center text-sm sm:text-base font-medium text-accent p-2 truncate">
//                   {img.customer_name || img.name}
//                 </p>
//               </div>
//             ))
//           ) : (
//             <p className="col-span-full text-center text-muted">No images found</p>
//           )}
//         </div>
//       )}
//     </section>
//   );
// }
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
    <section className="p-4 pb-16 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-accent">Gallery</h1>
        <p className="text-muted text-sm">Picture of art</p>
      </div>

      {/* Komponen client untuk navigasi dan fetching interaktif */}
      <GalleryClient hasOrder={hasOrder} hasModel={hasModel} />
    </section>
  );
}
