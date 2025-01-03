export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section id="admin-dashboard" className="section">
      <div className="content">
        {children}
      </div>
    </section>
  );
}
