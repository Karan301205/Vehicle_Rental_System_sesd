import { Link } from "react-router-dom";
import { Button } from "../components/common/Button.jsx";
import { PageShell } from "../components/common/PageShell.jsx";
import { SectionCard } from "../components/common/SectionCard.jsx";

export function HomePage() {
  return (
    <PageShell
      eyebrow="WheelCheck"
      title="A premium vehicle rental flow built for clarity, speed, and operational control."
      description="Browse curated cars and bikes, book without scheduling conflicts, and manage fleet approvals through a clean RBAC-powered experience."
    >
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.9fr]">
        <SectionCard className="overflow-hidden p-0">
          <div className="grid min-h-[460px] gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-between p-8 sm:p-10">
              <div>
                <div className="inline-flex rounded-full bg-accentSoft px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  React + Express + PostgreSQL
                </div>
                <h2 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight">
                  Search, reserve, and manage your fleet from one composed interface.
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-muted">
                  WheelCheck combines a marketplace-style vehicle listing with a structured booking lifecycle, dynamic pricing strategies, and admin-grade control over rental approvals.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/vehicles">
                  <Button>Browse vehicles</Button>
                </Link>
                <Link to="/register">
                  <Button variant="secondary">Create customer account</Button>
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f8f5ef_0%,#e7dfd3_100%)]">
              <img
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury car"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
        </SectionCard>

        <div className="grid gap-6">
          <SectionCard>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Core capabilities</p>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-ink">
              <li>JWT authentication and role-aware dashboards</li>
              <li>Single-table vehicle inheritance for cars and bikes</li>
              <li>Conflict-free booking lifecycle from pending to completed</li>
              <li>Strategy-based pricing with surge-ready expansion</li>
            </ul>
          </SectionCard>

          <SectionCard>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Designed for operations</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-stone-100 p-4">
                <p className="text-2xl font-semibold">Admin</p>
                <p className="mt-2 text-sm text-muted">Add vehicles, review bookings, and keep the fleet healthy.</p>
              </div>
              <div className="rounded-3xl bg-stone-100 p-4">
                <p className="text-2xl font-semibold">Customer</p>
                <p className="mt-2 text-sm text-muted">Discover inventory, check availability, and track every reservation.</p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </PageShell>
  );
}

