import { useEffect, useMemo, useState } from "react";
import { approveBooking, fetchAllBookings } from "../api/bookings.js";
import { createVehicle } from "../api/vehicles.js";
import { AuthGate } from "../components/common/AuthGate.jsx";
import { Button } from "../components/common/Button.jsx";
import { EmptyState } from "../components/common/EmptyState.jsx";
import { InputField } from "../components/common/InputField.jsx";
import { LoadingState } from "../components/common/LoadingState.jsx";
import { MessageBanner } from "../components/common/MessageBanner.jsx";
import { PageShell } from "../components/common/PageShell.jsx";
import { SectionCard } from "../components/common/SectionCard.jsx";
import { SelectField } from "../components/common/SelectField.jsx";
import { StatusBadge } from "../components/common/StatusBadge.jsx";
import { USER_ROLES, VEHICLE_TYPE } from "../lib/constants.js";
import { formatCurrency, formatDateTime } from "../lib/formatters.js";
import { useAuth } from "../hooks/useAuth.js";

const initialVehicleForm = {
  brand: "",
  model: "",
  year: "",
  plateNumber: "",
  type: VEHICLE_TYPE.CAR,
  baseRatePerHour: "",
  imageUrl: "",
  trunkSize: "",
  doors: "4",
  hasAC: true,
  helmetType: "",
  engineCapacity: ""
};

export function AdminDashboardPage() {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [vehicleForm, setVehicleForm] = useState(initialVehicleForm);

  async function loadBookings() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetchAllBookings(token);
      setBookings(response.bookings);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  const pendingCount = useMemo(() => bookings.filter((booking) => booking.status === "PENDING").length, [bookings]);

  async function handleApproveBooking(bookingId) {
    setError("");
    setSuccess("");

    try {
      await approveBooking(bookingId, token);
      setSuccess("Booking approved successfully.");
      await loadBookings();
    } catch (approvalError) {
      setError(approvalError.message);
    }
  }

  function handleVehicleFieldChange(event) {
    const { name, value, type, checked } = event.target;
    setVehicleForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function handleVehicleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const specificAttributes =
      vehicleForm.type === VEHICLE_TYPE.CAR
        ? {
            trunkSize: Number(vehicleForm.trunkSize || 0),
            doors: Number(vehicleForm.doors || 4),
            hasAC: Boolean(vehicleForm.hasAC)
          }
        : {
            helmetType: vehicleForm.helmetType,
            engineCapacity: Number(vehicleForm.engineCapacity || 0)
          };

    try {
      await createVehicle(
        {
          brand: vehicleForm.brand,
          model: vehicleForm.model,
          year: Number(vehicleForm.year),
          plateNumber: vehicleForm.plateNumber,
          type: vehicleForm.type,
          baseRatePerHour: Number(vehicleForm.baseRatePerHour),
          imageUrl: vehicleForm.imageUrl || undefined,
          specificAttributes
        },
        token
      );
      setSuccess("Vehicle added to the fleet.");
      setVehicleForm(initialVehicleForm);
    } catch (submissionError) {
      setError(submissionError.message);
    }
  }

  return (
    <AuthGate roles={[USER_ROLES.ADMIN]}>
      <PageShell
        eyebrow="Admin Operations"
        title={`Fleet control for ${user?.fullName ?? "Admin"}`}
        description="Add vehicles to inventory, watch pending requests, and move bookings forward through the approval flow."
      >
        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-3">
            <SectionCard>
              <p className="text-sm text-muted">Pending bookings</p>
              <p className="mt-3 text-3xl font-semibold">{pendingCount}</p>
            </SectionCard>
            <SectionCard>
              <p className="text-sm text-muted">Total bookings</p>
              <p className="mt-3 text-3xl font-semibold">{bookings.length}</p>
            </SectionCard>
            <SectionCard>
              <p className="text-sm text-muted">Revenue in pipeline</p>
              <p className="mt-3 text-3xl font-semibold">
                {formatCurrency(bookings.reduce((sum, booking) => sum + Number(booking.totalAmount || 0), 0))}
              </p>
            </SectionCard>
          </div>

          {error ? <MessageBanner tone="error">{error}</MessageBanner> : null}
          {success ? <MessageBanner tone="success">{success}</MessageBanner> : null}

          <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
            <SectionCard>
              <p className="text-lg font-semibold">Add vehicle</p>
              <form className="mt-5 grid gap-4" onSubmit={handleVehicleSubmit}>
                <InputField label="Brand" name="brand" value={vehicleForm.brand} onChange={handleVehicleFieldChange} required />
                <InputField label="Model" name="model" value={vehicleForm.model} onChange={handleVehicleFieldChange} required />
                <InputField label="Year" name="year" type="number" value={vehicleForm.year} onChange={handleVehicleFieldChange} required />
                <InputField label="Plate number" name="plateNumber" value={vehicleForm.plateNumber} onChange={handleVehicleFieldChange} required />
                <SelectField
                  label="Vehicle type"
                  name="type"
                  value={vehicleForm.type}
                  onChange={handleVehicleFieldChange}
                  options={[
                    { value: VEHICLE_TYPE.CAR, label: "Car" },
                    { value: VEHICLE_TYPE.BIKE, label: "Bike" }
                  ]}
                />
                <InputField
                  label="Base hourly rate"
                  name="baseRatePerHour"
                  type="number"
                  step="0.01"
                  value={vehicleForm.baseRatePerHour}
                  onChange={handleVehicleFieldChange}
                  required
                />
                <InputField label="Image URL" name="imageUrl" value={vehicleForm.imageUrl} onChange={handleVehicleFieldChange} />

                {vehicleForm.type === VEHICLE_TYPE.CAR ? (
                  <>
                    <InputField label="Trunk size" name="trunkSize" type="number" value={vehicleForm.trunkSize} onChange={handleVehicleFieldChange} />
                    <InputField label="Doors" name="doors" type="number" value={vehicleForm.doors} onChange={handleVehicleFieldChange} />
                    <label className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-sm">
                      <input type="checkbox" name="hasAC" checked={vehicleForm.hasAC} onChange={handleVehicleFieldChange} />
                      Air conditioning available
                    </label>
                  </>
                ) : (
                  <>
                    <InputField label="Helmet type" name="helmetType" value={vehicleForm.helmetType} onChange={handleVehicleFieldChange} />
                    <InputField
                      label="Engine capacity"
                      name="engineCapacity"
                      type="number"
                      value={vehicleForm.engineCapacity}
                      onChange={handleVehicleFieldChange}
                    />
                  </>
                )}

                <Button type="submit">Add vehicle</Button>
              </form>
            </SectionCard>

            <div className="grid gap-4">
              {isLoading ? (
                <LoadingState label="Loading fleet bookings..." />
              ) : bookings.length === 0 ? (
                <EmptyState title="No bookings yet" description="Customer booking activity will appear here once reservations are created." />
              ) : (
                bookings.map((booking) => (
                  <SectionCard key={booking.id}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={booking.status} />
                          <p className="text-sm text-muted">Booking {booking.id.slice(0, 8)}</p>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted">
                          <p>Vehicle ID: {booking.vehicleId}</p>
                          <p>User ID: {booking.userId}</p>
                          <p>Start: {formatDateTime(booking.startTime)}</p>
                          <p>End: {formatDateTime(booking.endTime)}</p>
                          <p>Amount: <span className="font-semibold text-ink">{formatCurrency(booking.totalAmount)}</span></p>
                        </div>
                      </div>
                      {booking.status === "PENDING" ? (
                        <Button onClick={() => handleApproveBooking(booking.id)}>Approve booking</Button>
                      ) : null}
                    </div>
                  </SectionCard>
                ))
              )}
            </div>
          </div>
        </div>
      </PageShell>
    </AuthGate>
  );
}
