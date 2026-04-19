import { useEffect, useState } from "react";
import { searchAvailableVehicles } from "../api/vehicles.js";
import { Button } from "../components/common/Button.jsx";
import { EmptyState } from "../components/common/EmptyState.jsx";
import { InputField } from "../components/common/InputField.jsx";
import { LoadingState } from "../components/common/LoadingState.jsx";
import { MessageBanner } from "../components/common/MessageBanner.jsx";
import { PageShell } from "../components/common/PageShell.jsx";
import { SectionCard } from "../components/common/SectionCard.jsx";
import { SelectField } from "../components/common/SelectField.jsx";
import { VehicleCard } from "../components/common/VehicleCard.jsx";
import { VEHICLE_TYPE } from "../lib/constants.js";

const initialFilters = {
  type: "",
  brand: "",
  minRate: "",
  maxRate: ""
};

export function VehicleListingPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadVehicles() {
      setIsLoading(true);
      setError("");

      try {
        const response = await searchAvailableVehicles(filters);
        if (isMounted) {
          setVehicles(response.vehicles);
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

    loadVehicles();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function resetFilters() {
    setFilters(initialFilters);
  }

  return (
    <PageShell
      eyebrow="Vehicle Marketplace"
      title="Browse available vehicles"
      description="A calm, filter-first rental experience inspired by your reference UI and powered by live backend search."
    >
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <SectionCard className="h-fit">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Filter inventory</p>
            <button onClick={resetFilters} className="text-sm text-muted">
              Reset
            </button>
          </div>
          <div className="mt-5 grid gap-4">
            <SelectField
              label="Vehicle type"
              name="type"
              value={filters.type}
              onChange={handleChange}
              options={[
                { value: "", label: "All vehicles" },
                { value: VEHICLE_TYPE.CAR, label: "Cars" },
                { value: VEHICLE_TYPE.BIKE, label: "Bikes" }
              ]}
            />
            <InputField label="Brand" name="brand" value={filters.brand} onChange={handleChange} placeholder="Audi, Tesla, Yamaha..." />
            <InputField label="Minimum hourly rate" name="minRate" type="number" value={filters.minRate} onChange={handleChange} min="0" />
            <InputField label="Maximum hourly rate" name="maxRate" type="number" value={filters.maxRate} onChange={handleChange} min="0" />
            <Button variant="secondary" onClick={resetFilters}>Clear filters</Button>
          </div>
        </SectionCard>

        <div className="grid gap-5">
          {error ? <MessageBanner tone="error">{error}</MessageBanner> : null}
          {isLoading ? (
            <LoadingState label="Loading available vehicles..." />
          ) : vehicles.length === 0 ? (
            <EmptyState title="No vehicles match these filters" description="Try widening the price band or removing the brand filter." />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{vehicles.length} vehicles available</h2>
                <p className="text-sm text-muted">Live inventory from the backend search API</p>
              </div>
              <div className="grid gap-6 xl:grid-cols-2">
                {vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}

