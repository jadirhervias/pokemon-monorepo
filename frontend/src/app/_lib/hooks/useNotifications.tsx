"use client";
import { useState, useCallback } from "react";

type Notification = {
  id: number;
  message: string;
};

export function useNotifications(timeout: number = 5000) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string) => {
    const newNotification = { id: Date.now(), message };
    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== newNotification.id));
    }, timeout);
  }, [timeout]);

  return { notifications, addNotification };
}
