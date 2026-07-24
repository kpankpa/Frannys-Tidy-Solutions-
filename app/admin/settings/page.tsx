import { SITE } from "@/lib/constants";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="max-w-xl space-y-4 rounded-[20px] border border-border bg-surface p-6 shadow-sm">
        <label className="block text-sm">
          <span className="font-medium">Business name</span>
          <input
            defaultValue={SITE.name}
            className="mt-1.5 w-full rounded-[16px] border border-border px-4 py-3"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">WhatsApp number</span>
          <input
            defaultValue={SITE.phoneDisplay}
            className="mt-1.5 w-full rounded-[16px] border border-border px-4 py-3"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Delivery fee (GH₵)</span>
          <input
            defaultValue={SITE.deliveryFee}
            type="number"
            className="mt-1.5 w-full rounded-[16px] border border-border px-4 py-3"
          />
        </label>
        <button
          type="button"
          className="rounded-[16px] bg-primary px-5 py-3 text-sm font-semibold text-white"
        >
          Save settings
        </button>
      </div>
    </div>
  );
}
