import TreatmentDetail from "@/app/components/TreatmentDetail";
import { treatments } from "@/app/data/treatments";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const treatment = treatments.find((t) => t.slug === slug);

  if (!treatment) {
    return <div>Tratamiento no encontrado</div>;
  }

  return <TreatmentDetail {...treatment} />;
}
