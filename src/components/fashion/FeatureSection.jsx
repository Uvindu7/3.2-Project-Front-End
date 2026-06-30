import React from "react";

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
    <section className="w-full bg-white px-8 py-12 lg:px-20 lg:py-16">

      <div className="mb-[35px]">

        <h2 className="text-[24px] lg:text-[28px] text-[#111] mb-[12px] font-bold">Interactive Realism</h2>

        <p className="text-[#666] text-[13px] lg:text-[14px] leading-[1.7] max-w-[720px]">
          Experience fashion beyond static images with physically
          accurate rendering and immersive interaction.
        </p>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px]">

        {cards.map((item, index) => (

          <div className="bg-white" key={index}>

            <img
              src={item.image}
              alt={item.title}
              className="w-full h-[240px] md:h-[300px] lg:h-[260px] object-cover block"
            />

            <h3 className="mt-[18px] text-[18px] text-[#111]">{item.title}</h3>

            <p className="mt-[10px] text-[14px] text-[#666] leading-[1.7]">{item.text}</p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default FeatureSection;