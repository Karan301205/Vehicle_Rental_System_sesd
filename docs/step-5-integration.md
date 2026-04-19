# Step 5 - Integration

## What This Step Completes

This step connects the project into a locally runnable system with verification:

- local in-memory PostgreSQL-compatible mode for development and testing
- seeded admin, customer, and sample vehicles
- API integration smoke test across the full booking flow
- local dev script for backend + frontend together
- safer auth rules by preventing public admin registration

## Integration Improvements

### Local Database Strategy

Because this environment does not currently have `psql` installed, local development now supports:

- `USE_IN_MEMORY_DB=true`
- `SEED_IN_MEMORY_DB=true`

This keeps the production PostgreSQL schema and repository layer intact while enabling local verification through `pg-mem`.

### Demo Seed Data

Seeded credentials for local review:

- Admin: `admin@wheelcheck.dev` / `secret123`
- Customer: `customer@wheelcheck.dev` / `secret123`

### Security Fix

Public registration is now customer-only.
Admin accounts should come from controlled seeding or future admin provisioning flows.

## Verification Performed

### Automated

- `npm run test --workspace backend`
- `npm run build --workspace frontend`

### API Flow Covered By Tests

- health check
- admin login
- customer registration
- vehicle search
- booking creation
- admin booking approval
- customer booking history retrieval

## Local Run Commands

Run the whole app locally with seeded in-memory data:

```bash
npm run dev:local
```

Expected local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Notes

- Production deployment should still use a real PostgreSQL database.
- The in-memory mode is for local development and verification only.
