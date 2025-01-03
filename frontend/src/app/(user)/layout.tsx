import "./user.css";
import { AuthProvider } from "@/app/_lib/hooks/useAuth";
import UserNavBar from "@/app/_ui/components/UserNavBar/UserNavBar";
import { SocketProvider } from "@/app/_lib/hooks/useSocket";
import { SocketDisplay } from "@/app/_ui/containers/SocketDisplay";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <UserNavBar />
      <main>
        <SocketProvider>
          <SocketDisplay>
            {children}
          </SocketDisplay>
        </SocketProvider>
      </main>
    </AuthProvider>
  );
}
