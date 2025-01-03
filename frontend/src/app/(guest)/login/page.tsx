"use client"
import { useState } from 'react';
import { login } from '@/app/_actions/login';
import Link from 'next/link';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="auth-container">
      <form className="auth-form" action={login}>
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        <button type="submit" className="auth-button">Inicia sesión</button>
      </form>

      <div style={styles.authRegister}>
        <span>¿No tienes cuenta? </span>
        <Link href="/register" style={styles.authRegisterLink}>Regístrate aquí</Link>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  authRegister: {
    marginTop: '1rem',
    textAlign: 'center',
  },
  authRegisterLink: {
    textDecoration: 'underline',
    color: '#007bff',
    fontWeight: 500,
  },
};

export default LoginPage;
