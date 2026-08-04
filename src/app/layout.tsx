import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'glightbox/dist/css/glightbox.css';

import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";

import Providers from './components/Providers';
import TopBar from './components/TopBar';
import Header from './components/Header';
import BackToTopBtn from './components/BackToTopBtn';
import WhatsAppBtn from './components/WhatsAppBtn';
import BookingModal from './components/BookingModal';
import ScrollReveal from './components/ScrollReveal';

const josefin = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin",
  weight: ["200", "300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nucleo Spa",
  description: "Faciales de lujo en Ciudad de México",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={josefin.variable}>
        <Providers>
          <TopBar />
          <Header />
          {children}
          <WhatsAppBtn />
          <BackToTopBtn />
          <BookingModal />
          <ScrollReveal />
        </Providers>
      </body>
    </html>
  );
}
