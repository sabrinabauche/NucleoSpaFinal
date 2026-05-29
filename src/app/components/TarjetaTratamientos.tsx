'use client';

import { useRouter } from "next/navigation";
import "./tarjetaTratamientos.css";

type TreatmentCardProps = {
  image: string;
  title: string;
  description: string;
  slug: string;
};

export default function TreatmentCard({ image, title, description, slug }: TreatmentCardProps) {
  const router = useRouter();

  return (
    <div
      className="treatment-card"
      onClick={() => router.push(`/tratamientos/${slug}`)}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="overlay">
        <div className="content">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}
