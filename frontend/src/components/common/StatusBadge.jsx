import { getBookingStatusTone } from "../../lib/formatters.js";

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBookingStatusTone(status)}`}>
      {status}
    </span>
  );
}

