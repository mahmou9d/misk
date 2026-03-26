"use client";

import { apiClient } from "@/lib/apiClient";
import {
  CheckoutFormData,
  CheckoutSessionResponse,
  OrderHistoryResponse,
  PayPalCapture,
  PayPalCaptureResponse,
  PayPalOrderResponse,
  PlaceOrderResponse,
} from "@/type/type";

export const paymentAPI = {
  paymentPaymob: async (
    order_id: string,
    payment_method?: string,
    wallet_number?: string,
  ): Promise<CheckoutSessionResponse> => {
    const { data } = await apiClient.post<CheckoutSessionResponse>(
      "/payment/paymob/create-checkout/",
      { order_id, payment_method, wallet_number },
    );
    return data;
  },

  placeOrder: async (
    orderData: CheckoutFormData,
  ): Promise<PlaceOrderResponse> => {
    const { data } = await apiClient.post<PlaceOrderResponse>(
      "/orders/place/",
      orderData,
    );
    return data;
  },

  // TODO
  createCheckoutSession: async (
    order_id: number,
  ): Promise<CheckoutSessionResponse> => {
    const { data } = await apiClient.post<CheckoutSessionResponse>(
      "/payment/create-checkout-session/",
      { order_id },
    );
    return data;
  },

  createPayPalOrder: async (order_id: number): Promise<PayPalOrderResponse> => {
    const { data } = await apiClient.post<PayPalOrderResponse>(
      "/paypal/create-order/",
      { order_id },
    );
    return data;
  },

  capturePayPalOrder: async (
    payload: PayPalCapture,
  ): Promise<PayPalCaptureResponse> => {
    const { data } = await apiClient.post<PayPalCaptureResponse>(
      "/paypal/capture-order/",
      payload,
    );
    return data;
  },

  orderHistory: async (): Promise<OrderHistoryResponse> => {
    const { data } =
      await apiClient.get<OrderHistoryResponse>("/orders/history/");
    return data;
  },
};
