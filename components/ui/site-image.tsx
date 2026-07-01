"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useState } from "react";

import { resolveImageSrc, siblingSvgFallback, siteFallback, type SiteImageKind } from "@/lib/site-images";
import { cn } from "@/lib/utils";

type SiteImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  fallbackKind?: SiteImageKind;
  className?: string;
};

export function SiteImage({
  src,
  alt,
  fallbackKind = "work",
  className,
  onError,
  ...props
}: SiteImageProps) {
  const primary = resolveImageSrc(src, fallbackKind);
  const [current, setCurrent] = useState(primary);

  const handleError = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      onError?.(event);
      setCurrent((prev) => {
        if (prev === siteFallback(fallbackKind)) return prev;
        if (prev.endsWith(".svg")) return siteFallback(fallbackKind);
        const svgSibling = siblingSvgFallback(prev);
        if (svgSibling !== prev) return svgSibling;
        return siteFallback(fallbackKind);
      });
    },
    [fallbackKind, onError],
  );

  if (current.endsWith(".svg")) {
    const { fill, width, height, sizes, priority, ...rest } = props;
    void fill;
    void sizes;
    void priority;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...rest}
        src={current}
        alt={alt}
        width={typeof width === "number" ? width : undefined}
        height={typeof height === "number" ? height : undefined}
        className={cn(fill && "absolute inset-0 h-full w-full object-cover", className)}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      {...props}
      src={current}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
