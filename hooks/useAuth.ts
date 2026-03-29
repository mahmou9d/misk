"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../api/authApi";
import { ErrorResponse, LoginRequest, SignupRequest } from "../type/type";
import { storage } from "@/lib/storage";
import { AxiosError } from "axios";

export const authKeys = {
  all: ["auth"] as const,
  role: () => [...authKeys.all, "role"] as const,
};

export const useGetRole = () => {
  return useQuery({
    queryKey: authKeys.role(),
    queryFn: authAPI.getRole,
    enabled: !!storage.getToken("access"),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginRequest) => authAPI.login(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.role() });
    },
    onError: (error:AxiosError<ErrorResponse>) => {
      // console.error("Login failed:", error);
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (payload: SignupRequest) => authAPI.signup(payload),
    onError: (error:AxiosError<ErrorResponse>) => {
      // console.error("Signup failed:", error);
    },
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: authAPI.refreshToken,
    onError: (error:AxiosError<ErrorResponse>) => {
      // console.error("Refresh failed:", error);
    },
  });
};

export const usePasswordReset = () => {
  return useMutation({
    mutationFn: (email: string) => authAPI.passwordReset(email),
    onError: (error:AxiosError<ErrorResponse>) => {
      // console.error("Password reset failed:", error);
    },
  });
};

export const usePasswordResetConfirm = () => {
  return useMutation({
    mutationFn: (payload: { token: string; password: string }) =>
      authAPI.passwordResetConfirm(payload),
    onError: (error:AxiosError<ErrorResponse>) => {
      // console.error("Password reset confirmation failed:", error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
    onError: (error:AxiosError<ErrorResponse>) => {
      storage.clearAll();
      queryClient.removeQueries({ queryKey: authKeys.all });
      // console.error("Logout failed:", error);
    },
  });
};

export const useLoginGoogle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { credential: string }) => authAPI.google(payload),
    onSuccess: (data) => {
      // console.log("✅ Google login response:", data);
      if (data.access) {
        localStorage.setItem("access", data.access);
      }
      if (data.refresh) {
        localStorage.setItem("refresh", data.refresh);
      }
      queryClient.invalidateQueries({ queryKey: authKeys.role() });
    },
    onError: (error:AxiosError<ErrorResponse>) => {
      // console.error("Google login failed:", error);
    },
  });
};
export const useAuth = () => {
  const { data: user, isLoading } = useGetRole();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const signupMutation = useSignup();

  const isAuthenticated =
    typeof window !== "undefined" && !!user && !!storage.getToken("access");
  const isAdmin = user?.is_admin ?? false;

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    logout: logoutMutation.mutate,
    isLoginPending: loginMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
  };
};
