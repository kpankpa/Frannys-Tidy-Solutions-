import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { complaints, customers } from "@/lib/db/schema";

export type ComplaintListItem = {
  id: string;
  subject: string;
  details: string;
  status: string;
  customerName: string | null;
  customerPhone: string | null;
  createdAt: Date;
};

export async function listComplaints(): Promise<ComplaintListItem[]> {
  const rows = await db
    .select({
      id: complaints.id,
      subject: complaints.subject,
      details: complaints.details,
      status: complaints.status,
      customerName: customers.name,
      customerPhone: customers.phone,
      createdAt: complaints.createdAt,
    })
    .from(complaints)
    .leftJoin(customers, eq(complaints.customerId, customers.id))
    .orderBy(desc(complaints.createdAt));

  return rows;
}

export async function createComplaint(input: {
  subject: string;
  details: string;
  customerPhone?: string;
}) {
  const subject = input.subject.trim();
  const details = input.details.trim();
  if (!subject || !details) {
    throw new Error("Subject and details are required.");
  }

  let customerId: string | undefined;
  if (input.customerPhone?.trim()) {
    const phone = input.customerPhone.replace(/[\s\-()]/g, "").trim();
    const customer = await db.query.customers.findFirst({
      where: eq(customers.phone, phone),
    });
    customerId = customer?.id;
  }

  const [row] = await db
    .insert(complaints)
    .values({
      subject,
      details,
      customerId,
      status: "open",
    })
    .returning();

  return row;
}

export async function setComplaintStatus(id: string, status: "open" | "resolved") {
  const [row] = await db
    .update(complaints)
    .set({ status, updatedAt: new Date() })
    .where(eq(complaints.id, id))
    .returning();
  return row ?? null;
}
