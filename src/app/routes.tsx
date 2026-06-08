import { createBrowserRouter, Outlet } from "react-router";
import { PageLayout } from "./components/PageLayout";
import { HomePage } from "./pages/HomePage";
import { EDIPage } from "./pages/EDIPage";
import { AIPage } from "./pages/AIPage";
import { DataPage } from "./pages/DataPage";
import { CloudPage } from "./pages/CloudPage";
import { DigitalEngineeringPage } from "./pages/DigitalEngineeringPage";
import { TalentPage } from "./pages/TalentPage";
import { RetailPage } from "./pages/RetailPage";
import { LogisticsPage } from "./pages/LogisticsPage";
import { ManufacturingPage } from "./pages/ManufacturingPage";
import { HealthcarePage } from "./pages/HealthcarePage";
import { OurApproachPage } from "./pages/OurApproachPage";
import { TrustSecurityPage } from "./pages/TrustSecurityPage";
import { CaseStudiesPage } from "./pages/CaseStudiesPage";
import { PartnershipsPage } from "./pages/PartnershipsPage";
import { AboutPage } from "./pages/AboutPage";
import { LeadershipPage } from "./pages/LeadershipPage";
import { CareersPage } from "./pages/CareersPage";
import { InsightsPage } from "./pages/InsightsPage";
import { ContactPage } from "./pages/ContactPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function Root() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "services/edi-b2b-integration", Component: EDIPage },
      { path: "services/ai-solutions", Component: AIPage },
      { path: "services/data-analytics", Component: DataPage },
      { path: "services/cloud-services", Component: CloudPage },
      { path: "services/digital-engineering", Component: DigitalEngineeringPage },
      { path: "services/talent-solutions", Component: TalentPage },
      { path: "industries/retail-cpg", Component: RetailPage },
      { path: "industries/logistics-supply-chain", Component: LogisticsPage },
      { path: "industries/manufacturing", Component: ManufacturingPage },
      { path: "industries/healthcare", Component: HealthcarePage },
      { path: "why/our-approach", Component: OurApproachPage },
      { path: "why/trust-security", Component: TrustSecurityPage },
      { path: "why/case-studies", Component: CaseStudiesPage },
      { path: "why/partnerships", Component: PartnershipsPage },
      { path: "company/about", Component: AboutPage },
      { path: "company/leadership", Component: LeadershipPage },
      { path: "company/careers", Component: CareersPage },
      { path: "insights", Component: InsightsPage },
      { path: "contact", Component: ContactPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
