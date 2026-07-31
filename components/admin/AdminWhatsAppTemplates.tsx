import { MessageCircle } from "lucide-react";
import type { WaTemplateLink } from "@/lib/wa-templates";

type AdminWhatsAppTemplatesProps = {
  title?: string;
  templates: WaTemplateLink[];
};

export function AdminWhatsAppTemplates({
  title = "WhatsApp templates",
  templates,
}: AdminWhatsAppTemplatesProps) {
  if (templates.length === 0) {
    return (
      <p className="text-sm text-muted">
        Add a valid Ghana phone number to enable WhatsApp templates.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-[#128C7E]" />
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {templates.map((template) => (
          <a
            key={template.id}
            href={template.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-3 py-1.5 text-xs font-semibold text-[#128C7E] transition hover:bg-[#25D366]/20"
          >
            {template.label}
          </a>
        ))}
      </div>
    </div>
  );
}
