import { useEffect } from "react";
import "./image-lightbox.css";

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="image-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="图片预览"
      onClick={onClose}
    >
      <button
        type="button"
        className="image-lightbox__close"
        aria-label="关闭"
        onClick={onClose}
      >
        ×
      </button>
      <img
        className="image-lightbox__img"
        src={src}
        alt={alt}
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}
