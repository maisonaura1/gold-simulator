-- CreateEnum
CREATE TYPE "BookRole" AS ENUM ('OWNER', 'TRADER', 'VIEWER', 'AUDITOR');

-- CreateEnum
CREATE TYPE "DeskSide" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "DeskStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateTable: trade_books
CREATE TABLE "trade_books" (
    "id"         TEXT NOT NULL,
    "name"       TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "trade_books_pkey" PRIMARY KEY ("id")
);

-- CreateTable: trade_book_members
CREATE TABLE "trade_book_members" (
    "id"         TEXT NOT NULL,
    "book_id"    TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "role"       "BookRole" NOT NULL,
    "joined_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "trade_book_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable: trade_orders
CREATE TABLE "trade_orders" (
    "id"                TEXT NOT NULL,
    "book_id"           TEXT NOT NULL,
    "symbol"            TEXT NOT NULL DEFAULT 'XAUUSD',
    "side"              "DeskSide" NOT NULL,
    "quantity"          DOUBLE PRECISION NOT NULL,
    "price"             DOUBLE PRECISION NOT NULL,
    "status"            "DeskStatus" NOT NULL DEFAULT 'DRAFT',
    "creator_email"     TEXT NOT NULL,
    "approved_by_email" TEXT,
    "notes"             TEXT,
    "created_at"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"        TIMESTAMP(3) NOT NULL,
    CONSTRAINT "trade_orders_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "trade_orders_symbol_check" CHECK ("symbol" = 'XAUUSD'),
    CONSTRAINT "trade_orders_quantity_check" CHECK ("quantity" > 0),
    CONSTRAINT "trade_orders_price_check" CHECK ("price" > 0),
    CONSTRAINT "trade_orders_approved_requires_email" CHECK (
        "status" != 'APPROVED' OR "approved_by_email" IS NOT NULL
    )
);

-- CreateTable: trade_audit_log
CREATE TABLE "trade_audit_log" (
    "id"          TEXT NOT NULL,
    "order_id"    TEXT,
    "book_id"     TEXT NOT NULL,
    "actor_email" TEXT NOT NULL,
    "action"      TEXT NOT NULL,
    "detail"      TEXT,
    "created_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "trade_audit_log_pkey" PRIMARY KEY ("id")
);

-- Unique constraint
ALTER TABLE "trade_book_members"
    ADD CONSTRAINT "trade_book_members_book_id_user_email_key"
    UNIQUE ("book_id", "user_email");

-- Indexes
CREATE INDEX "trade_book_members_book_id_idx"   ON "trade_book_members"("book_id");
CREATE INDEX "trade_book_members_user_email_idx" ON "trade_book_members"("user_email");
CREATE INDEX "trade_orders_book_id_status_idx"  ON "trade_orders"("book_id", "status");
CREATE INDEX "trade_orders_creator_email_idx"   ON "trade_orders"("creator_email");
CREATE INDEX "trade_audit_log_book_id_idx"      ON "trade_audit_log"("book_id");
CREATE INDEX "trade_audit_log_order_id_idx"     ON "trade_audit_log"("order_id");

-- Foreign keys
ALTER TABLE "trade_book_members"
    ADD CONSTRAINT "trade_book_members_book_id_fkey"
    FOREIGN KEY ("book_id") REFERENCES "trade_books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "trade_orders"
    ADD CONSTRAINT "trade_orders_book_id_fkey"
    FOREIGN KEY ("book_id") REFERENCES "trade_books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "trade_audit_log"
    ADD CONSTRAINT "trade_audit_log_book_id_fkey"
    FOREIGN KEY ("book_id") REFERENCES "trade_books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "trade_audit_log"
    ADD CONSTRAINT "trade_audit_log_order_id_fkey"
    FOREIGN KEY ("order_id") REFERENCES "trade_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
