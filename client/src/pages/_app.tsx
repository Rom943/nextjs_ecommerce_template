import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

export default function App({ Component, pageProps }: AppProps) {

  const {defualtLayout,page} = pageProps;

  return<>
  <div style={{height:"100vh"}}>
  <Header defualtLayout={defualtLayout}  header={page.header} />
  <Component {...pageProps} />
  <Footer layoutName={defualtLayout} pageName={page} />
  </div>
  </> ;
}
