import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

export default function App({ Component, pageProps }: AppProps) {

  const {layoutName} = pageProps;

  return<>
  <div style={{height:"100vh"}}>
  <Header layoutName={layoutName} pageName="default" />
  <Component {...pageProps} />
  <Footer layoutName={layoutName} pageName="default"/>
  </div>
  </> ;
}
