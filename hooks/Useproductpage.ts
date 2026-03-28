"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from "react";
import {
  useCreateProduct,
  useGetProducts,
  useUpdateProduct,
  useAddVariantsProduct,
  useAddImageVariantsProduct,
  useUpdateProductVariant,
  useGetSingleProduct,
  useDeleteProduct,
  useDeleteProductVariant,
  useSetThumbnail,
} from "@/hooks/useProducts";
import { useGetCategory } from "@/hooks/useDashboard";
import {
  ErrorResponse,
  NotificationState,
  SubVariant,
  Volume,
  TabType,
  Variant,
} from "@/type/type";
import { useShowNotification } from "@/utils/showNotification";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const emptyV = (): Volume => ({
  volume: "",
  price: "",
  compare_at_price: "",
  stock: "",
  imageFiles: [],
  imagePreviews: [],
  thumbnailIndex: 0,
});
export function useProductPage({page,search}:{page:number,search:string}) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<TabType>("create");

  const { data: categories } = useGetCategory();
  const productsParams = {
    all: true,
    search: search || undefined,
    ...(search ? {} : { page: page }),
  };
  const { data: productsData, isLoading: loadingProducts } =
    useGetProducts(productsParams);

  const catOptions = [
    { value: "", label: "Select category…" },
    ...(categories?.map((c) => ({ value: c.name, label: c.name })) ?? []),
  ];

  /* ---- Notification ---- */
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const showNotification = useShowNotification(setNotification);

  /* ---- Shared product for variant tabs ---- */
  const [varPid, setVarPid] = useState<number | null>(null);
  const { data: varProduct, isLoading: loadingVarProduct } =
    useGetSingleProduct(varPid ?? 0, true);

  const refreshVariantProduct = useCallback(() => {
    if (varPid)
      queryClient.invalidateQueries({ queryKey: ["product", varPid] });
  }, [queryClient, varPid]);

  /* ---------------------------------------------------------------- */
  /* CREATE                                                            */
  /* ---------------------------------------------------------------- */
  const [cf, setCf] = useState({
    name_en: "",
    name_ar: "", // ← NEW
    categories: "",
    fragrance_family_en: "",
    fragrance_family_ar: "", // ← NEW
    description_en: "",
    description_ar: "", // ← NEW
  });
  const [cvars, setCVars] = useState<Volume[]>([emptyV()]);
  const [cStep, setCStep] = useState<
    "idle" | "creating" | "variants" | "images" | "done"
  >("idle");

  const { mutateAsync: createAsync } = useCreateProduct();
  const { mutateAsync: addVarsAsync } = useAddVariantsProduct();
  const { mutateAsync: uploadImgAsync } = useAddImageVariantsProduct();
  const { mutate: setThumbMutate } = useSetThumbnail();
  const { mutate: deleteProd, isPending: deletingProd } = useDeleteProduct();
  const [confirmDeletePid, setConfirmDeletePid] = useState<number | null>(null);

const sc =
  (k: string) =>
  (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) =>
    setCf((f) => ({ ...f, [k]: e.target.value }));
  const addCImgs = (i: number, files: File[]) =>
    setCVars((vs) =>
      vs.map((v, idx) =>
        idx !== i
          ? v
          : {
              ...v,
              imageFiles: [...v.imageFiles, ...files],
              imagePreviews: [
                ...v.imagePreviews,
                ...files.map((f) => URL.createObjectURL(f)),
              ],
            },
      ),
    );

  const removeCImg = (i: number, fi: number) =>
    setCVars((vs) =>
      vs.map((v, idx) =>
        idx !== i
          ? v
          : {
              ...v,
              imageFiles: v.imageFiles.filter((_, j) => j !== fi),
              imagePreviews: v.imagePreviews.filter((_, j) => j !== fi),
              thumbnailIndex:
                v.thumbnailIndex === fi
                  ? 0
                  : v.thumbnailIndex > fi
                    ? v.thumbnailIndex - 1
                    : v.thumbnailIndex,
            },
      ),
    );

  const setCThumb = (i: number, fi: number) =>
    setCVars((vs) =>
      vs.map((v, idx) => (idx !== i ? v : { ...v, thumbnailIndex: fi })),
    );

  /* ---------------------------------------------------------------- */
  /* EDIT PRODUCT                                                      */
  /* ---------------------------------------------------------------- */
  const [pid, setPid] = useState<number | null>(null);
  const [ef, setEf] = useState({
    name_en: "",
    name_ar: "", // ← NEW
    categories: "",
    fragrance_family_en: "",
    fragrance_family_ar: "", // ← NEW
    description_en: "",
    description_ar: "", // ← NEW
    is_active: "true",
  });
  const [eStep, setEStep] = useState<"idle" | "updating" | "images" | "done">(
    "idle",
  );

  const { data: singleProduct, isLoading: loadingSingle } = useGetSingleProduct(
    pid ?? 0,
    true,
  );
  const { mutate: updateMutate } = useUpdateProduct();

useEffect(() => {
  if (singleProduct) {
    setEf({
      name_en: singleProduct.name_en ?? "",
      name_ar: singleProduct.name_ar ?? "", // ← NEW
      categories: String(
        singleProduct.category ?? singleProduct.category ?? "",
      ),
      fragrance_family_en: singleProduct.fragrance_family_en ?? "",
      fragrance_family_ar: singleProduct.fragrance_family_ar ?? "", // ← NEW
      description_en: singleProduct.description_en ?? "",
      description_ar: singleProduct.description_ar ?? "", // ← NEW
      is_active: String(singleProduct.is_active ?? true),
    });
  }
  setEStep("idle");
}, [singleProduct]);

  const se = (k: string) => (e: any) =>
    setEf((f) => ({ ...f, [k]: e.target.value }));

  /* ---------------------------------------------------------------- */
  /* ADD VARIANT                                                       */
  /* ---------------------------------------------------------------- */
  const [avars, setAvars] = useState<Volume[]>([emptyV()]);
  const [avStep, setAvStep] = useState<"idle" | "adding" | "images" | "done">(
    "idle",
  );
  const [newlyCreatedVids, setNewlyCreatedVids] = useState<number[]>([]);

  const addAImgs = (i: number, files: File[]) =>
    setAvars((vs) =>
      vs.map((v, idx) =>
        idx !== i
          ? v
          : {
              ...v,
              imageFiles: [...v.imageFiles, ...files],
              imagePreviews: [
                ...v.imagePreviews,
                ...files.map((f) => URL.createObjectURL(f)),
              ],
            },
      ),
    );

  const removeAImg = (i: number, fi: number) =>
    setAvars((vs) =>
      vs.map((v, idx) =>
        idx !== i
          ? v
          : {
              ...v,
              imageFiles: v.imageFiles.filter((_, j) => j !== fi),
              imagePreviews: v.imagePreviews.filter((_, j) => j !== fi),
              thumbnailIndex:
                v.thumbnailIndex === fi
                  ? 0
                  : v.thumbnailIndex > fi
                    ? v.thumbnailIndex - 1
                    : v.thumbnailIndex,
            },
      ),
    );

  const setAThumb = (i: number, fi: number) =>
    setAvars((vs) =>
      vs.map((v, idx) => (idx !== i ? v : { ...v, thumbnailIndex: fi })),
    );

  /* ---------------------------------------------------------------- */
  /* EDIT VARIANT                                                      */
  /* ---------------------------------------------------------------- */
  const [selectedVid, setSelectedVid] = useState<number | null>(null);
  const [evf, setEvf] = useState({
    volume: "",
    price: "",
    compare_at_price: "",
    stock: "",
    is_active: "true",
  });
  const [evStep, setEvStep] = useState<"idle" | "updating" | "done">("idle");
  const [confirmDeleteVid, setConfirmDeleteVid] = useState<number | null>(null);

  const { mutateAsync: updateVariantAsync } = useUpdateProductVariant();
  const { mutate: deleteVariant, isPending: deletingVariant } =
    useDeleteProductVariant();

  useEffect(() => {
    if (!selectedVid || !varProduct?.variants) return;
    const v = varProduct.variants.find((x: Variant) => x.id === selectedVid);
    if (!v) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEvf({
      volume: v.volume ?? "",
      price: v.price ?? "",
      compare_at_price: v.compare_at_price ?? "",
      stock: String(v.stock) ?? "0",
      is_active: v.is_active ? "true" : "false",
    });
    setEvStep("idle");
  }, [selectedVid, varProduct]);

  /* ---------------------------------------------------------------- */
  /* Shared image upload helper                                        */
  /* ---------------------------------------------------------------- */
  const uploadVariantImages = async (vid: number, variantData: Volume) => {
    if (!variantData.imageFiles.length) return;
    const uploadedIds: number[] = [];
    for (const f of variantData.imageFiles) {
      try {
        const fd = new FormData();
        fd.append("img", f);
        const res: any = await uploadImgAsync({ payload: fd, variant_id: vid });
        if (res?.id) uploadedIds.push(res.id);
      } catch {}
    }
    if (
      variantData.thumbnailIndex > 0 &&
      uploadedIds[variantData.thumbnailIndex]
    ) {
      try {
        await new Promise<void>((res) =>
          setThumbMutate(uploadedIds[variantData.thumbnailIndex], {
            onSuccess: () => res(),
            onError: () => res(),
          }),
        );
      } catch {}
    }
  };

  /* ---------------------------------------------------------------- */
  /* Handlers                                                          */
  /* ---------------------------------------------------------------- */
  const handleCreate = async () => {
    if (!cf.name_en || !cf.name_ar || !cf.categories) {
      showNotification("Name & category required.", "error");
      return;
    }
    setCStep("creating");
    try {
      const created: any = await createAsync({
        name_ar: cf.name_ar,
        name_en: cf.name_en,
        categories:
          categories?.find((c) => String(c.id) === cf.categories)?.name ??
          cf.categories,
        description_ar: cf.description_ar,
        description_en: cf.description_en,
        fragrance_family_ar: cf.fragrance_family_ar,
        fragrance_family_en: cf.fragrance_family_en,
      });
      const pid2: number = created?.id ?? created?.product_id;
      const filled = cvars.filter((v) => v.volume && v.price);
      let createdV: any[] = [];
      if (filled.length) {
        setCStep("variants");
        const r: any = await addVarsAsync({
          payload: filled.map((v) => ({
            volume: v.volume,
            price: v.price,
            stock: Number(v.stock) || 0,
            compare_at_price: v.compare_at_price,
          })),
          product_id: pid2,
        });
        createdV = Array.isArray(r) ? r : (r?.variants ?? []);
      }
      if (createdV.length && filled.some((v) => v.imageFiles.length)) {
        setCStep("images");
        for (let i = 0; i < filled.length; i++) {
          if (!filled[i].imageFiles.length) continue;
          const vid = createdV[i]?.id ?? createdV[i]?.variant_id;
          if (!vid) continue;
          await uploadVariantImages(vid, filled[i]);
        }
      }
      setCStep("done");
      showNotification("Product created!", "success");
      setCf({
        name_en: "",
        name_ar: "", // ← NEW
        categories: "",
        fragrance_family_en: "",
        fragrance_family_ar: "", // ← NEW
        description_en: "",
        description_ar: "", // ← NEW
      });
      setCVars([emptyV()]);
      setTimeout(() => setCStep("idle"), 2000);
    } catch (err: unknown) {
      const e = err as AxiosError<ErrorResponse>;
      showNotification(
        e?.response?.data?.detail || (e as any)?.message || "Failed.",
        "error",
      );
      setCStep("idle");
    }
  };

  const handleDeleteProduct = (id: number) => {
    deleteProd(
      { product_id: id },
      {
        onSuccess: () => {
          showNotification("Product deleted.", "success");
          setConfirmDeletePid(null);
          if (pid === id) setPid(null);
        },
        onError: (e: AxiosError<ErrorResponse>) => {
          showNotification(
            e?.response?.data?.detail || "Delete failed.",
            "error",
          );
          setConfirmDeletePid(null);
        },
      },
    );
  };

  const handleEdit = async () => {
    if (!pid) {
      showNotification("Select a product.", "error");
      return;
    }
    setEStep("updating");
    const payload: any = {};
    if (ef.name_en) payload.name = ef.name_en;
    if (ef.name_ar) payload.name_ar = ef.name_ar; 
    if (ef.categories) payload.category = ef.categories;
    if (ef.description_en) payload.description = ef.description_en;
    if (ef.description_ar) payload.description_ar = ef.description_ar; 
    if (ef.fragrance_family_en) payload.fragrance_family = ef.fragrance_family_en;
    if (ef.fragrance_family_ar)
      payload.fragrance_family_ar = ef.fragrance_family_ar; 
    payload.is_active = ef.is_active === "true";
    try {
      await new Promise<void>((res, rej) =>
        updateMutate(
          { product_id: pid, payload },
          { onSuccess: () => res(), onError: (e) => rej(e) },
        ),
      );
      setEStep("done");
      showNotification("Product updated.", "success");
      setTimeout(() => setEStep("idle"), 2000);
    } catch (err: unknown) {
      const e = err as AxiosError<ErrorResponse>;
      showNotification(
        e?.response?.data?.detail || (e as any)?.message || "Update failed.",
        "error",
      );
      setEStep("idle");
    }
  };

  const handleAddVariant = async () => {
    if (!varPid) {
      showNotification("Select a product.", "error");
      return;
    }
    const filled = avars.filter((v) => v.volume && v.price);
    if (!filled.length) {
      showNotification(
        "Add at least one variant with volume & price.",
        "error",
      );
      return;
    }
    setAvStep("adding");
    setNewlyCreatedVids([]);
    try {
      const r: any = await addVarsAsync({
        payload: filled.map((v) => ({
          volume: v.volume,
          price: v.price,
          stock: Number(v.stock) || 0,
          compare_at_price: v.compare_at_price,
        })),
        product_id: varPid,
      });
      const created: any[] = Array.isArray(r) ? r : (r?.variants ?? []);
      if (created.length && filled.some((v) => v.imageFiles.length)) {
        setAvStep("images");
        for (let i = 0; i < filled.length; i++) {
          if (!filled[i].imageFiles.length) continue;
          const vid = created[i]?.id ?? created[i]?.variant_id;
          if (!vid) continue;
          await uploadVariantImages(vid, filled[i]);
        }
      }
      const ids = created
        .map((c: any) => c?.id ?? c?.variant_id)
        .filter(Boolean);
      setNewlyCreatedVids(ids);
      refreshVariantProduct();
      setAvStep("done");
      showNotification("Variants added!", "success");
      setAvars([emptyV()]);
      setTimeout(() => setAvStep("idle"), 2000);
    } catch (err: unknown) {
      const e = err as AxiosError<ErrorResponse>;
      showNotification(
        e?.response?.data?.detail || (e as any)?.message || "Failed.",
        "error",
      );
      setAvStep("idle");
    }
  };

  const handleEditVariant = async () => {
    if (!selectedVid) {
      showNotification("Select a variant.", "error");
      return;
    }
    setEvStep("updating");
    try {
      const payload: Partial<SubVariant> = {};
      if (evf.volume) payload.volume = evf.volume;
      if (evf.price) payload.price = evf.price;
      if (evf.compare_at_price) payload.compare_at_price = evf.compare_at_price;
      if (evf.stock) payload.stock = Number(evf.stock);
      payload.is_active = evf.is_active === "true";
      await updateVariantAsync({ variant_id: selectedVid, payload });
      setEvStep("done");
      showNotification("Variant updated.", "success");
      setTimeout(() => setEvStep("idle"), 2000);
    } catch (err: any) {
      showNotification(
        err?.response?.data?.detail || err?.message || "Failed.",
        "error",
      );
      setEvStep("idle");
    }
  };

  const handleDeleteVariant = (vid: number) => {
    deleteVariant(
      { variant_id: vid },
      {
        onSuccess: () => {
          showNotification("Variant deleted.", "success");
          setConfirmDeleteVid(null);
          setSelectedVid(null);
          refreshVariantProduct();
        },
        onError: (e: AxiosError<ErrorResponse>) => {
          showNotification(
            e?.response?.data?.detail || "Delete failed.",
            "error",
          );
          setConfirmDeleteVid(null);
        },
      },
    );
  };

  return {
    /* general */
    tab,
    setTab,
    catOptions,
    notification,
    showNotification,
    productsData,
    loadingProducts,
    /* create */
    cf,
    sc,
    cvars,
    setCVars,
    cStep,
    addCImgs,
    removeCImg,
    setCThumb,
    handleCreate,
    confirmDeletePid,
    setConfirmDeletePid,
    deletingProd,
    handleDeleteProduct,
    /* edit product */
    pid,
    setPid,
    ef,
    se,
    eStep,
    singleProduct,
    loadingSingle,
    handleEdit,
    /* add variant */
    varPid,
    setVarPid,
    varProduct,
    loadingVarProduct,
    avars,
    setAvars,
    avStep,
    addAImgs,
    removeAImg,
    setAThumb,
    handleAddVariant,
    newlyCreatedVids,
    setNewlyCreatedVids,
    refreshVariantProduct,
    /* edit variant */
    selectedVid,
    setSelectedVid,
    evf,
    setEvf,
    evStep,
    confirmDeleteVid,
    setConfirmDeleteVid,
    deletingVariant,
    handleEditVariant,
    handleDeleteVariant,
    queryClient,
  };
}
