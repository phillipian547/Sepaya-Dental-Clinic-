
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/scss/bootstrap.scss';
import '../styles/global.scss';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { SessionProvider } from "next-auth/react";
import AuthGuard from '../guards/authguard';

export default function App({ Component, pageProps }) {

  const Layout = Component.layout || (({ children }) => <>{children}</>);
  return (
    <SessionProvider session={pageProps.session}>
      <AuthGuard>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer></ToastContainer>
        </Layout>
      </AuthGuard>
    </SessionProvider>
  )
}
