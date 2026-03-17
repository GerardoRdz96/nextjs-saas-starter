export const dynamic = "force-dynamic";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Sign In | SaaS Starter" };

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
