import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'glightbox/dist/css/glightbox.css';

//set the font
import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import TopBar from './components/TopBar';
import Header from './components/Header';
import BackToTopBtn from './components/BackToTopBtn';

//definir constante para tipo de letra, para reusarla rápido
const josefin = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin",
  weight: ["200", "300", "400", "500"],
  display: "swap",
});

//editamos metadatos
export const metadata: Metadata = {
  title: "Nucleo Spa",
  description: "Faciales de lujo en Ciudad de México",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //children is going to be anything you build inside that page
  return (
    <html lang="es">
      <body className={`${josefin.variable} ${josefin.variable}`}>
        <TopBar/>
        <Header/>
        {children}
        <BackToTopBtn/>
      </body>
      
      </html>
  );
}
