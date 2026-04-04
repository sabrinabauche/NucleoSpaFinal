import React from "react";
import "./tarjetaTratamientos.css";

type TreatmentCardProps = {
  image: string;
  title: string;
  description: string;
};

export default function TreatmentCard({
  image,
  title,
  description,
}: TreatmentCardProps) {
  return (
    <div
      className="treatment-card"
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