import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button.jsx";
import { InputField } from "../components/common/InputField.jsx";
import { MessageBanner } from "../components/common/MessageBanner.jsx";
import { PageShell } from "../components/common/PageShell.jsx";
import { SectionCard } from "../components/common/SectionCard.jsx";
import { useAuth } from "../hooks/useAuth.js";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    licenseNumber: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageShell
      eyebrow="Customer Onboarding"
      title="Create your rental account"
      description="Register as a customer to browse available vehicles, request bookings, and track your rental history."
    >
      <div className="mx-auto max-w-3xl">
        <SectionCard>
          <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
            {error ? <div className="md:col-span-2"><MessageBanner tone="error">{error}</MessageBanner></div> : null}
            <InputField label="Full name" name="fullName" value={form.fullName} onChange={handleChange} required />
            <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <InputField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
            <InputField label="License number" name="licenseNumber" value={form.licenseNumber} onChange={handleChange} required />
            <div className="md:col-span-2">
              <Button type="submit" disabled={isSubmitting} className={isSubmitting ? "opacity-70" : ""}>
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>
            </div>
          </form>
        </SectionCard>
      </div>
    </PageShell>
  );
}
