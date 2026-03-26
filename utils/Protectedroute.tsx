"use client";
import IsLoading from "@/components/layout/IsLoading";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/lib/Usetranslation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = true,
  redirectTo = "/",
}) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const { locale } = useTranslation();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      router.replace(redirectTo=`/${locale.toLowerCase()}`);
      return;
    }

    if (adminOnly && !isAdmin) {
      router.replace(`/${locale.toLowerCase()}`);
    }
  }, [isAuthenticated, isAdmin, isLoading, adminOnly, redirectTo, router, locale]);

  if (isLoading) {
    return <IsLoading />;
  }

  if (!isAuthenticated) return null;
  if (adminOnly && !isAdmin) return null;

  return <>{children}</>;
};
