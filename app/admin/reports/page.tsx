export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {["Product sales", "Service bookings", "WhatsApp conversions", "Delivery zones"].map(
          (title) => (
            <div
              key={title}
              className="rounded-[20px] border border-border bg-surface p-6 shadow-sm"
            >
              <h2 className="font-bold">{title}</h2>
              <p className="mt-2 text-sm text-muted">
                Chart placeholder. Connect analytics later.
              </p>
              <div className="mt-6 h-32 rounded-[16px] bg-gradient-to-r from-primary/10 via-secondary/20 to-highlight/20" />
            </div>
          ),
        )}
      </div>
    </div>
  );
}
