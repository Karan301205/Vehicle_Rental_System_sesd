import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button.jsx";
import { InputField } from "../components/common/InputField.jsx";
import { MessageBanner } from "../components/common/MessageBanner.jsx";
import { PageShell } from "../components/common/PageShell.jsx";
import { SectionCard } from "../components/common/SectionCard.jsx";
import { useAuth } from "../hooks/useAuth.js";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await login(form);
      const nextPath = response.user.role === "ADMIN" ? "/admin" : location.state?.from || "/dashboard";
      navigate(nextPath, { replace: true });
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <PageShell eyebrow="Authentication" title="Sign in to WheelCheck" description="Use your customer or admin credentials to access your workspace.">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionCard>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Access flow</p>
          <p className="mt-4 text-sm leading-7 text-muted">
            Customers are routed to their booking dashboard. Admins are routed to fleet operations and booking moderation tools.
          </p>
          <div className="mt-5 rounded-3xl bg-stone-100 p-4 text-sm text-muted">
            <p className="font-medium text-ink">Demo credentials</p>
            <p className="mt-2">Admin: `admin@wheelcheck.dev` / `secret123`</p>
            <p>Customer: `customer@wheelcheck.dev` / `secret123`</p>
          </div>
        </SectionCard>

        <SectionCard>
          <form className="grid gap-5" onSubmit={handleSubmit}>
            {error ? <MessageBanner tone="error">{error}</MessageBanner> : null}
            <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <InputField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
            <Button type="submit" disabled={isSubmitting} className={isSubmitting ? "opacity-70" : ""}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </SectionCard>
      </div>
    </PageShell>
  );
}
