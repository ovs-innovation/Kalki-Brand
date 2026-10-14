import { useState, useEffect } from "react";

const productImages = {
  "paracetamol-500mg": "/images/img1.jpeg",
  "Combiflame": "/images/img2.jpeg",
  "Cardicheck": "/images/img3.jpeg",
  "tafamidis": "/images/img4.webp",
};

// Global cache for transparent processed image data URLs
const processedImageCache = new Map();

function removeImageWhiteBg(src) {
  if (typeof window === "undefined" || !src || typeof src !== "string") {
    return Promise.resolve(src);
  }
  // Skip videos and youtube
  if (
    src.includes(".mp4") ||
    src.includes(".mov") ||
    src.includes(".webm") ||
    src.includes("youtube.com") ||
    src.includes("youtu.be")
  ) {
    return Promise.resolve(src);
  }
  if (processedImageCache.has(src)) {
    return Promise.resolve(processedImageCache.get(src));
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        if (!width || !height) return resolve(src);

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return resolve(src);

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        const isNearWhite = (idx) => {
          const p = idx * 4;
          return data[p] >= 235 && data[p + 1] >= 235 && data[p + 2] >= 235;
        };

        const visited = new Uint8Array(width * height);
        const queue = [];

        for (let x = 0; x < width; x++) {
          if (isNearWhite(x)) queue.push(x);
          const bottomIdx = (height - 1) * width + x;
          if (isNearWhite(bottomIdx)) queue.push(bottomIdx);
        }
        for (let y = 0; y < height; y++) {
          const leftIdx = y * width;
          if (isNearWhite(leftIdx)) queue.push(leftIdx);
          const rightIdx = y * width + (width - 1);
          if (isNearWhite(rightIdx)) queue.push(rightIdx);
        }

        if (queue.length === 0) {
          processedImageCache.set(src, src);
          return resolve(src);
        }

        let head = 0;
        while (head < queue.length) {
          const idx = queue[head++];
          if (visited[idx]) continue;
          visited[idx] = 1;

          if (!isNearWhite(idx)) continue;

          data[idx * 4 + 3] = 0;

          const x = idx % width;
          const y = Math.floor(idx / width);

          if (x > 0 && !visited[idx - 1] && isNearWhite(idx - 1)) queue.push(idx - 1);
          if (x < width - 1 && !visited[idx + 1] && isNearWhite(idx + 1)) queue.push(idx + 1);
          if (y > 0 && !visited[idx - width] && isNearWhite(idx - width)) queue.push(idx - width);
          if (y < height - 1 && !visited[idx + width] && isNearWhite(idx + width)) queue.push(idx + width);
        }

        ctx.putImageData(imgData, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");
        processedImageCache.set(src, dataUrl);
        resolve(dataUrl);
      } catch (err) {
        console.warn("Image background processing skipped:", err);
        resolve(src);
      }
    };

    img.onerror = () => {
      resolve(src);
    };
  });
}

const ProductImageGallery = ({
  product,
  images,
  productTitle = "Product",
  buttons,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [processedUrls, setProcessedUrls] = useState({});

  // Only treat direct video files as video; YouTube URLs will be shown as images (thumbnail)
  const isVideoUrl = (url = "") => {
    if (!url || typeof url !== "string") return false;
    const lowered = url.toLowerCase();
    return (
      lowered.includes(".mp4") ||
      lowered.includes(".mov") ||
      lowered.includes(".webm")
    );
  };

  const isYoutubeUrl = (url = "") => {
    if (!url || typeof url !== "string") return false;
    const lowered = url.toLowerCase();
    return lowered.includes("youtube.com/") || lowered.includes("youtu.be/");
  };

  const getYoutubeThumbnail = (url = "") => {
    if (!isYoutubeUrl(url)) return null;
    const ytMatch =
      url.match(/[?&]v=([^&#]+)/i) ||
      url.match(/youtu\.be\/([^&#?/]+)/i) ||
      url.match(/\/embed\/([^&#?/]+)/i);
    const videoId = ytMatch?.[1];
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const getYoutubeEmbedUrl = (url = "") => {
    if (!isYoutubeUrl(url)) return null;
    const ytMatch =
      url.match(/[?&]v=([^&#]+)/i) ||
      url.match(/youtu\.be\/([^&#?/]+)/i) ||
      url.match(/\/embed\/([^&#?/]+)/i);
    const videoId = ytMatch?.[1];
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  };

  // Filter valid media (images + videos)
  const validMedia = Array.isArray(images)
    ? images.filter((url) => url && typeof url === "string" && url.trim() !== "")
    : [];

  const displayImages = validMedia.length > 0
    ? validMedia
    : ["/placeholder.png"];

  const activeImage = displayImages[activeIndex] || displayImages[0];
  const placeholder = "/placeholder.png";
  const rawImageSrc =
    activeImage || product?.image?.[0] || productImages[product?.slug] || "/images/default.webp";

  // Process images to remove white backgrounds in client
  useEffect(() => {
    let isMounted = true;
    displayImages.forEach((img) => {
      if (!isVideoUrl(img) && !isYoutubeUrl(img)) {
        removeImageWhiteBg(img).then((transparentUrl) => {
          if (isMounted && transparentUrl) {
            setProcessedUrls((prev) => ({ ...prev, [img]: transparentUrl }));
          }
        });
      }
    });
    if (rawImageSrc && !isVideoUrl(rawImageSrc) && !isYoutubeUrl(rawImageSrc)) {
      removeImageWhiteBg(rawImageSrc).then((transparentUrl) => {
        if (isMounted && transparentUrl) {
          setProcessedUrls((prev) => ({ ...prev, [rawImageSrc]: transparentUrl }));
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [displayImages, rawImageSrc]);

  const imageSrc = processedUrls[rawImageSrc] || rawImageSrc;

  // Reset active index when images change
  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const handleThumbnailClick = (index) => {
    if (index >= 0 && index < displayImages.length) {
      setActiveIndex(index);
    }
  };

  const handleImageError = (e) => {
    if (e.target.src !== placeholder) {
      e.target.src = placeholder;
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:items-start bg-transparent rounded-2xl">
      {/* Vertical Thumbnail Gallery - Left Side */}
      {displayImages.length > 1 && (
        <div className="flex lg:flex-col flex-row gap-3 order-2 lg:order-1 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto max-h-[560px] pb-2 lg:pb-0 scrollbar-thin">
          {displayImages.map((mediaUrl, index) => (
            <button
              key={`thumb-${index}-${mediaUrl}`}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 relative w-16 h-16 lg:w-20 lg:h-20 rounded-xl border-2 overflow-hidden transition-all duration-300 transform bg-transparent ${index === activeIndex
                ? "border-blue-500 ring-2 ring-blue-500/30 shadow-md scale-105"
                : "border-white/10 hover:border-blue-500/50 hover:shadow-sm"
                }`}
              type="button"
            >
              {isVideoUrl(mediaUrl) ? (
                <video
                  src={mediaUrl}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
              ) : (
                <>
                  <img
                    src={
                      isYoutubeUrl(mediaUrl)
                        ? getYoutubeThumbnail(mediaUrl) || placeholder
                        : processedUrls[mediaUrl] || mediaUrl || placeholder
                    }
                    alt={`${productTitle} - View ${index + 1}`}
                    className="w-full h-full object-contain p-1"
                    onError={handleImageError}
                    loading="lazy"
                  />
                  {isYoutubeUrl(mediaUrl) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                      <span className="w-6 h-6 bg-black/80 text-white rounded-full flex items-center justify-center shadow">
                        <span className="ml-0.5 border-l-8 border-y-4 border-l-red-500 border-y-transparent" />
                      </span>
                    </div>
                  )}
                </>
              )}
              {index === activeIndex && (
                <div className="absolute inset-0 border-2 border-blue-500" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main Preview Image / Video - Right Side */}
      <div className="flex-1 order-1 lg:order-2 w-full">
        <div className="relative w-full aspect-square bg-transparent overflow-hidden transition-all duration-300">
          {/* Buttons overlay */}
          {buttons}

          {activeImage ? (
            isVideoUrl(activeImage) ? (
              <video
                key={`main-video-${activeIndex}-${activeImage}`}
                src={activeImage}
                className="w-full h-full object-contain"
                controls
              />
            ) : isYoutubeUrl(activeImage) ? (
              <iframe
                key={`main-yt-${activeIndex}-${activeImage}`}
                src={getYoutubeEmbedUrl(activeImage) || ""}
                title={productTitle}
                className="w-full min-h-[400px] object-contain"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <img
                key={`main-img-${activeIndex}-${activeImage}`}
                src={imageSrc}
                alt={productTitle}
                onError={handleImageError}
                loading="eager"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="w-full h-full max-h-[400px] object-contain p-4 transition-all duration-300 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
                style={{
                  transform: isZooming ? "scale(2)" : "scale(1)",
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  cursor: "zoom-in",
                  transition: "transform 0.1s ease-out"
                }}
              />
            )
          ) : (
            <img
              src={imageSrc}
              alt="Product placeholder"
              className="w-full h-full object-contain p-4"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;

