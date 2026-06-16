import { motion } from "motion/react";
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

// Duplicate for seamless infinite loop
const doubled = [...logos, ...logos];

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