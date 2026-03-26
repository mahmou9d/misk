"use client";

import { apiClient } from "@/lib/apiClient";
import { AddReviewRequest, TReview } from "../type/type";

export const reviewAPI = {

  // TODO
  
  getReviews: async (productId?: number): Promise<TReview[]> => {
    const { data } = await apiClient.get<TReview[]>(
      `/products/${productId}/reviews/`,
    );
    return data || [];
  },

  addReview: async (payload: AddReviewRequest): Promise<TReview> => {
    const { data } = await apiClient.post<TReview>("/reviews/add/", {
      product: payload.product,
      comment: payload.comment,
      rating: Number(payload.rating),
    });
    return data;
  },
};
