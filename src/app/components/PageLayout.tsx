import { useEffect } from "react";
import { useLocation } from "react-router";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

export function PageLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
