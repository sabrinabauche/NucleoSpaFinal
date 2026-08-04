import Hero from './sections/Hero';
import Tratamientos from "./sections/Tratamientos";
import Resenas from "./sections/Resenas";
import Membresias from "./sections/Membresias";
import AgendarDiagnostico from "./sections/AgendarDiagnostico";

export default function Home() {
  return (
    <>
      <Hero />
      <main id="main">
        <Tratamientos />
        <Resenas />
        <Membresias />
        <AgendarDiagnostico />
      </main>
    </>
  );
}
