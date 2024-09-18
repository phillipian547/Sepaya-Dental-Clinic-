import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";

const AuthGuard = ({children}) => {

  const { data: session, status } = useSession();

  const router = useRouter();
  const { pathname } = router;

  // console.log(status);
  // console.log(pathname);

  if(status === 'authenticated' && pathname === '/login') {
    router.push('/admin');
  } else if(status === 'authenticated' && pathname === '/') {
    router.push('/admin');
  } else {
    return children;
  }

};

export default AuthGuard;


