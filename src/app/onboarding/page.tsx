export const dynamic = "force-dynamic";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const metadata = { title: "Welcome | SaaS Starter" };

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
