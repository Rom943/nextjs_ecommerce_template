import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin_');
  
  // Only destructure if page exists (for non-admin routes)
  const {defualtLayout, page} = pageProps || {};

  return <>
    <div style={{
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column"
    }}>
      {/* Only show Header and Footer on non-admin pages */}
      {!isAdminPage && page?.header && (
        <Header defualtLayout={defualtLayout} header={page.header} />
      )}
      
      <main style={{flex: "1 0 auto"}}>
        <Component {...pageProps} />
      </main>
      
      {!isAdminPage && page?.footer && (
        <Footer defaultLayout={defualtLayout} footer={{...page.footer, position: undefined}} />
      )}
    </div>
  </>;
}
