import { useEffect, useState } from "react";
import { cancelBooking, fetchMyBookings } from "../api/bookings.js";
import { AuthGate } from "../components/common/AuthGate.jsx";
import { Button } from "../components/common/Button.jsx";
import { EmptyState } from "../components/common/EmptyState.jsx";
import { LoadingState } from "../components/common/LoadingState.jsx";
import { MessageBanner } from "../components/common/MessageBanner.jsx";
import { PageShell } from "../components/common/PageShell.jsx";
import { SectionCard } from "../components/common/SectionCard.jsx";
import { StatusBadge } from "../components/common/StatusBadge.jsx";
import { USER_ROLES } from "../lib/constants.js";
import { formatCurrency, formatDateTime } from "../lib/formatters.js";
import { useAuth } from "../hooks/useAuth.js";

export function CustomerDashboardPage() {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadBookings() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetchMyBookings(token);
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

  async function handleCancelBooking(bookingId) {
    try {
      await cancelBooking(bookingId, token);
      await loadBookings();
    } catch (cancelError) {
      setError(cancelError.message);
    }
  }

  return (
    <AuthGate roles={[USER_ROLES.CUSTOMER]}>
      <PageShell
        eyebrow="Customer Dashboard"
        title={`Welcome back, ${user?.fullName?.split(" ")[0] ?? "Customer"}`}
        description="Track pending requests, confirmed rentals, and your full booking timeline."
      >
        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-3">
            <SectionCard>
              <p className="text-sm text-muted">Total bookings</p>
              <p className="mt-3 text-3xl font-semibold">{bookings.length}</p>
            </SectionCard>
            <SectionCard>
              <p className="text-sm text-muted">Pending approvals</p>
              <p className="mt-3 text-3xl font-semibold">{bookings.filter((booking) => booking.status === "PENDING").length}</p>
            </SectionCard>
            <SectionCard>
              <p className="text-sm text-muted">Confirmed or active</p>
              <p className="mt-3 text-3xl font-semibold">
                {bookings.filter((booking) => ["CONFIRMED", "ACTIVE"].includes(booking.status)).length}
              </p>
            </SectionCard>
          </div>

          {error ? <MessageBanner tone="error">{error}</MessageBanner> : null}
          {isLoading ? (
            <LoadingState label="Loading your bookings..." />
          ) : bookings.length === 0 ? (
            <EmptyState title="No bookings yet" description="Browse the vehicle marketplace and submit your first rental request." />
          ) : (
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <SectionCard key={booking.id}>
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={booking.status} />
                        <p className="text-sm text-muted">Booking ID {booking.id.slice(0, 8)}</p>
                      </div>
                      <div className="mt-4 grid gap-2 text-sm text-muted">
                        <p>Start: {formatDateTime(booking.startTime)}</p>
                        <p>End: {formatDateTime(booking.endTime)}</p>
                        <p>Total amount: <span className="font-semibold text-ink">{formatCurrency(booking.totalAmount)}</span></p>
                      </div>
                    </div>
                    {["PENDING", "CONFIRMED"].includes(booking.status) ? (
                      <Button variant="secondary" onClick={() => handleCancelBooking(booking.id)}>
                        Cancel booking
                      </Button>
                    ) : null}
                  </div>
                </SectionCard>
              ))}
            </div>
          )}
        </div>
      </PageShell>
    </AuthGate>
  );
}

