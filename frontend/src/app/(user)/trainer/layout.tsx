import React from "react";

export default async function TrainerLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section id="pokemon-trainer" className="section">
      {children}
    </section>
  );
}
