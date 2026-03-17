import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Sign Up | SaaS Starter" };

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
