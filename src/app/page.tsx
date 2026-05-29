import Hero from './sections/Hero';
import Tratamientos from "./sections/Tratamientos";
import Resenas from "./sections/Resenas";
import AgendarDiagnostico from "./sections/AgendarDiagnostico";

export default function Home() {
  return (
    <>
      <Hero />
      <main id="main">
        <Tratamientos />
        <Resenas />
        <AgendarDiagnostico />
      </main>
    </>
  );
}
