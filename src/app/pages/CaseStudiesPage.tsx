import { motion } from "motion/react";
import { Link } from "react-router";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

export function CaseStudiesPage() {
  return (
    <>
      <section className="pt-40 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl space-y-6">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>
              Case Studies
            </motion.p>
            <motion.h1 className="text-5xl md:text-6xl font-normal text-black leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}>
              Real engagements. Measured results.
            </motion.h1>
            <motion.p className="text-lg text-black/60 leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
              We would rather show you one problem we genuinely solved than a wall of logos. Here is our work, with the outcomes that mattered to the business.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 border-t border-black/10">
        <div className="max-w-6xl mx-auto">
          <motion.div className="border border-black/10 rounded-lg overflow-hidden"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <div className="grid md:grid-cols-2">
              <div className="p-10 md:p-14 space-y-6">
                <div className="space-y-1">
                  <p className="text-xs text-black/40 uppercase tracking-wide">EDI & B2B Integration</p>
                  <h2 className="text-3xl font-normal text-black leading-tight tracking-tight">
                    [INSERT outcome-led title — e.g. "Cutting EDI partner onboarding from six weeks to five days"]
                  </h2>
                </div>
                <div className="space-y-4 text-sm text-black/60 leading-relaxed">
                  <div><span className="font-medium text-black">Client: </span>[INSERT client name if permitted, otherwise category — e.g. "A North American third-party logistics provider"]</div>
                  <div><span className="font-medium text-black">Challenge: </span>[INSERT the business problem — e.g. slow partner onboarding was delaying revenue recognition and straining the integration team.]</div>
                  <div><span className="font-medium text-black">What we did: </span>[INSERT the approach, platforms used, and delivery model.]</div>
                </div>
                <div className="border-t border-black/10 pt-6 space-y-3">
                  <p className="text-xs text-black/40 uppercase tracking-wide">The outcome</p>
                  <p className="text-base text-black font-medium">[INSERT the headline metric — e.g. "Partner onboarding cut from six weeks to five days"]</p>
                  <p className="text-sm text-black/60">[INSERT a second measurable result — e.g. "Transaction error rate reduced by 73%"]</p>
                </div>
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
                  <Link to="/contact" className="inline-block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors">
                    Discuss references for your industry
                  </Link>
                </motion.div>
              </div>
              <div className="bg-black/[0.02] border-l border-black/10 p-10 md:p-14 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-black/40 uppercase tracking-wide mb-6">Key outcomes</p>
                  <div className="space-y-6">
                    {[
                      { metric: "[X]×", label: "Faster partner onboarding" },
                      { metric: "[X]%", label: "Reduction in transaction errors" },
                      { metric: "Zero", label: "Disruption to live trading during migration" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="text-3xl font-light text-black">{item.metric}</div>
                        <div className="text-sm text-black/40 mt-1">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-10 pt-6 border-t border-black/10">
                  <p className="text-xs text-black/40 italic">"[INSERT client quote if available]" — [INSERT name and title]</p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.p className="text-sm text-black/40 mt-8 max-w-2xl"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            We are publishing more case studies as clients approve them. To discuss relevant references for your industry, get in touch.
          </motion.p>
        </div>
      </section>

      <section className="py-24 px-4 bg-black/[0.02] border-t border-b border-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Our Experience
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Engagements across the industries where EDI matters most.
            </motion.h2>
          </div>
          <motion.div className="grid md:grid-cols-2 gap-6"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {[
              { industry: "Retail & CPG", desc: "High-volume partner networks, chargeback reduction, peak-season reliability." },
              { industry: "Logistics & Supply Chain", desc: "Multi-party data exchange, real-time visibility, carrier and partner integration." },
              { industry: "Manufacturing", desc: "Supplier and distributor integration, ERP connectivity, just-in-time supply chains." },
              { industry: "Healthcare", desc: "Secure payer-provider exchange, compliance, ANSI X12 healthcare transactions." },
            ].map((item) => (
              <motion.div key={item.industry} variants={staggerItem}
                className="border border-black/10 rounded-lg p-8 bg-white space-y-2 hover:border-black/20 transition-colors"
                whileHover={{ y: -4, transition: { duration: 0.2, ease: EASE } }}>
                <h3 className="text-base font-medium text-black">{item.industry}</h3>
                <p className="text-sm text-black/50">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.h2 className="text-4xl font-normal text-black tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Looking for references in your industry?
          </motion.h2>
          <motion.p className="text-base text-black/60 max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Get in touch and we will connect you with relevant references and discuss what we have delivered in your sector.
          </motion.p>
          <motion.div variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact" className="inline-block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors">
              Discuss references for your industry
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
