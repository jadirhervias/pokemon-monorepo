import Image from "next/image";
import "./auth.css";

export default function GuestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header style={{ display: "flex", justifyContent: "center", paddingTop: "1rem" }}> 
        <Image src="/pokemon-logo.svg" alt="Logo" width={200} height={100} priority />
      </header>
      <main>
        {children}
      </main>
    </>
  );
}
