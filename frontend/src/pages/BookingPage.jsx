import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createBooking } from "../api/bookings.js";
import { fetchVehicleById } from "../api/vehicles.js";
import { AuthGate } from "../components/common/AuthGate.jsx";
import { Button } from "../components/common/Button.jsx";
import { InputField } from "../components/common/InputField.jsx";
import { LoadingState } from "../components/common/LoadingState.jsx";
import { MessageBanner } from "../components/common/MessageBanner.jsx";
import { PageShell } from "../components/common/PageShell.jsx";
import { SectionCard } from "../components/common/SectionCard.jsx";
import { USER_ROLES } from "../lib/constants.js";
import { formatCurrency } from "../lib/formatters.js";
import { useAuth } from "../hooks/useAuth.js";

export function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const vehicleId = searchParams.get("vehicleId");
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(vehicleId));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    startTime: "",
    endTime: ""
  });

  useEffect(() => {
    let isMounted = true;

    async function loadVehicle() {
      if (!vehicleId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetchVehicleById(vehicleId);
        if (isMounted) {
          setVehicle(response.vehicle);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadVehicle();

    return () => {
      isMounted = false;
    };
  }, [vehicleId]);

  const estimatedHours = useMemo(() => {
    if (!form.startTime || !form.endTime) {
      return 0;
    }

    const difference = new Date(form.endTime).getTime() - new Date(form.startTime).getTime();
    return difference > 0 ? Math.ceil(difference / (1000 * 60 * 60)) : 0;
  }, [form.endTime, form.startTime]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      await createBooking(
        {
          vehicleId,
          startTime: new Date(form.startTime).toISOString(),
          endTime: new Date(form.endTime).toISOString()
        },
        token
      );
      setSuccess("Booking request created successfully. It is now pending admin approval.");
      setTimeout(() => navigate("/dashboard"), 900);
    } catch (submissionError) {
      setError(submissionError.message);
    }
  }

  return (
    <AuthGate roles={[USER_ROLES.CUSTOMER]}>
      <PageShell
        eyebrow="Booking Flow"
        title="Reserve your vehicle"
        description="Review your selected vehicle, choose the date window, and submit a booking request."
      >
        {isLoading ? (
          <LoadingState label="Loading vehicle details..." />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <SectionCard>
              {error ? <MessageBanner tone="error">{error}</MessageBanner> : null}
              {vehicle ? (
                <form onSubmit={handleSubmit}>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{vehicle.type}</p>
                  <h2 className="mt-3 text-3xl font-semibold">
                    {vehicle.brand} {vehicle.model}
                  </h2>
                  <p className="mt-3 text-sm text-muted">
                    Plate number {vehicle.plateNumber} · {vehicle.year} · {vehicle.status}
                  </p>
                  <div className="mt-8 grid gap-5 md:grid-cols-2">
                    <InputField
                      label="Start date and time"
                      name="startTime"
                      type="datetime-local"
                      value={form.startTime}
                      onChange={handleChange}
                      required
                    />
                    <InputField
                      label="End date and time"
                      name="endTime"
                      type="datetime-local"
                      value={form.endTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mt-6">
                    <Button type="submit">Submit booking request</Button>
                  </div>
                </form>
              ) : (
                <MessageBanner tone="error">Select a vehicle from the marketplace before opening the booking page.</MessageBanner>
              )}
            </SectionCard>

            <SectionCard>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Booking summary</p>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Estimated duration</span>
                  <span className="font-medium">{estimatedHours || 0} hours</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Base rate</span>
                  <span className="font-medium">{vehicle ? formatCurrency(vehicle.baseRatePerHour) : "-"}/hr</span>
                </div>
                <div className="rounded-3xl bg-stone-100 p-4">
                  <p className="text-sm text-muted">Pricing note</p>
                  <p className="mt-2 text-sm leading-6">
                    Final total is calculated on the backend using vehicle-specific pricing logic plus weekend surge rules when applicable.
                  </p>
                </div>
                {success ? <MessageBanner tone="success">{success}</MessageBanner> : null}
              </div>
            </SectionCard>
          </div>
        )}
      </PageShell>
    </AuthGate>
  );
}

