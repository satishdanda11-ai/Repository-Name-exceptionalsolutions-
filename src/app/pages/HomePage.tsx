import { Hero } from "../components/Hero";
import { KeyMetrics } from "../components/KeyMetrics";
import { CredibilityStrip } from "../components/CredibilityStrip";
import { ProblemStatement } from "../components/ProblemStatement";
import { FlagshipCapability } from "../components/FlagshipCapability";
import { SupportingCapabilities } from "../components/SupportingCapabilities";
import { WhyExceptional } from "../components/WhyExceptional";
import { PlatformExpertise } from "../components/PlatformExpertise";
import { DeliveryApproach } from "../components/DeliveryApproach";
import { ProofSection } from "../components/ProofSection";
import { Industries } from "../components/Industries";
import { Insights } from "../components/Insights";
import { FinalCTA } from "../components/FinalCTA";

export function HomePage() {
  return (
    <>
      <Hero />
      <KeyMetrics />
      <CredibilityStrip />
      <ProblemStatement />
      <FlagshipCapability />
      <SupportingCapabilities />
      <WhyExceptional />
      <PlatformExpertise />
      <DeliveryApproach />
      <ProofSection />
      <Industries />
      <Insights />
      <FinalCTA />
    </>
  );
}
