"use client"
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { socket } from '@/socket';
import { getEventNameByRole } from '@/app/_lib/utils/roles';
import { useAuth } from './useAuth';

export interface SocketEvent<T> {
  data: T;
  message: string;
}

export interface SocketEventState<T> {
  lastEvent: SocketEvent<T> | null;
  eventsStack: SocketEvent<T>[];
}

interface SocketContextProps<T> {
  socketEvents: SocketEventState<T>;
  eventName: string | null;
  socketIsConnected: boolean;
  socketTransport: string;
  connectSocket: () => void;
  disconnectSocket: () => void;
  emptySocketEvents: () => void;
  listenToEvent: (eventName: string, callback: (event: SocketEvent<T>) => void) => void;
  removeEventListener: (event: string) => void;
}

const SocketContext = createContext<SocketContextProps<unknown>| undefined>(undefined);

export function SocketProvider<T>({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [socketIsConnected, setSocketIsConnected] = useState(socket.connected);
  const [socketTransport, setSocketTransport] = useState('N/A');
  const [socketEvents, setSocketEvents] = useState<SocketEventState<T>>({ lastEvent: null, eventsStack: [] });

  const handleConnect = useCallback(() => {
    setSocketIsConnected(true);
    setSocketTransport(socket.io.engine.transport.name);

    socket.io.engine.on('upgrade', (transport) => {
      setSocketTransport(transport.name);
    });

    console.log('socket connected');
  }, []);

  const handleDisconnect = useCallback(() => {
    setSocketIsConnected(false);
    setSocketTransport('N/A');
    console.log('socket disconnected');
  }, []);

  const listenToEvent = useCallback(
    (eventName: string, callback: (event: SocketEvent<T>) => void) => {
      const eventHandler = (eventData: T, eventMsg: string) => {
        const event = { data: eventData, message: eventMsg };
        setSocketEvents(prev => ({
          lastEvent: event,
          eventsStack: [...prev.eventsStack, event],
        }));
        return callback(event);
      };

      socket.on(eventName, eventHandler);

      return () => {
        socket.off(eventName, eventHandler);
      };
    },
    []
  );

  const removeEventListener = useCallback((eventName: string) => {
    console.log('removeEventListener', eventName);
    socket.off(eventName);
  }, []);

  const emptySocketEvents = useCallback(() => {
    setSocketEvents({ lastEvent: null, eventsStack: [] });
  }, []);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);

      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [handleConnect, handleDisconnect]);

  return (
    <SocketContext.Provider value={{
      socketIsConnected,
      socketTransport,
      socketEvents,
      eventName: getEventNameByRole(user?.role ?? null),
      connectSocket: () => socket.connect(),
      disconnectSocket: () => socket.disconnect(),
      listenToEvent,
      removeEventListener,
      emptySocketEvents,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export function useSocket<T>() {
  const context = useContext(SocketContext) as SocketContextProps<T> | undefined;
  if (!context) {
    throw new Error('useSocket must be used within an SocketProvider');
  }
  return context;
};
