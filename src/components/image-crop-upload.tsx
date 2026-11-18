"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

type ImageCropUploadProps = {
  name: string;
  label: string;
  aspect?: number;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  hint?: string;
};

export function ImageCropUpload({
  name,
  label,
  aspect = 3,
  defaultWidth = 360,
  minWidth = 120,
  maxWidth = 900,
  hint,
}: ImageCropUploadProps) {
  const hiddenRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const urlRef = useRef("");
  const [natural, setNatural] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [width, setWidth] = useState(defaultWidth);
  const [ready, setReady] = useState(false);

  const height = Math.max(1, Math.round(width / aspect));
  const baseScale =
    natural.width && natural.height ? Math.max(width / natural.width, height / natural.height) : 1;
  const drawWidth = natural.width * baseScale * zoom;
  const drawHeight = natural.height * baseScale * zoom;
  const maxX = Math.max(0, (drawWidth - width) / 2);
  const maxY = Math.max(0, (drawHeight - height) / 2);
  const safeX = Math.max(-maxX, Math.min(maxX, offsetX));
  const safeY = Math.max(-maxY, Math.min(maxY, offsetY));

  function setHiddenFile(file: File) {
    const input = hiddenRef.current;
    if (!input) return;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "files")?.set;
    setter?.call(input, transfer.files);
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const url = URL.createObjectURL(file);
    urlRef.current = url;
    const image = new Image();
    image.onload = () => {
      imageRef.current = image;
      setNatural({ width: image.naturalWidth, height: image.naturalHeight });
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
      setReady(true);
      setHiddenFile(file);
    };
    image.src = url;
  }

  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!ready || !canvas || !image || !natural.width || !natural.height) return;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#0a0a0a";
    context.fillRect(0, 0, width, height);
    const scale = Math.max(width / natural.width, height / natural.height) * zoom;
    const nextWidth = natural.width * scale;
    const nextHeight = natural.height * scale;
    context.drawImage(
      image,
      (width - nextWidth) / 2 + safeX,
      (height - nextHeight) / 2 + safeY,
      nextWidth,
      nextHeight,
    );
    const timer = window.setTimeout(() => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        setHiddenFile(
          new File([blob], `crop-${Date.now()}.png`, { type: "image/png", lastModified: Date.now() }),
        );
      }, "image/png");
    }, 120);
    return () => window.clearTimeout(timer);
  }, [ready, zoom, safeX, safeY, width, height, natural]);

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="block min-w-56 flex-1">
          <span className="field-label">{label}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFile}
            className="field !py-2.5 !text-xs file:mr-3 file:rounded-md file:border-0 file:bg-gold/20 file:px-3 file:py-1.5 file:text-[11px] file:font-bold file:text-gold"
          />
          <input ref={hiddenRef} type="file" name={name} className="hidden" tabIndex={-1} />
        </label>
        <label className="block w-24">
          <span className="field-label">Width (px)</span>
          <input
            type="number"
            min={minWidth}
            max={maxWidth}
            value={width}
            onChange={(event) =>
              setWidth(
                Math.max(
                  minWidth,
                  Math.min(maxWidth, Number(event.target.value) || minWidth),
                ),
              )
            }
            className="field num !py-2 !text-sm"
          />
        </label>
      </div>

      {hint ? <p className="mt-2 text-[11px] text-white/35">{hint}</p> : null}

      <canvas
        ref={canvasRef}
        className={`mt-4 w-full rounded-lg border border-white/10 bg-black/40 ${ready ? "" : "hidden"}`}
        style={{ aspectRatio: String(aspect) }}
      />
      {!ready ? (
        <div
          className="mt-4 grid place-items-center rounded-lg border border-dashed border-white/10 bg-black/20 text-xs text-white/30"
          style={{ aspectRatio: String(aspect) }}
        >
          Choose an image to crop
        </div>
      ) : null}

      {ready ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="field-label">Zoom {zoom.toFixed(2)}x</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="w-full accent-[#dcb97f]"
            />
          </label>
          <label className="block">
            <span className="field-label">Horizontal</span>
            <input
              type="range"
              min={-maxX}
              max={maxX}
              step={1}
              value={safeX}
              onChange={(event) => setOffsetX(Number(event.target.value))}
              disabled={maxX === 0}
              className="w-full accent-[#dcb97f]"
            />
          </label>
          <label className="block">
            <span className="field-label">Vertical</span>
            <input
              type="range"
              min={-maxY}
              max={maxY}
              step={1}
              value={safeY}
              onChange={(event) => setOffsetY(Number(event.target.value))}
              disabled={maxY === 0}
              className="w-full accent-[#dcb97f]"
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}
