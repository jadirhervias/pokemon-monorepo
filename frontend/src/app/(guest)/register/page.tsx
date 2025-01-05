"use client"
import { useState } from 'react';
import { Role } from '@/app/_lib/utils/roles';
import { register } from '@/app/_actions/register';
import Link from 'next/link';

const RegisterPage = () => {
  const [, setSelectedRole] = useState<Role>(Role.TRAINER);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="auth-container">
      <form className="auth-form" action={register}>
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
        <select
          name="role"
          onChange={(e) => setSelectedRole(e.target.value as Role)}
          className="auth-select"
          defaultValue=""
        >
          <option value="">Selecciona un rol</option>
          <option value={Role.TRAINER}>Entrenador</option>
          <option value={Role.ADMIN}>Admin</option>
        </select>
        <button type="submit" className="auth-button">Crear cuenta y acceder</button>
      </form>

      <div style={styles.loginLinkContainer}>
        <span>¿Ya tienes cuenta? </span>
        <Link href="/login" style={styles.loginLink}>Inicia sesión aquí</Link>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  loginLinkContainer: {
    marginTop: '1rem',
    textAlign: 'center',
  },
  loginLink: {
    textDecoration: 'underline',
    color: '#007bff',
    fontWeight: 500,
  },
};

export default RegisterPage;
