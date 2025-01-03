"use client"
import React from 'react';

export function ConnectionState({ isConnected, transport }: Readonly<{ isConnected: boolean; transport: string  }>) {
  return <div>
    <p>State: {isConnected ? 'Conectado 🟢' : 'Desconectado 🔴'}</p>
    <p>Transport: {transport}</p>
  </div>;
}