import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { EASE, VIEWPORT, fadeUp, staggerContainer, staggerItem } from "../lib/animations";

type EnquiryType = "" | "edi" | "ai-data-cloud" | "talent" | "other";

// ─── Live social-proof ticker ─────────────────────────────────────────────────
function SocialProofTicker() {
  const proofs = [
    "A global freight operator — live 5+ years",
    "99.04% EDI satisfaction rate across multi-BU clients",
    "45-day Sterling upgrade — half the industry norm",
    "Zero critical outages across managed accounts in FY2020",
    "9/10 client ratings across multiple business units",
    "99.1% transaction success on proprietary EDI engine",
  ];
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const id = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(i => (i + 1) % proofs.length); setVis(true); }, 260);
    }, 3000);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.div className="inline-flex items-center gap-2.5 border border-[#0B1F3A]/10 rounded-full px-4 py-2"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}>
      <motion.span className="w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0"
        animate={{ boxShadow: ["0 0 0 0px rgba(16,185,129,.5)","0 0 0 4px rgba(16,185,129,0)","0 0 0 0px rgba(16,185,129,.5)"] }}
        transition={{ duration: 1.8, repeat: Infinity }} />
      <span className="text-[11px] text-[#475569]" style={{ opacity: vis ? 1 : 0, transition: "opacity 0.22s" }}>
        {proofs[idx]}
      </span>
    </motion.div>
  );
}

// ─── Animated form field wrapper ──────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div className="space-y-1.5"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}>
      <label className="text-xs text-[#0B1F3A]/55 font-medium">{label}</label>
      {children}
    </motion.div>
  );
}

// ─── CTA option card with cursor glow ─────────────────────────────────────────
function CTACard({ label, desc }: { label: string; desc: string }) {
  const [hovered, setHovered] = useState(false);
  const glowX = useMotionValue(50), glowY = useMotionValue(50), glowOp = useMotionValue(0);
  const glowBg = useTransform([glowX, glowY], ([x, y]) =>
    `radial-gradient(ellipse at ${x}% ${y}%, rgba(26,115,232,0.05) 0%, transparent 65%)`);
  const shimX = useMotionValue(-100);
  const shimT = useTransform(shimX, v => `${v}%`);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    glowX.set(((e.clientX - r.left) / r.width) * 100);
    glowY.set(((e.clientY - r.top)  / r.height) * 100);
    animate(glowOp, 1, { duration: 0.25 });
  };
  const onEnter = () => {
    setHovered(true);
    shimX.set(-100); animate(shimX, 200, { duration: 0.5, ease: "easeInOut" });
  };
  const onLeave = () => { setHovered(false); animate(glowOp, 0, { duration: 0.3 }); };

  return (
    <motion.div variants={staggerItem}
      className="border border-[#0B1F3A]/10 rounded-lg p-5 relative overflow-hidden cursor-pointer"
      whileHover={{ y: -2, borderColor: "rgba(26,115,232,0.3)", boxShadow: "0 6px 22px rgba(26,115,232,0.1)", transition: { duration: 0.18, ease: EASE } }}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ opacity: glowOp, background: glowBg }} />
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left: 0, width: "55%", height: 1, background: "linear-gradient(90deg,transparent,rgba(26,115,232,0.4),transparent)", x: shimT }} />
      <motion.div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(26,115,232,0.35),transparent)" }}
        animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }} />
      <div className="flex items-start justify-between gap-3 relative">
        <div>
          <motion.div className="text-sm font-medium mb-1"
            animate={{ color: hovered ? "#1A73E8" : "#0B1F3A" }} transition={{ duration: 0.2 }}>
            {label}
          </motion.div>
          <div className="text-xs text-[#475569] leading-relaxed">{desc}</div>
        </div>
        <motion.span className="text-[#1A73E8]/40 text-sm flex-shrink-0 mt-0.5"
          animate={{ x: hovered ? 3 : 0, color: hovered ? "rgba(26,115,232,0.9)" : "rgba(26,115,232,0.4)" }}
          transition={{ duration: 0.18 }}>→</motion.span>
      </div>
      <motion.div className="h-px bg-[#1A73E8] origin-left mt-3"
        animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }} />
    </motion.div>
  );
}

// ─── EDI health assessment panel ─────────────────────────────────────────────
function AssessmentPanel() {
  const [hovered, setHovered] = useState(false);
  const items = [
    "Senior architect — not a sales call",
    "Clear, honest summary of your estate",
    "What is at risk and what to prioritise",
    "No commitment, no cost",
  ];
  return (
    <motion.div
      className="border border-[#0B1F3A]/10 rounded-xl p-7 relative overflow-hidden cursor-default"
      style={{ background: "rgba(26,115,232,0.02)" }}
      whileHover={{ borderColor: "rgba(26,115,232,0.3)", boxShadow: "0 8px 32px rgba(26,115,232,0.08)", transition: { duration: 0.2 } }}
      variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* shimmer on enter */}
      <motion.div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(26,115,232,0.35),transparent)" }}
        animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }} />

      {/* label + title */}
      <p className="text-[9px] text-[#1A73E8] uppercase tracking-widest mb-3">The EDI Health Assessment</p>
      <h3 className="text-base font-medium text-[#0B1F3A] mb-3">
        A structured, no-obligation review of your EDI estate.
      </h3>
      <p className="text-sm text-[#475569] leading-relaxed mb-5">
        A senior architect reviews your current integration setup, platforms and pain points — and gives you a clear, honest summary of what is working, what is at risk, and what to prioritise.
      </p>

      {/* animated checklist */}
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <motion.div key={item} className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.35, delay: i * 0.07, ease: EASE }}>
            <motion.div className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0"
              whileInView={{ background: "#1A73E8", borderColor: "#1A73E8" }}
              viewport={VIEWPORT}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.07 }}>
              <motion.span className="text-white text-[8px] font-bold"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.2, delay: 0.3 + i * 0.07 }}>✓</motion.span>
            </motion.div>
            <span className="text-xs text-[#475569]">{item}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Animated success state ───────────────────────────────────────────────────
function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div className="border border-[#0B1F3A]/10 rounded-xl p-12 text-center space-y-5"
      initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: EASE }}>
      {/* animated check circle */}
      <motion.div className="w-14 h-14 rounded-full bg-[#1A73E8] flex items-center justify-center mx-auto"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}>
        <motion.svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}>
          <motion.path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }} />
        </motion.svg>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }}>
        <h2 className="text-xl font-medium text-[#0B1F3A] mb-2">Enquiry received.</h2>
        <p className="text-sm text-[#475569] leading-relaxed max-w-xs mx-auto">
          A senior specialist will review your situation and get back to you within one business day.
        </p>
      </motion.div>
      {/* live confirmation detail */}
      <motion.div className="inline-flex items-center gap-2 text-[11px] text-[#475569] border border-[#0B1F3A]/10 rounded-full px-3 py-1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.4 }}>
        <motion.span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"
          animate={{ boxShadow: ["0 0 0 0px rgba(16,185,129,.5)","0 0 0 4px rgba(16,185,129,0)","0 0 0 0px rgba(16,185,129,.5)"] }}
          transition={{ duration: 1.8, repeat: Infinity }} />
        Response time: within 1 business day
      </motion.div>
      <button onClick={onReset}
        className="block text-xs text-[#1A73E8]/70 underline underline-offset-4 hover:text-[#1A73E8] transition-colors mx-auto mt-2">
        Send another enquiry
      </button>
    </motion.div>
  );
}

// ─── Contact form ─────────────────────────────────────────────────────────────
function ContactForm({ onSubmit }: { onSubmit: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", enquiry: "" as EnquiryType, message: "" });
  const [focused, setFocused] = useState<string | null>(null);

  const inputCls = (field: string) =>
    `w-full border rounded-md px-3 py-2.5 text-sm text-[#0B1F3A] placeholder:text-[#0B1F3A]/25 focus:outline-none transition-all bg-white ${
      focused === field ? "border-[#1A73E8]/60 shadow-[0_0_0_3px_rgba(26,115,232,0.1)]" : "border-[#0B1F3A]/18 hover:border-[#1A73E8]/40"
    }`;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name">
          <input required type="text" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
            className={inputCls("name")} placeholder="Your name" />
        </Field>
        <Field label="Company">
          <input required type="text" value={form.company}
            onChange={e => setForm({ ...form, company: e.target.value })}
            onFocus={() => setFocused("company")} onBlur={() => setFocused(null)}
            className={inputCls("company")} placeholder="Your company" />
        </Field>
      </div>
      <Field label="Work email">
        <input required type="email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
          className={inputCls("email")} placeholder="you@company.com" />
      </Field>
      <Field label="What do you need?">
        <select required value={form.enquiry}
          onChange={e => setForm({ ...form, enquiry: e.target.value as EnquiryType })}
          onFocus={() => setFocused("enquiry")} onBlur={() => setFocused(null)}
          className={inputCls("enquiry") + " appearance-none cursor-pointer"}>
          <option value="" disabled>Select an option</option>
          <option value="edi">EDI / B2B Integration</option>
          <option value="ai-data-cloud">AI, data, or cloud</option>
          <option value="talent">Talent & resourcing</option>
          <option value="other">Something else</option>
        </select>
      </Field>
      <Field label="How can we help?">
        <textarea rows={5} value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
          className={inputCls("message") + " resize-none"}
          placeholder="Tell us about your situation — what you're trying to connect, what's broken, or what you need to move faster." />
      </Field>
      <div className="space-y-3 pt-1">
        <motion.button type="submit"
          className="w-full bg-[#1A73E8] text-white py-3 text-sm rounded-md font-medium relative overflow-hidden"
          whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(26,115,232,0.28)" }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.15, ease: EASE }}>
          <motion.span className="absolute inset-0 bg-white/[0.08]" style={{ opacity: 0 }}
            whileHover={{ opacity: 1 }} transition={{ duration: 0.2 }} />
          Send enquiry
        </motion.button>
        <p className="text-xs text-[#0B1F3A]/35 text-center">
          We'll only use your details to respond to your enquiry. No newsletters unless you ask.
        </p>
      </div>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-40 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl space-y-6">
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>
              Contact
            </motion.p>
            <motion.h1 className="text-5xl md:text-6xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}>
              Let's talk about <span className="text-[#1A73E8]">what you need to connect.</span>
            </motion.h1>
            <motion.p className="text-lg text-[#475569] leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
              Tell us a little about your situation and the right specialist will get back to you — usually within one business day.
            </motion.p>
            {/* social proof ticker */}
            <SocialProofTicker />
          </div>
        </div>
      </section>

      {/* ── Form + right panel ── */}
      <section className="py-24 px-4 border-t border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">

          {/* ── LEFT: form ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}>
            {submitted
              ? <SuccessState onReset={() => setSubmitted(false)} />
              : <ContactForm onSubmit={() => setSubmitted(true)} />}
          </motion.div>

          {/* ── RIGHT: context panels ── */}
          <motion.div className="space-y-8"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}>

            {/* Not sure where to start */}
            <div>
              <p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-5">Not sure where to start?</p>
              <motion.div className="space-y-3"
                variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
                {[
                  { label: "Book an EDI health assessment",    desc: "A senior architect reviews your integration estate — no obligation, no cost." },
                  { label: "Talk to an integration architect", desc: "A direct conversation about your specific situation with someone who knows the subject." },
                  { label: "Download a guide",                 desc: "Start with our EDI modernisation guide if you are still researching your options." },
                ].map(cta => <CTACard key={cta.label} label={cta.label} desc={cta.desc} />)}
              </motion.div>
            </div>

            {/* Contact details */}
            <motion.div variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              <p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4">Contact details</p>
              <div className="space-y-2 text-sm text-[#475569]">
                {[
                  { label: "Email",  val: "sales@exceptionalsolutions.in" },
                  { label: "Phone",  val: "+91 8074960598" },
                  { label: "Web",    val: "exceptionalsolutions.in" },
                ].map(d => (
                  <div key={d.label} className="flex items-center gap-3">
                    <span className="text-[9px] uppercase tracking-wide text-[#0B1F3A]/35 w-10 flex-shrink-0">{d.label}</span>
                    <span>{d.val}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* EDI health assessment panel */}
            <AssessmentPanel />
          </motion.div>
        </div>
      </section>
    </>
  );
}