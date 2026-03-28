/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRef, useState } from "react";
import { Btn, Card, Input, Sec } from "@/components/layout/Adminui";
import {
  useAddImageVariantsProduct,
  useDeleteThumbnail,
  useSetThumbnail,
} from "@/hooks/useProducts";
import { ErrorResponse } from "@/type/type";
import { AxiosError } from "axios";
import { GalleryImage, Volume } from "@/type/type";
import { useTranslation } from "@/lib/Usetranslation";
import Image from "next/image";
export const MAX_IMG_BYTES = 3 * 1024 * 1024;

/* ── Spinner ── */
export function Spinner({ label }: { label: string }) {
  const { isArabic } = useTranslation();
  return (
    <div
      className={`mb-2 flex items-center gap-1.5 ${isArabic ? "text-[16px] flex-row-reverse justify-end" : "text-[12px]"} text-gray-400`}
    >
      <span className="inline-block w-4 h-4 rounded-full border-2 border-[#fff] border-t-transparent animate-spin flex-shrink-0" />
      {label}
    </div>
  );
}

/* ── ConfirmDelete ── */
export function ConfirmDelete({
  label,
  busy,
  onConfirm,
  onCancel,
}: {
  label: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { t, isArabic } = useTranslation();
  const c = t.adminComponents;
  return (
    <div
      className="bg-red-500/10 border border-red-500/20 rounded-xl p-[12px_14px] mt-2"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <p
        className={`${isArabic ? "text-[16px]" : "text-[16px]"} text-red-400 mb-2.5`}
      >
        {c.deleteConfirm} {label}?
      </p>
      <div className="flex gap-2">
        <Btn variant="danger" onClick={onConfirm} loading={busy}>
          {c.yesDelete}
        </Btn>
        <Btn variant="ghost" onClick={onCancel}>
          {c.cancel}
        </Btn>
      </div>
    </div>
  );
}

/* ── ImgGallery ── */
export function ImgGallery({
  variantId,
  images,
  onRefresh,
  onNotify,
}: {
  variantId: number;
  images: GalleryImage[];
  onRefresh: () => void;
  onNotify: (msg: string, type: "success" | "error") => void;
}) {
  const { t, isArabic } = useTranslation();
  const c = t.adminComponents;
  const fileRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: uploadImg, isPending: uploading } =
    useAddImageVariantsProduct();
  const { mutate: deleteImg } = useDeleteThumbnail();
  const { mutate: setThumb } = useSetThumbnail();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleAdd = async (f: File) => {
    if (f.size > MAX_IMG_BYTES) {
      onNotify(c.imgTooLarge, "error");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("img", f);
      await uploadImg({ payload: fd, variant_id: variantId });
      onRefresh();
      onNotify(c.imgUploaded, "success");
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      onNotify(
        error?.response?.data?.message ||
          error?.response?.data?.detail ||
          error?.response?.data?.error ||
          error?.response?.data?.status ||
          error?.response?.data?.non_field_errors ||
          error?.response?.data?.name ||
          error?.message ||
          c.uploadFailed,
        "error",
      );
    }
  };

  const handleDelete = (image_id: number) => {
    deleteImg(image_id, {
      onSuccess: () => {
        onRefresh();
        onNotify(c.imgDeleted, "success");
      },
      onError: (error: AxiosError<ErrorResponse>) =>
        onNotify(
          error?.response?.data?.message ||
            error?.response?.data?.detail ||
            error?.response?.data?.error ||
            error?.response?.data?.status ||
            error?.response?.data?.non_field_errors ||
            error?.response?.data?.name ||
            error?.message ||
            c.deleteFailed,
          "error",
        ),
    });
  };

  const handleSetThumb = (image_id: number) => {
    setThumb(image_id, {
      onSuccess: () => {
        onRefresh();
        onNotify(c.mainUpdated, "success");
      },
      onError: (error: AxiosError<ErrorResponse>) =>
        onNotify(
          error?.response?.data?.message ||
            c.failed,
          "error",
        ),
    });
  };

  return (
    <div className="mb-3" dir={isArabic ? "rtl" : "ltr"}>
      <label
        className={`${isArabic ? "text-[20px]" : "text-[16px]"} text-gray-400 block mb-1.5`}
      >
        {c.images}
      </label>
      <div className="flex flex-wrap gap-2 items-start">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative shrink-0"
            onMouseEnter={() => setHoveredId(img.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Image
              width={200}
              height={200}
              loading="lazy"
              alt="Image Product"
              src={img.url || "heros.jpg"}
              className={`w-[200px] h-[200px] object-cover rounded-xl block border-2 ${
                img.is_thumbnail ? "border-[#fff]" : "border-white/10"
              }`}
            />
            {img.is_thumbnail && (
              <span
                className={`absolute top-0.5 ${isArabic ? "right-0.5" : "left-0.5"} bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white text-[15px] rounded-[3px] px-1 py-px pointer-events-none -wider font-bold`}
              >
                {c.mainBadge}
              </span>
            )}
            <div
              className={`absolute inset-0 bg-black/70 rounded-xl flex flex-col items-center justify-center gap-1 transition-opacity duration-150 ${
                hoveredId === img.id ? "opacity-100" : "opacity-0"
              }`}
            >
              {!img.is_thumbnail && (
                <button
                  title={c.setMainTitle}
                  onClick={() => handleSetThumb(img.id)}
                  className="text-[15px] font-bold bg-amber-600 text-white border-none rounded-[3px] px-1.5 py-0.5 cursor-pointer -wider"
                >
                  {c.mainBadge}
                </button>
              )}
              <button
                title={c.deleteImgTitle}
                onClick={() => handleDelete(img.id)}
                className="text-[15px] font-bold bg-red-500 text-white border-none rounded-[3px] px-1.5 py-0.5 cursor-pointer -wider"
              >
                {c.delBadge}
              </button>
            </div>
          </div>
        ))}

        {/* Add button */}
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          title={c.addImgTitle}
          className={`w-[200px] h-[200px] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center shrink-0 bg-white/5 select-none gap-0.5 ${
            uploading
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:bg-white/10 hover:border-white/20 transition-colors"
          }`}
        >
          <span className="text-[16px] font-bold -wider text-gray-500">
            {uploading ? "..." : c.addBadge}
          </span>
          {!uploading && (
            <span className="text-[16px] text-gray-600 font-semibold">
              {c.maxSize}
            </span>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleAdd(f);
            e.target.value = "";
          }}
        />
      </div>
      {images.length === 0 && !uploading && (
        <p
          className={`${isArabic ? "text-[16px]" : "text-[16px]"} text-gray-600 mt-1.5`}
        >
          {c.noImages}
        </p>
      )}
    </div>
  );
}

/* ── MultiImgPicker ── */
export function MultiImgPicker({
  imagePreviews,
  thumbnailIndex,
  onAdd,
  onRemove,
  onSetThumb,
}: {
  imageFiles: File[];
  imagePreviews: string[];
  thumbnailIndex: number;
  onAdd: (files: File[]) => void;
  onRemove: (fi: number) => void;
  onSetThumb: (fi: number) => void;
}) {
  const { t, isArabic } = useTranslation();
  const c = t.adminComponents;
  const fileRef = useRef<HTMLInputElement>(null);
  const [hoveredFi, setHoveredFi] = useState<number | null>(null);
  const [sizeErr, setSizeErr] = useState("");

  const handleFiles = (incoming: File[]) => {
    const valid = incoming.filter((f) => f.size <= MAX_IMG_BYTES);
    const rejected = incoming.length - valid.length;
    setSizeErr(
      rejected > 0 ? c.filesSkipped.replace("{n}", String(rejected)) : "",
    );
    if (valid.length) onAdd(valid);
  };

  return (
    <div dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex flex-wrap gap-1.5 items-start">
        {imagePreviews.map((src, fi) => (
          <div
            key={fi}
            className="relative shrink-0"
            onMouseEnter={() => setHoveredFi(fi)}
            onMouseLeave={() => setHoveredFi(null)}
          >
            <Image
              src={src}
              width={200}
              height={200}
              loading="lazy"
              alt="Image Product"
              className={`w-[200px] h-[200px] object-cover rounded-xl block border-2 ${
                thumbnailIndex === fi ? "border-[#fff]" : "border-white/10"
              }`}
            />
            {thumbnailIndex === fi && (
              <span
                className={`absolute top-0.5 ${isArabic ? "right-0.5" : "left-0.5"} bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white text-[15px] rounded-sm px-1 py-px pointer-events-none font-bold -wider`}
              >
                {c.mainBadge}
              </span>
            )}
            <div
              className={`absolute inset-0 bg-black/70 rounded-xl flex flex-col items-center justify-center gap-1 transition-opacity duration-150 ${
                hoveredFi === fi ? "opacity-100" : "opacity-0"
              }`}
            >
              {thumbnailIndex !== fi && (
                <button
                  onClick={() => onSetThumb(fi)}
                  className="text-[15px] font-bold bg-[#fff] text-white border-none rounded-[3px] px-1.5 py-0.5 cursor-pointer -wider"
                >
                  {c.mainBadge}
                </button>
              )}
              <button
                onClick={() => onRemove(fi)}
                className="text-[15px] font-bold bg-red-500 text-white border-none rounded-[3px] px-1.5 py-0.5 cursor-pointer -wider"
              >
                {c.delBadge}
              </button>
            </div>
          </div>
        ))}

        <div
          onClick={() => fileRef.current?.click()}
          title={c.addImgsTitle}
          className="w-[200px] h-[200px] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-white/5 shrink-0 select-none gap-px hover:bg-white/10 hover:border-white/20 transition-colors"
        >
          <span className="text-[15px] font-bold text-gray-500 -widest">
            {c.addBadge}
          </span>
          <span className="text-[15px] text-gray-600 font-semibold">
            {c.maxSize}
          </span>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) handleFiles(files);
            e.target.value = "";
          }}
        />
      </div>
      {sizeErr && (
        <p
          className={`${isArabic ? "text-[15px]" : "text-[15px]"} text-red-400 mt-1`}
        >
          {sizeErr}
        </p>
      )}
    </div>
  );
}

/* ── VRow ── */
export function VRow({
  v,
  onChangeVolume,
  onChangePrice,
  onChangeCompare,
  onChangeStock,
  onAddImgs,
  onRemoveImg,
  onSetThumb,
  onRemove,
}: {
  v: Volume;
  onChangeVolume: (e: any) => void;
  onChangePrice: (e: any) => void;
  onChangeCompare: (e: any) => void;
  onChangeStock: (e: any) => void;
  onAddImgs: (files: File[]) => void;
  onRemoveImg: (fi: number) => void;
  onSetThumb: (fi: number) => void;
  onRemove?: () => void;
}) {
  const { t, isArabic } = useTranslation();
  const c = t.adminComponents;
  return (
    <div
      className=" border border-white/10 rounded-xl p-2.5 mb-2"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="flex gap-2 items-start flex-wrap">
        <div className="shrink-0">
          <MultiImgPicker
            imageFiles={v.imageFiles}
            imagePreviews={v.imagePreviews}
            thumbnailIndex={v.thumbnailIndex}
            onAdd={onAddImgs}
            onRemove={onRemoveImg}
            onSetThumb={onSetThumb}
          />
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 flex-1 min-w-[180px]">
          <Input
            label={c.volume}
            placeholder="100ml"
            value={v.volume}
            onChange={onChangeVolume}
          />
          <Input
            label={c.price}
            placeholder="120.00"
            value={v.price}
            onChange={onChangePrice}
          />
          <Input
            label={c.compare}
            placeholder="140.00"
            value={v.compare_at_price}
            onChange={onChangeCompare}
          />
          <Input
            label={c.stock}
            placeholder="50"
            value={v.stock}
            onChange={onChangeStock}
            type="number"
          />
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="h-8 w-8 border border-red-500/20 rounded-xl bg-red-500/10 text-red-400 cursor-pointer text-base shrink-0 hover:bg-red-500/20 transition-colors"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

/* ── ProductList ── */
export function ProductList({
  onPick,
  activePid,
  products,
  loading,
}: {
  onPick: (id: number) => void;
  activePid: number | null;
  products: any[];
  loading: boolean;
}) {
  const { t, isArabic } = useTranslation();
  const c = t.adminComponents;
  const txt = isArabic
    ? {
        base: "text-[14px]",
        sm: "text-[13px]",
        xs: "text-[12px]",
        xxs: "text-[11px]",
      }
    : {
        base: "text-[15px]",
        sm: "text-[13px]",
        xs: "text-[12px]",
        xxs: "text-[11px]",
      };

  return (
    <Card dir={isArabic ? "rtl" : "ltr"}>
      <Sec>{c.allProducts}</Sec>
      {loading && <p className={`${txt.sm} text-gray-500`}>{c.loading}</p>}
      <div className="flex flex-col gap-1.5 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
        {products?.map((p: any) => (
          <div
            key={p.id}
            className={`p-[8px_12px] rounded-xl cursor-pointer transition-all border ${
              activePid === p.id
                ? "bg-[#fff]/10 border-[#fff]/30"
                : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
            }`}
            onClick={() => onPick(p.id)}
          >
            <div className="flex justify-between">
              <span
                className={`${txt.sm} ${
                  activePid === p.id
                    ? "text-[#fff] font-semibold"
                    : "text-gray-300 font-normal"
                }`}
              >
                {p.name}
              </span>
              <span className={`${txt.xxs} text-gray-600`}>#{p.id}</span>
            </div>
            <span className={`${txt.xxs} text-gray-500 block`}>
              {p.category_name || (p.category as any)?.name || ""}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
