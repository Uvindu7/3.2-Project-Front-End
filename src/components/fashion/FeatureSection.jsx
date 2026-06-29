import React from "react";
import "./FeatureSection.css";

import texture from "../../assets/images/texture.jpg";
import model from "../../assets/images/model.jpg";
import hoodie from "../../assets/images/hoodie.png";

const cards = [
  {
    image: texture,
    title: "Texture Fidelity",
    text: "Every thread, fiber and material property is reproduced with exceptional realism."
  },
  {
    image: model,
    title: "360° Interaction",
    text: "Rotate garments freely and inspect every angle before purchasing."
  },
  {
    image: hoodie,
    title: "Digital Twin Fit",
    text: "See realistic garment behaviour with accurate digital fitting simulation."
  }
];

function FeatureSection() {
  return (
    <section className="feature-section">

      <div className="feature-top">

        <h2>Interactive Realism</h2>

        <p>
          Experience fashion beyond static images with physically
          accurate rendering and immersive interaction.
        </p>

      </div>

      <div className="feature-grid">

        {cards.map((item, index) => (

          <div className="feature-card" key={index}>

            <img
              src={item.image}
              alt={item.title}
            />

            <h3>{item.title}</h3>

            <p>{item.text}</p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default FeatureSection;