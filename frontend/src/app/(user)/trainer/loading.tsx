"use client";
import React from "react";
import Image from "next/image";

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = "Cargando..." }) => (
  <div style={styles.wrapper}>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>

    <div style={styles.iconWrapper}>
    <Image
        src="/pokeball.svg"
        alt="loading..."
        width={50}
        height={50}
      />
    </div>
    <div style={styles.message}>{message}</div>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
  },
  iconWrapper: {
    animation: "spin 1.5s linear infinite",
    marginBottom: "1rem",
  },
  message: {
    fontSize: "1.2rem",
    color: "#007bff",
    fontWeight: 500,
    textAlign: "center",
  },
};

export default Loading;