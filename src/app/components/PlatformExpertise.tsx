import { motion } from "motion/react";
import {  fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

// const platforms = ["IBM Sterling", "Cleo", "MuleSoft", "Boomi", "Apigee", "Axway B2Bi"];
// const standards = ["ANSI X12", "EDIFACT", "AS2", "API Integration"];
const logos = [
  { src: opentext,      alt: "OpenText GXS"          },
  { src: cleo,          alt: "Cleo"                   },
  { src: seeburger,     alt: "Seeburger"              },
  { src: axway,         alt: "Axway"                  },
  { src: ibmSterling,   alt: "IBM Sterling"           },
  { src: ibmInfosphere, alt: "IBM Infosphere"         },
  { src: informatica,   alt: "Informatica"            },
  { src: powerAutomate, alt: "Power Automate"         },
  { src: uipath,        alt: "UiPath"                 },
  { src: sterlingFG,    alt: "Sterling File Gateway"  },
  { src: mirth,         alt: "Mirth"                  },
  { src: mulesoft,      alt: "MuleSoft"               },
  { src: apigee,        alt: "Apigee"                 },
  { src: mapforce,      alt: "Altova MapForce"        },
  { src: liaison,       alt: "Liaison"                },
];


const doubled = [...logos, ...logos];

export function PlatformExpertise() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2 className="text-4xl md:text-5xl font-normal text-[#0B1F3A] mb-4 tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Platform-Agnostic.
            <br/><span className="text-[#1A73E8]">Enterprise-Ready.”</span>
          </motion.h2>
          <motion.p className="text-base text-[#475569]"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            We're platform-agnostic experts. Whatever technology you use, we've mastered it.
          </motion.p>
        </div>
 <motion.section
      
      variants={fadeIn}
      custom={0}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}>

      {/* fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background:"linear-gradient(to right,white,transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background:"linear-gradient(to left,white,transparent)" }} />

      {/* marquee track */}
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {doubled.map((logo, i) => (
          <div key={i} className="flex items-center flex-shrink-0 mx-8">
            <img
              src={logo.src}
              alt={logo.alt}
              style={{
                height: 28,
                width: "auto",
                maxWidth: 120,
                objectFit: "contain",
                display: "block",
                // filter: "grayscale(100%) opacity(0.90)",
              }}
            />
          </div>
        ))}
      </div>
    </motion.section>
        {/* <motion.div className="bg-white border border-[#0B1F3A]/10 rounded-lg p-8"
          variants={fadeUp} custom={0.15} initial="hidden" whileInView="visible" viewport={VIEWPORT}>

          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-wide text-[#1A73E8] mb-6 text-center">Integration Platforms</h3>
            <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              {platforms.map((platform) => (
                <motion.div key={platform} variants={staggerItem} className="text-center"
                  whileHover={{ scale: 1.04, transition: { duration: 0.18, ease: EASE } }}>
                  <div className="bg-[#1A73E8]/5 border border-[#1A73E8]/10 rounded-md p-4 hover:bg-[#1A73E8]/[0.1] hover:border-[#1A73E8]/30 transition-colors cursor-default">
                    <div className="text-xs font-medium text-[#0B1F3A]">{platform}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="pt-10 border-t border-[#0B1F3A]/10">
            <h3 className="text-xs uppercase tracking-wide text-[#1A73E8] mb-6 text-center">Integration Standards</h3>
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4"
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              {standards.map((standard) => (
                <motion.div key={standard} variants={staggerItem} className="text-center">
                  <div className="bg-[#1A73E8]/5 border border-[#1A73E8]/10 rounded-md p-4">
                    <div className="text-xs font-medium text-[#0B1F3A]">{standard}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </motion.div> */}
      </div>
    </section>
  );
}
import { EASE, VIEWPORT, fadeIn } from "../lib/animations";

// All 15 logos mapped to their filenames in src/imports/
// Copy all sm_img_*.* files into your src/imports/ folder
import opentext    from "../../imports/sm_img_24.png";
import cleo        from "../../imports/sm_img_25.png";
import seeburger   from "../../imports/sm_img_26.png";
import axway       from "../../imports/sm_img_27.png";
import ibmSterling from "../../imports/sm_img_28.png";
import ibmInfosphere  from "../../imports/sm_img_14.jpg";
import informatica    from "../../imports/sm_img_15.png";
import powerAutomate  from "../../imports/sm_img_16.png";
import uipath         from "../../imports/sm_img_17.png";
import sterlingFG     from "../../imports/sm_img_18.png";
import mirth          from "../../imports/sm_img_19.png";
import mulesoft       from "../../imports/sm_img_20.png";
import apigee         from "../../imports/sm_img_21.png";
import mapforce       from "../../imports/sm_img_22.png";
import liaison        from "../../imports/sm_img_23.png";



// Duplicate for seamless infinite loop

export function CredibilityStrip() {
  return (
    <motion.section
      className="py-10 border-y border-black/10 overflow-hidden relative"
      variants={fadeIn}
      custom={0}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}>

      {/* fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background:"linear-gradient(to right,white,transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background:"linear-gradient(to left,white,transparent)" }} />

      {/* marquee track */}
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {doubled.map((logo, i) => (
          <div key={i} className="flex items-center flex-shrink-0 mx-8">
            <img
              src={logo.src}
              alt={logo.alt}
              style={{
                height: 28,
                width: "auto",
                maxWidth: 120,
                objectFit: "contain",
                display: "block",
                // filter: "grayscale(100%) opacity(0.90)",
              }}
            />
          </div>
        ))}
      </div>
    </motion.section>
  );
}