"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/_lib/hooks/useAuth";
import Link from "next/link";
import { Role } from "@/app/_lib/utils/roles";
import Image from "next/image";
import './UserNavBar.css';

const StyledLink = ({ href, children, isActive = false }: { href: string; children: React.ReactNode; isActive?: boolean }) => (
  <Link href={href} className={isActive ? "active-link" : "link"}>
    {children}
  </Link>
);

const UserNavBar = () => {
  const { logout, user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderRoleBasedLinks = () => {
    if (!user) return null;

    const LINKS = {
      [Role.ADMIN]: (
        <>
          <StyledLink href="/admin" isActive={pathname === "/admin"}>
            Dashboard
          </StyledLink>
          <StyledLink href="/admin/requests-history" isActive={pathname === "/admin/requests-history"}>
            Historial
          </StyledLink>
        </>
      ),
      [Role.TRAINER]: (
        <>
          <StyledLink href="/trainer" isActive={pathname === "/trainer"}>
            Inicio
          </StyledLink>
          <StyledLink href="/trainer/my-medals" isActive={pathname === "/trainer/my-medals"}>
            Mis Medallas
          </StyledLink>
        </>
      ),
    };

    return LINKS[user.role] || null;
  };

  return (
    <nav className="navbar">
      <div className="navbar-header-mobile">
        <Image src="/pokemon-logo.svg" alt="Logo" width={100} height={50} priority />
        <button
          className="hamburger"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
      </div>

      <div className={`menu ${isMenuOpen ? "open" : ""}`}>
        <div className="links">{renderRoleBasedLinks()}</div>

        <Image hidden className="navbar-logo-desktop" src="/pokemon-logo.svg" alt="Logo" width={100} height={50} priority />

        <div className="auth">
          {isAuthenticated ? (
            <button className="button-gradient" onClick={logout}>
              Cerrar sesión
            </button>
          ) : (
            <>
              <StyledLink href="/login">Inicia sesión</StyledLink>
              <StyledLink href="/register">Regístrate</StyledLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserNavBar;

