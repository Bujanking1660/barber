"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, X, Folder, Layers, Scissors, Image } from "lucide-react";

export default function GalleryClient({
  hasOrder,
  hasModel,
}: {
  hasOrder: boolean | null;
  hasModel: boolean | null;
}) {
  const [level, setLevel] = useState<"root" | "order" | "model" | "top" | "side">("root");
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tappedFolder, setTappedFolder] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // for popup

  const fetchImages = async () => {
    setLoading(true);
    setImages([]);
    try {
      if (level === "order") {
        const { data } = await supabase.from("order").select("id, customer_name, image_url");
        if (data) setImages(data);
      } else if (level === "top" || level === "side") {
        const { data } = await supabase
          .from("model")
          .select("id, name, image_url")
          .eq("position", level);
        if (data) setImages(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (level !== "root" && level !== "model") fetchImages();
  }, [level]);

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
        {/* Glow background effect */}
        <div className="absolute inset-0 bg-linear-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Folder content */}
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
      {/* Header */}
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

      {/* Folder Grid (Root Level) */}
      {level === "root" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10">
          {hasOrder && renderFolder("Order", <Folder className="w-7 h-7" />)}
          {hasModel && renderFolder("Model", <Layers className="w-7 h-7" />)}
        </div>
      )}

      {/* Subfolder for Model */}
      {level === "model" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10">
          {renderFolder("Top", <Scissors className="w-7 h-7" />)}
          {renderFolder("Side", <Image className="w-7 h-7" />)}
        </div>
      )}

      {/* Image Grid */}
      {(level === "order" || level === "top" || level === "side") && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {loading ? (
            <p className="col-span-full text-center text-muted animate-pulse">Loading...</p>
          ) : images.length > 0 ? (
            images.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img.image_url)} // open popup
                className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm active:scale-95 transition hover:shadow-md cursor-pointer"
              >
                <img
                  src={img.image_url}
                  alt={img.customer_name || img.name}
                  className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                />
                <p className="text-center text-sm sm:text-base font-medium text-accent p-2 truncate">
                  {img.customer_name || img.name}
                </p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-muted">No images found</p>
          )}
        </div>
      )}

      {/* Popup Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
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
