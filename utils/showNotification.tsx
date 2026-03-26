"use client";

import { NotificationState } from "@/type/type";
import { useCallback } from "react";



export const useShowNotification = (
  setNotification: React.Dispatch<
    React.SetStateAction<NotificationState | null>
  >,
) => {
  const showNotification = useCallback(
    (message: string, type: "success" | "error") => {
      setNotification({ message, type });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
    },
    [setNotification],
  );

  return showNotification;
};
