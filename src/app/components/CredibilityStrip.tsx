import { motion } from "motion/react";
import { EASE, VIEWPORT, fadeIn } from "../lib/animations";

// ─── Logo definitions ─────────────────────────────────────────────────────────
// src paths assume files are in /public/logos/ — copy the 3 uploaded files there:
//   public/logos/boomi.svg       (brand.svg)
//   public/logos/cleo.svg        (logo_cleo_blue_0.svg)
//   public/logos/mulesoft.png    (MuleSoft-Logo_wine.png)
// IBM Sterling, Apigee, Axway use text fallback (no logo file supplied)

const logos: { src?: string; text?: string; alt: string; w: number }[] = [
  { src: "/logos/boomi.svg",    alt: "Boomi",          w: 72  },
  { src: "/logos/cleo.svg",     alt: "Cleo",           w: 68  },
  { src: "/logos/mulesoft.png", alt: "MuleSoft",       w: 108 },
  { text: "IBM Sterling",       alt: "IBM Sterling",   w: 0   },
  { text: "Apigee",             alt: "Apigee",         w: 0   },
  { text: "Axway B2Bi",         alt: "Axway B2Bi",     w: 0   },
  { text: "ISO 27001",          alt: "ISO 27001",      w: 0   },
  { text: "SOC 2-class",        alt: "SOC 2-class",    w: 0   },
  { text: "54 Specialists",     alt: "54 Specialists", w: 0   },
  { text: "Since 2019",         alt: "Since 2019",     w: 0   },
];

// Duplicate for seamless loop
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

      {/* gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, white, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, white, transparent)" }} />

      {/* marquee track */}
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-3 mx-7 flex-shrink-0">
            {/* separator dot */}
            <span className="w-1 h-1 rounded-full bg-black/15 flex-shrink-0" />

            {item.src ? (
              // Logo image — greyscale so it stays on-brand black/white
              <img
                src={item.src}
                alt={item.alt}
                width={item.w}
                height={28}
                style={{
                  height: 22,
                  width: "auto",
                  filter: "grayscale(100%) opacity(0.45)",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            ) : (
              // Text fallback for platforms without a logo file
              <span className="text-sm text-black/38 font-normal tracking-wide">
                {item.text}
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  );
}