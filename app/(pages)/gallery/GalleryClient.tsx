"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowLeft,
  X,
  Folder,
  Layers,
  Scissors,
  Image,
  Search,
} from "lucide-react";

export default function GalleryClient({
  hasOrder,
  hasModel,
}: {
  hasOrder: boolean | null;
  hasModel: boolean | null;
}) {
  const [level, setLevel] = useState<
    "root" | "order" | "model" | "top" | "side"
  >("root");
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tappedFolder, setTappedFolder] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔧 Fetch images based on level and search
  const fetchImages = async () => {
    setLoading(true);
    setImages([]);
    try {
      if (level === "order") {
        const { data, error } = await supabase
          .from("order")
          .select(
            `
            id,
            image_url,
            created_at,
            top_model:model!order_top_fkey(name, position),
            side_model:model!order_side_fkey(name, position)
          `
          )
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching orders:", error.message);
          return;
        }

        // 🔍 Pencarian manual berdasarkan nama top/side
        let filtered = data || [];
        if (searchTerm.trim() !== "") {
          const lower = searchTerm.toLowerCase();
          filtered = filtered.filter((item: any) => {
            const topName =
              Array.isArray(item.top_model) && item.top_model.length > 0
                ? item.top_model[0].name
                : item.top_model?.name;
            const sideName =
              Array.isArray(item.side_model) && item.side_model.length > 0
                ? item.side_model[0].name
                : item.side_model?.name;

            return (
              topName?.toLowerCase().includes(lower) ||
              sideName?.toLowerCase().includes(lower)
            );
          });
        }

        setImages(filtered);
      } else if (level === "top" || level === "side") {
        const { data, error } = await supabase
          .from("model")
          .select("id, name, image_url, position, created_at")
          .eq("position", level)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching models:", error.message);
          return;
        }

        setImages(data || []);
      }
    } catch (err) {
      console.error("Unexpected error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Fetch when level changes
  useEffect(() => {
    if (level !== "root" && level !== "model") fetchImages();
  }, [level]);

  // 🔍 Re-fetch when search changes (for orders)
  useEffect(() => {
    if (level === "order") fetchImages();
  }, [searchTerm]);

  const handleOpen = (folder: string) => {
    setTappedFolder(folder);
    setTimeout(() => setTappedFolder(null), 200);
    if (folder === "Order") setLevel("order");
    else if (folder === "Model") setLevel("model");
    else if (folder === "Top") setLevel("top");
    else if (folder === "Side") setLevel("side");
  };

  const handleBack = () => {
    if (level === "order" || level === "model") setLevel("root");
    else if (level === "top" || level === "side") setLevel("model");
  };

  const renderFolder = (name: string, icon: React.ReactNode) => {
    const isTapped = tappedFolder === name;
    return (
      <div
        key={name}
        onClick={() => handleOpen(name)}
        className={`group relative overflow-hidden flex flex-col items-center justify-center rounded-2xl border border-border bg-linear-to-b from-surface to-bg shadow-sm cursor-pointer transition-all duration-300 p-6 hover:shadow-lg hover:-translate-y-1 active:scale-95 ${
          isTapped
            ? "border-primary text-primary shadow-md scale-95"
            : "hover:border-primary/40"
        }`}
      >
        <div className="absolute inset-0 bg-linear-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative flex flex-col items-center gap-3">
          <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary/20 transition-all duration-300">
            {icon}
          </div>
          <span className="font-semibold tracking-wide text-accent text-base sm:text-lg group-hover:text-primary transition-colors duration-300">
            {name}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* 🧭 Header */}
      <div className="flex items-center gap-3 mb-6 sticky top-0 z-10 pb-3 bg-bg/80 backdrop-blur-sm">
        {level !== "root" && (
          <button
            onClick={handleBack}
            className="p-2 rounded-full bg-surface border border-border hover:bg-border/30 active:scale-95 transition"
          >
            <ArrowLeft className="w-5 h-5 text-accent" />
          </button>
        )}
        <div>
          <h1 className="text-3xl font-bold text-accent">
            {level === "root"
              ? "Gallery"
              : level === "order"
              ? "Orders"
              : level === "model"
              ? "Models"
              : level === "top"
              ? "Top Haircuts"
              : "Side Haircuts"}
          </h1>
          <p className="text-muted text-sm">Picture of art</p>
        </div>
      </div>

      {/* 📂 Root Folder */}
      {level === "root" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10">
          {hasOrder && renderFolder("Order", <Folder className="w-7 h-7" />)}
          {hasModel && renderFolder("Model", <Layers className="w-7 h-7" />)}
        </div>
      )}

      {/* 📂 Subfolder Model */}
      {level === "model" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10">
          {renderFolder("Top", <Scissors className="w-7 h-7" />)}
          {renderFolder("Side", <Image className="w-7 h-7" />)}
        </div>
      )}

      {/* 🔍 Search bar (Order only) */}
      {level === "order" && (
        <div className="relative mb-6 w-full sm:w-1/2 mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
          <input
            type="text"
            placeholder="Cari potongan atas atau samping..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded-xl bg-surface border border-border text-accent placeholder:text-muted focus:ring-2 focus:ring-primary/40 focus:border-primary/40 outline-none transition-all duration-300"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* 🖼️ Image Grid */}
      {(level === "order" || level === "top" || level === "side") && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {loading ? (
            <p className="col-span-full text-center text-muted animate-pulse">
              Loading...
            </p>
          ) : images.length > 0 ? (
            images.map((img: any) => {
              const topName =
                Array.isArray(img.top_model) && img.top_model.length > 0
                  ? img.top_model[0].name
                  : img.top_model?.name;
              const sideName =
                Array.isArray(img.side_model) && img.side_model.length > 0
                  ? img.side_model[0].name
                  : img.side_model?.name;

              return (
                <div
                  key={img.id}
                  onClick={() => setSelectedImage(img.image_url)}
                  className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm active:scale-95 transition hover:shadow-md cursor-pointer"
                >
                  <img
                    src={img.image_url}
                    alt={
                      level === "order"
                        ? `${topName || "Unknown Top"} - ${
                            sideName || "Unknown Side"
                          }`
                        : img.name || "Model Image"
                    }
                    className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <p className="text-center text-sm sm:text-base font-medium text-accent p-2 truncate">
                    {level === "order"
                      ? `${topName || "Unknown Top"} - ${
                          sideName || "Unknown Side"
                        }`
                      : img.name || "Unnamed Model"}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="col-span-full text-center text-muted">
              No images found
            </p>
          )}
        </div>
      )}

      {/* 🪟 Image Popup */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-3xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-black/70 transition"
            >
              <X className="text-white w-5 h-5" />
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
