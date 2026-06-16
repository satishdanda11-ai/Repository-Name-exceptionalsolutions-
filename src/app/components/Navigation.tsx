import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence, useScroll } from "motion/react";
import {
  ArrowLeftRight, Sparkles, BarChart2, Cloud, Code2, Users,
  ShoppingBag, Truck, Factory, Heart,
  Map, ShieldCheck, FileText, Link2,
  Building2, UserCheck, Briefcase,
  ChevronDown,
} from "lucide-react";
import logoSrc from "../../imports/logocolor.png";
import { EASE } from "../lib/animations";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const B = {
  primary50:  "#E8F3FE",
  primary100: "#D6E7FD",
  primary200: "#A1CFFB",
  primary500: "#1A73E8",
  primary600: "#155CC8",
  navy500:    "#0B1F3A",
};

interface DropdownItem { icon: React.ReactNode; label: string; desc: string; path: string; }
interface NavMenu { label: string; category: string; items: DropdownItem[]; path?: never; }
interface NavLink { label: string; path: string; category?: never; items?: never; }
type NavItem = NavMenu | NavLink;

// Icons in primary-500
const ICON_CLS = "w-4 h-4 flex-shrink-0 mt-0.5";
const iconStyle = { color: B.primary500 };

const navItems: NavItem[] = [
  {
    label: "Services", category: "SERVICES",
    items: [
      { icon: <ArrowLeftRight className={ICON_CLS} style={iconStyle} />, label: "EDI & B2B Integration", desc: "Assess, modernise and operate your EDI estate",         path: "/services/edi-b2b-integration" },
      { icon: <Sparkles      className={ICON_CLS} style={iconStyle} />, label: "AI Solutions",          desc: "Applied AI built on trusted, connected data",           path: "/services/ai-solutions" },
      { icon: <BarChart2     className={ICON_CLS} style={iconStyle} />, label: "Data & Analytics",      desc: "Turn connected enterprise data into decisions",         path: "/services/data-analytics" },
      { icon: <Cloud         className={ICON_CLS} style={iconStyle} />, label: "Cloud Services",        desc: "Cloud built for scale and reliability",                 path: "/services/cloud-services" },
      { icon: <Code2         className={ICON_CLS} style={iconStyle} />, label: "Digital Engineering",   desc: "Senior engineers building modern systems",             path: "/services/digital-engineering" },
      { icon: <Users         className={ICON_CLS} style={iconStyle} />, label: "Talent Solutions",      desc: "Domain specialists embedded in your team",             path: "/services/talent-solutions" },
    ],
  },
  {
    label: "Industries", category: "INDUSTRIES",
    items: [
      { icon: <Truck       className={ICON_CLS} style={iconStyle} />, label: "Logistics & Supply Chain", desc: "Every shipment depends on data that flows",                  path: "/industries/logistics-supply-chain" },
      { icon: <ShoppingBag className={ICON_CLS} style={iconStyle} />, label: "Retail & CPG",             desc: "High-volume partner networks, peak-season reliability",      path: "/industries/retail-cpg" },
      { icon: <Factory     className={ICON_CLS} style={iconStyle} />, label: "Manufacturing",            desc: "Connect the supply chain that keeps the line moving",        path: "/industries/manufacturing" },
      { icon: <Heart       className={ICON_CLS} style={iconStyle} />, label: "Healthcare",               desc: "Secure, compliant data exchange with no room for error",     path: "/industries/healthcare" },
    ],
  },
  {
    label: "Why Exceptional", category: "WHY EXCEPTIONAL",
    items: [
      { icon: <Map        className={ICON_CLS} style={iconStyle} />, label: "Our Approach",    desc: "A delivery approach built for zero surprises",         path: "/why/our-approach" },
      { icon: <ShieldCheck className={ICON_CLS} style={iconStyle} />, label: "Trust & Security", desc: "Built to clear enterprise due diligence",             path: "/why/trust-security" },
      { icon: <FileText   className={ICON_CLS} style={iconStyle} />, label: "Case Studies",    desc: "Real engagements, measured results",                   path: "/why/case-studies" },
      { icon: <Link2      className={ICON_CLS} style={iconStyle} />, label: "Partnerships",    desc: "Certified expertise across six enterprise platforms",   path: "/why/partnerships" },
    ],
  },
  { label: "Insights", path: "/insights" },
  {
    label: "Company", category: "COMPANY",
    items: [
      { icon: <Building2  className={ICON_CLS} style={iconStyle} />, label: "About Us",    desc: "Integration specialists, evolving with intent since 2019", path: "/company/about" },
      { icon: <UserCheck  className={ICON_CLS} style={iconStyle} />, label: "Leadership",  desc: "Senior people accountable for your success",               path: "/company/leadership" },
      { icon: <Briefcase  className={ICON_CLS} style={iconStyle} />, label: "Careers",     desc: "Do specialist work with people who take it seriously",      path: "/company/careers" },
    ],
  },
];

// ── Mega dropdown ─────────────────────────────────────────────────────────────
function MegaDropdown({ menu, onClose }: { menu: NavMenu; onClose: () => void }) {
  const half = Math.ceil(menu.items.length / 2);
  const cols = menu.items.length > 4 ? 2 : menu.items.length > 2 ? 2 : 1;
  const left = menu.items.slice(0, half);
  const right = menu.items.slice(half);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -6 }}
      transition={{ duration: 0.22, ease: EASE }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-xl shadow-lg overflow-hidden z-50"
      style={{ minWidth: cols === 2 ? 520 : 280, border: `1px solid ${B.primary100}` }}>

      {/* Category header — primary tint */}
      <div className="px-6 pt-5 pb-3" style={{ borderBottom: `1px solid ${B.primary100}` }}>
        <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: B.primary500 }}>
          {menu.category}
        </span>
      </div>

      <motion.div
        className={`p-3 ${cols === 2 ? "grid grid-cols-2 gap-x-2" : ""}`}
        variants={{ visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } }}
        initial="hidden"
        animate="visible">
        {cols === 2 ? (
          <>
            <div>{left.map((item) => <DropdownRow key={item.path} item={item} onClose={onClose} />)}</div>
            <div className="pl-2" style={{ borderLeft: `1px solid ${B.primary100}` }}>
              {right.map((item) => <DropdownRow key={item.path} item={item} onClose={onClose} />)}
            </div>
          </>
        ) : (
          menu.items.map((item) => <DropdownRow key={item.path} item={item} onClose={onClose} />)
        )}
      </motion.div>
    </motion.div>
  );
}

function DropdownRow({ item, onClose }: { item: DropdownItem; onClose: () => void }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, x: -6 }, visible: { opacity: 1, x: 0, transition: { duration: 0.22, ease: EASE } } }}>
      <Link to={item.path} onClick={onClose}
        className="flex items-start gap-3 px-3 py-3 rounded-lg transition-colors group"
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = B.primary50}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
        <motion.div className="mt-0.5 transition-transform group-hover:scale-110 duration-200">
          {item.icon}
        </motion.div>
        <div className="space-y-0.5 min-w-0">
          <div className="text-sm font-medium leading-tight flex items-center gap-1 transition-colors"
            style={{ color: B.navy500 }}>
            {item.label}
            <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 inline-block text-xs"
              style={{ color: B.primary500 }}>→</span>
          </div>
          <div className="text-xs text-black/40 leading-snug">{item.desc}</div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Navigation ────────────────────────────────────────────────────────────────
export function Navigation() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (y) => setScrolled(y > 20));
  }, [scrollY]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <motion.nav
      ref={navRef}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-white",
      ].join(" ")}
      style={{ borderBottom: `1px solid ${B.primary100}` }}>

      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0" onClick={() => setOpenMenu(null)}>
          <motion.img src={logoSrc} alt="Exceptional Solutions" className="h-8"
            whileHover={{ scale: 1.02 }} transition={{ duration: 0.2, ease: EASE }} />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.path ? (
                <Link to={item.path} onClick={() => setOpenMenu(null)}
                  className="px-3 py-2 text-sm rounded-lg flex items-center transition-colors"
                  style={{ color: "rgba(0,0,0,0.6)" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = B.navy500;
                    (e.currentTarget as HTMLElement).style.background = B.primary50;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = "rgba(0,0,0,0.6)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}>
                  {item.label}
                </Link>
              ) : (
                <button
                  onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                  className="px-3 py-2 text-sm rounded-lg flex items-center gap-1 transition-colors"
                  style={{
                    color: openMenu === item.label ? B.primary500 : "rgba(0,0,0,0.6)",
                    background: openMenu === item.label ? B.primary50 : "transparent",
                  }}
                  onMouseEnter={e => {
                    if (openMenu !== item.label) {
                      (e.currentTarget as HTMLElement).style.color = B.navy500;
                      (e.currentTarget as HTMLElement).style.background = B.primary50;
                    }
                  }}
                  onMouseLeave={e => {
                    if (openMenu !== item.label) {
                      (e.currentTarget as HTMLElement).style.color = "rgba(0,0,0,0.6)";
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                    }
                  }}>
                  {item.label}
                  <motion.span animate={{ rotate: openMenu === item.label ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: EASE }} className="inline-flex">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </motion.span>
                </button>
              )}

              <AnimatePresence>
                {item.items && openMenu === item.label && (
                  <MegaDropdown menu={item as NavMenu} onClose={() => setOpenMenu(null)} />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link to="/contact" onClick={() => setOpenMenu(null)}
            className="hidden md:block text-sm transition-colors"
            style={{ color: "rgba(0,0,0,0.5)" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = B.primary500}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(0,0,0,0.5)"}>
            Contact
          </Link>

          {/* Book Assessment — primary blue */}
          <motion.button
            onClick={() => { setOpenMenu(null); navigate("/contact"); }}
            className="text-white px-4 py-1.5 text-sm rounded-lg transition-colors"
            style={{ background: B.primary500 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.18, ease: EASE }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = B.primary600}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = B.primary500}>
            Book Assessment
          </motion.button>

          {/* Mobile toggle */}
          <button className="md:hidden p-1 transition-colors"
            style={{ color: "rgba(0,0,0,0.6)" }}
            onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="md:hidden bg-white overflow-hidden max-h-[80vh] overflow-y-auto"
            style={{ borderTop: `1px solid ${B.primary100}` }}>
            {navItems.map((item) => (
              <div key={item.label}>
                {item.path ? (
                  <Link to={item.path} onClick={() => setMobileOpen(false)}
                    className="flex items-center px-4 py-3 text-sm transition-colors"
                    style={{ color: "rgba(0,0,0,0.7)", borderBottom: `1px solid ${B.primary50}` }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = B.primary50}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <div className="px-4 py-2 text-[10px] font-medium uppercase tracking-widest"
                      style={{ color: B.primary500, borderBottom: `1px solid ${B.primary100}`, background: B.primary50 }}>
                      {item.category}
                    </div>
                    {item.items?.map((sub) => (
                      <Link key={sub.path} to={sub.path} onClick={() => setMobileOpen(false)}
                        className="flex items-start gap-3 px-5 py-3 transition-colors"
                        style={{ borderBottom: `1px solid ${B.primary50}` }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = B.primary50}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                        {sub.icon}
                        <div>
                          <div className="text-sm" style={{ color: B.navy500 }}>{sub.label}</div>
                          <div className="text-xs text-black/40">{sub.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            ))}
            <Link to="/contact" onClick={() => setMobileOpen(false)}
              className="flex items-center px-4 py-3 text-sm transition-colors"
              style={{ color: "rgba(0,0,0,0.7)" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = B.primary50}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
              Contact
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}