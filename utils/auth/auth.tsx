import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface AuthProps {
    children: ReactNode;
  }
  

const Auth = ({ children }: AuthProps) => {
    const router = useRouter()
    const { data: session, status } = useSession();
    const isAuthenticated = !!session;
  
    if (status === 'loading') {
      return <div>Loading...</div>;
    }
  
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion
      router.push('/login')
      return <div>Vous devez être connecté pour accéder à cette page.</div>;
    }
  
    return <>{children}</>;
  }
  export default Auth