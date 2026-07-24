const customers = [
  { name: "Ama Mensah", phone: "0200928400", orders: 4, spend: "GH₵ 420" },
  { name: "Kwame Boateng", phone: "0244111222", orders: 3, spend: "GH₵ 310" },
  { name: "Efua Addo", phone: "0277333444", orders: 6, spend: "GH₵ 680" },
];

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customers</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {customers.map((c) => (
          <div
            key={c.phone}
            className="rounded-[10px] border border-border bg-surface p-5 shadow-sm"
          >
            <p className="font-bold text-foreground">{c.name}</p>
            <p className="mt-1 text-sm text-muted">{c.phone}</p>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-muted">{c.orders} orders</span>
              <span className="font-semibold text-primary">{c.spend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
