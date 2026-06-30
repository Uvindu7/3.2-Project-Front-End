import React from "react";

import hoodie from "../../assets/images/hoodie.png";

const Hero = () => {
  return (
    <section className="w-full min-h-[650px] grid grid-cols-1 lg:grid-cols-[1fr_420px] items-center gap-[70px] px-8 py-24 lg:px-20 lg:py-[120px] bg-white text-center lg:text-left">

      <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left">

        <p className="text-[#3977ff] text-[11px] font-semibold tracking-[2px] mb-[18px]">
          NEW COLLECTION
        </p>

        <h1 className="text-[32px] md:text-[42px] lg:text-[58px] leading-[1.05] font-bold text-[#111] mb-[25px]">
          Redefining the Physics of
          <br />
          Fashion.
        </h1>

        <p className="text-[#666] leading-[1.8] max-w-[560px] mb-[35px] text-[14px] md:text-[15px]">
          LIYARA offers unprecedented virtual realism through advanced
          garment simulation and interactive visualization.
          Experience every fold, texture and movement before making
          your purchase.
        </p>

        <button className="w-[170px] md:w-[180px] h-[50px] border-none bg-black text-white font-semibold tracking-[1px] cursor-pointer transition-all duration-300 hover:bg-[#222]">
          VIEW COLLECTION
        </button>

      </div>

      <div className="flex justify-center">

        <div className="w-full max-w-[380px] lg:w-[400px] h-[350px] lg:h-[400px] bg-[#2f3136] flex justify-center items-center">

          <img
            src={hoodie}
            alt="hoodie"
            className="w-[90%] object-contain"
          />

        </div>

      </div>

    </section>
  );
};

export default Hero;