ALTER TABLE "products" ADD COLUMN "stock_quantity" integer DEFAULT 0 NOT NULL;-->statement-breakpoint
UPDATE "products" SET "stock_quantity" = CASE WHEN "in_stock" = true THEN 25 ELSE 0 END;