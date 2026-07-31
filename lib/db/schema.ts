import {
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("user"),
  ...timestamps,
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  ...timestamps,
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description").notNull(),
  features: text("features").array().notNull().default([]),
  pricePesewas: integer("price_pesewas").notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull().default("0"),
  reviewsCount: integer("reviews_count").notNull().default(0),
  inStock: boolean("in_stock").notNull().default(true),
  /** Units available. Kept in sync with inStock (inStock = stockQuantity > 0). */
  stockQuantity: integer("stock_quantity").notNull().default(0),
  badge: text("badge"),
  /** When set, badge shows only until this date (end of day local handling in app). */
  badgeExpiresAt: timestamp("badge_expires_at", { withTimezone: true }),
  imageAlt: text("image_alt").notNull().default(""),
  ...timestamps,
});

export const productImages = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  ...timestamps,
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  status: text("status").notNull().default("pending"),
  subtotalPesewas: integer("subtotal_pesewas").notNull(),
  deliveryPesewas: integer("delivery_pesewas").notNull(),
  totalPesewas: integer("total_pesewas").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  notes: text("notes").notNull().default(""),
  ...timestamps,
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  productName: text("product_name").notNull(),
  unitPricePesewas: integer("unit_price_pesewas").notNull(),
  quantity: integer("quantity").notNull(),
});

export const orderEvents = pgTable("order_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  status: text("status").notNull(),
  note: text("note").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  serviceType: text("service_type").notNull(),
  location: text("location").notNull(),
  preferredDate: text("preferred_date"),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("requested"),
  /** "booking" = service request, "contact" = general enquiry */
  source: text("source").notNull().default("booking"),
  ...timestamps,
});

export const complaints = pgTable("complaints", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id),
  orderId: uuid("order_id").references(() => orders.id),
  subject: text("subject").notNull(),
  details: text("details").notNull(),
  status: text("status").notNull().default("open"),
  ...timestamps,
});

export const settings = pgTable("settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  ...timestamps,
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
  bookings: many(bookings),
  complaints: many(complaints),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
  events: many(orderEvents),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const orderEventsRelations = relations(orderEvents, ({ one }) => ({
  order: one(orders, {
    fields: [orderEvents.orderId],
    references: [orders.id],
  }),
}));
