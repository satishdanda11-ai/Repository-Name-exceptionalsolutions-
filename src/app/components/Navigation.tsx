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
import logo from "../../imports/Group_6417.png";
import { EASE } from "../lib/animations";

interface DropdownItem {
  icon: React.ReactNode;
  label: string;
  desc: string;
  path: string;
}
interface NavMenu {
  label: string;
  category: string;
  items: DropdownItem[];
  path?: never;
}
interface NavLink {
  label: string;
  path: string;
  category?: never;
  items?: never;
}
type NavItem = NavMenu | NavLink;

const ICON_CLS = "w-4 h-4 text-black/40 flex-shrink-0 mt-0.5";

const navItems: NavItem[] = [
  {
    label: "Services",
    category: "SERVICES",
    items: [
      { icon: <ArrowLeftRight className={ICON_CLS} />, label: "EDI & B2B Integration", desc: "Assess, modernise and operate your EDI estate", path: "/services/edi-b2b-integration" },
      { icon: <Sparkles className={ICON_CLS} />, label: "AI Solutions", desc: "Applied AI built on trusted, connected data", path: "/services/ai-solutions" },
      { icon: <BarChart2 className={ICON_CLS} />, label: "Data & Analytics", desc: "Turn connected enterprise data into decisions", path: "/services/data-analytics" },
      { icon: <Cloud className={ICON_CLS} />, label: "Cloud Services", desc: "Cloud built for scale and reliability", path: "/services/cloud-services" },
      { icon: <Code2 className={ICON_CLS} />, label: "Digital Engineering", desc: "Senior engineers building modern systems", path: "/services/digital-engineering" },
      { icon: <Users className={ICON_CLS} />, label: "Talent Solutions", desc: "Domain specialists embedded in your team", path: "/services/talent-solutions" },
    ],
  },
  {
    label: "Industries",
    category: "INDUSTRIES",
    items: [
      { icon: <Truck className={ICON_CLS} />, label: "Logistics & Supply Chain", desc: "Every shipment depends on data that flows", path: "/industries/logistics-supply-chain" },
      { icon: <ShoppingBag className={ICON_CLS} />, label: "Retail & CPG", desc: "High-volume partner networks, peak-season reliability", path: "/industries/retail-cpg" },
      { icon: <Factory className={ICON_CLS} />, label: "Manufacturing", desc: "Connect the supply chain that keeps the line moving", path: "/industries/manufacturing" },
      { icon: <Heart className={ICON_CLS} />, label: "Healthcare", desc: "Secure, compliant data exchange with no room for error", path: "/industries/healthcare" },
    ],
  },
  {
    label: "Why Exceptional",
    category: "WHY EXCEPTIONAL",
    items: [
      { icon: <Map className={ICON_CLS} />, label: "Our Approach", desc: "A delivery approach built for zero surprises", path: "/why/our-approach" },
      { icon: <ShieldCheck className={ICON_CLS} />, label: "Trust & Security", desc: "Built to clear enterprise due diligence", path: "/why/trust-security" },
      { icon: <FileText className={ICON_CLS} />, label: "Case Studies", desc: "Real engagements, measured results", path: "/why/case-studies" },
      { icon: <Link2 className={ICON_CLS} />, label: "Partnerships", desc: "Certified expertise across six enterprise platforms", path: "/why/partnerships" },
    ],
  },
  { label: "Insights", path: "/insights" },
  {
    label: "Company",
    category: "COMPANY",
    items: [
      { icon: <Building2 className={ICON_CLS} />, label: "About Us", desc: "Integration specialists, evolving with intent since 2019", path: "/company/about" },
      { icon: <UserCheck className={ICON_CLS} />, label: "Leadership", desc: "Senior people accountable for your success", path: "/company/leadership" },
      { icon: <Briefcase className={ICON_CLS} />, label: "Careers", desc: "Do specialist work with people who take it seriously", path: "/company/careers" },
    ],
  },
];

// Mega-menu dropdown with fade + scale reveal --------------------------------
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
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-black/10 rounded-xl shadow-lg overflow-hidden z-50"
      style={{ minWidth: cols === 2 ? 520 : 280 }}
    >
      {/* Category header */}
      <div className="px-6 pt-5 pb-3 border-b border-black/[0.06]">
        <span className="text-[10px] font-medium text-black/30 uppercase tracking-widest">
          {menu.category}
        </span>
      </div>

      {/* Items grid — staggered reveal */}
      <motion.div
        className={`p-3 ${cols === 2 ? "grid grid-cols-2 gap-x-2" : ""}`}
        variants={{ visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } }}
        initial="hidden"
        animate="visible"
      >
        {cols === 2 ? (
          <>
            <div>{left.map((item) => <DropdownRow key={item.path} item={item} onClose={onClose} />)}</div>
            <div className="border-l border-black/[0.06] pl-2">
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
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -6 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.22, ease: EASE } },
      }}
    >
      <Link
        to={item.path}
        onClick={onClose}
        className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-black/[0.03] transition-colors group"
      >
        {/* Icon animates first via the stagger, text follows */}
        <motion.div className="mt-0.5 transition-transform group-hover:scale-110 duration-200">
          {item.icon}
        </motion.div>
        <div className="space-y-0.5 min-w-0">
          <div className="text-sm font-medium text-black group-hover:text-black/80 transition-colors leading-tight flex items-center gap-1">
            {item.label}
            <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 inline-block text-black/30 text-xs">→</span>
          </div>
          <div className="text-xs text-black/40 leading-snug">{item.desc}</div>
        </div>
      </Link>
    </motion.div>
  );
}

export function Navigation() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  // Scroll → glass effect
  useEffect(() => {
    return scrollY.on("change", (y) => setScrolled(y > 20));
  }, [scrollY]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
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
          ? "bg-white/95 backdrop-blur-md border-b border-black/10 shadow-sm"
          : "bg-white border-b border-black/10",
      ].join(" ")}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0" onClick={() => setOpenMenu(null)}>
          <motion.img
            src={logo}
            alt="Exceptional Solutions"
            className="h-8"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: EASE }}
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.path ? (
                <Link
                  to={item.path}
                  onClick={() => setOpenMenu(null)}
                  className="nav-link-underline px-3 py-2 text-sm text-black/60 hover:text-black transition-colors rounded-lg hover:bg-black/[0.03] flex items-center"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                  className={`px-3 py-2 text-sm transition-colors rounded-lg flex items-center gap-1 ${
                    openMenu === item.label
                      ? "text-black bg-black/[0.04]"
                      : "text-black/60 hover:text-black hover:bg-black/[0.03]"
                  }`}
                >
                  {item.label}
                  <motion.span
                    animate={{ rotate: openMenu === item.label ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: EASE }}
                    className="inline-flex"
                  >
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
          <Link
            to="/contact"
            onClick={() => setOpenMenu(null)}
            className="nav-link-underline hidden md:block text-sm text-black/50 hover:text-black transition-colors"
          >
            Contact
          </Link>
          <motion.button
            onClick={() => { setOpenMenu(null); navigate("/contact"); }}
            className="bg-black text-white px-4 py-1.5 text-sm rounded-lg hover:bg-black/90 transition-colors"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.18, ease: EASE }}
          >
            Book Assessment
          </motion.button>
          {/* Mobile toggle */}
          <button
            className="md:hidden p-1 text-black/60 hover:text-black transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
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
            className="md:hidden border-t border-black/10 bg-white overflow-hidden max-h-[80vh] overflow-y-auto"
          >
            {navItems.map((item) => (
              <div key={item.label}>
                {item.path ? (
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center px-4 py-3 text-sm text-black/70 hover:text-black hover:bg-black/[0.02] border-b border-black/[0.06] transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <div className="px-4 py-2 text-[10px] font-medium text-black/30 uppercase tracking-widest border-b border-black/[0.06] bg-black/[0.01]">
                      {item.category}
                    </div>
                    {item.items?.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-start gap-3 px-5 py-3 border-b border-black/[0.06] hover:bg-black/[0.02] transition-colors"
                      >
                        {sub.icon}
                        <div>
                          <div className="text-sm text-black">{sub.label}</div>
                          <div className="text-xs text-black/40">{sub.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            ))}
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex items-center px-4 py-3 text-sm text-black/70 hover:text-black hover:bg-black/[0.02] transition-colors"
            >
              Contact
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
