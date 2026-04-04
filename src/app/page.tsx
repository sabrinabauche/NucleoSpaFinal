import Image from "next/image";
import styles from "./page.module.css";
import Hero from './sections/Hero';
import Tratamientos from "./sections/Tratamientos";

export default function Home() {
  return (
    <>
      <Hero/>
      <main id="main">
      <Tratamientos/>
      </main>
      </>
  );
}