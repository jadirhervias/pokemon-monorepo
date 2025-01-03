"use client"
import { usePathname, useRouter } from 'next/navigation';

const ErrorPage = ({ error }: { error: Error }) => {
  const router = useRouter();
  const pathname = usePathname();
  const fallbackAction = pathname === '/login'
    ? () => window.location.reload()
    : () => router.push('/');

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>¡Vaya! Algo salió mal.</h1>
        <p style={styles.message}>{error.message}</p>
        
        <button 
          onClick={() => fallbackAction()} 
          style={styles.button}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: '4rem',
  },
  content: {
    padding: '2rem',
    borderRadius: '10px',
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '100%',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#495057',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1.1rem',
    color: '#868e96',
    marginBottom: '2rem',
  },
  button: {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default ErrorPage;
