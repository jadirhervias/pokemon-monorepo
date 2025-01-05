"use client";
import { io } from "socket.io-client";
import { getCookie } from "@/app/_lib/utils/cookies";

export const socket = io(`http://localhost:4000/ws/io`, {
  autoConnect: false,
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  auth: {
    token: `Bearer ${getCookie('token')}`,
  },
});
