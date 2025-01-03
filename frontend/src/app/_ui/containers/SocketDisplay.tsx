"use client";
import React, { useEffect } from 'react';
import { useSocket } from '@/app/_lib/hooks/useSocket';
import { ConnectionState } from '../components/ConnectionState';
import { useNotifications } from '@/app/_lib/hooks/useNotifications';

export function SocketDisplay({ children, debugSocket = false }: { children: React.ReactNode, debugSocket?: boolean }) {
  const {
    socketIsConnected,
    socketTransport,
    eventName,
    listenToEvent,
    removeEventListener,
  } = useSocket();
  const { notifications, addNotification } = useNotifications(5000);

  useEffect(() => {
    if (eventName) {
      listenToEvent(eventName, event => {
        addNotification(event.message);
      });
    }

    return () => {
      if (eventName) {
        removeEventListener(eventName);
      }
    };
  }, [eventName]);

  return (
    <>
      <section>
        {debugSocket && <ConnectionState isConnected={socketIsConnected} transport={socketTransport} />}

        <div style={styles.notificationContainer}>
          {notifications.map(notification => (
            <div key={notification.id} style={styles.notification}>
              {notification.message}
            </div>
          ))}
        </div>
      </section>

      {children}
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  notificationContainer: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: 9999,
  },
  notification: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    opacity: 1,
    transition: 'opacity 0.3s ease-in-out',
  },
};
