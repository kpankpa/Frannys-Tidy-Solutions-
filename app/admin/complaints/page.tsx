import { listComplaints } from "@/lib/db/complaints";
import {
  createComplaintAction,
  resolveComplaintAction,
} from "@/server/admin";
import { PendingSubmitButton } from "@/components/ui/PendingSubmitButton";
import { ensureAdminPage } from "@/lib/auth/admin-page";

const field =
  "mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

export default async function AdminComplaintsPage() {
  await ensureAdminPage();
  const complaints = await listComplaints();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Complaints</h1>
        <p className="mt-1 text-sm text-muted">
          Track customer issues and mark them resolved.
        </p>
      </div>

      <form
        action={createComplaintAction}
        className="max-w-xl space-y-3 rounded-[10px] border border-border bg-surface p-5 shadow-sm"
      >
        <h2 className="font-bold">Log complaint</h2>
        <label className="block text-sm">
          <span className="font-medium">Subject</span>
          <input name="subject" required className={field} />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Customer phone (optional)</span>
          <input name="customerPhone" className={field} placeholder="020..." />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Details</span>
          <textarea name="details" required rows={3} className={field} />
        </label>
        <PendingSubmitButton size="sm" pendingLabel="Saving...">
          Save complaint
        </PendingSubmitButton>
      </form>

      <div className="space-y-3">
        {complaints.map((c) => (
          <div
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-border bg-surface p-5 shadow-sm"
          >
            <div>
              <p className="font-bold">{c.subject}</p>
              <p className="mt-1 text-sm text-muted">{c.details}</p>
              <p className="mt-2 text-xs text-muted">
                {c.customerName
                  ? `${c.customerName} · ${c.customerPhone}`
                  : "No linked customer"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold capitalize">
                {c.status}
              </span>
              <form action={resolveComplaintAction}>
                <input type="hidden" name="id" value={c.id} />
                <input
                  type="hidden"
                  name="status"
                  value={c.status === "open" ? "resolved" : "open"}
                />
                <button
                  type="submit"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  {c.status === "open" ? "Resolve" : "Reopen"}
                </button>
              </form>
            </div>
          </div>
        ))}
        {complaints.length === 0 ? (
          <p className="rounded-[10px] border border-dashed border-border p-8 text-center text-muted">
            No complaints logged yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
