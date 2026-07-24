const complaints = [
  {
    id: "CMP-12",
    customer: "Ama Mensah",
    issue: "Late delivery",
    status: "Open",
  },
  {
    id: "CMP-09",
    customer: "Kwame Boateng",
    issue: "Missing item in order",
    status: "Resolved",
  },
];

export default function AdminComplaintsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Complaints</h1>
      <div className="space-y-3">
        {complaints.map((c) => (
          <div
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-border bg-surface p-5 shadow-sm"
          >
            <div>
              <p className="font-bold">
                {c.id}: {c.customer}
              </p>
              <p className="mt-1 text-sm text-muted">{c.issue}</p>
            </div>
            <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold">
              {c.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
