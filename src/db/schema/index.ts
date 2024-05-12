import { relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  uniqueIndex,
  integer,
  real
} from "drizzle-orm/sqlite-core";
const boolean = (col: string) => integer(col, { mode: "boolean" });
const timestamp = (col: string) => integer(col, { mode: "timestamp" });

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey().notNull(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    hashedPassword: text("hashedPassword"),
    emailVerified: boolean("emailVerified").default(false).notNull(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    locale: text("locale").notNull(),
    timezone: text("timezone"),
    isAdmin: boolean("isAdmin").default(false).notNull(),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex("emailIdx").on(table.email),
    };
  }
);

export const userRelations = relations(users, ({ many }) => ({
  teams: many(teams),
  emailVerifications: many(emailVerifications),
}));

export const emailVerifications = sqliteTable("emailVerifications", {
  id: integer("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" }),
  email: text("email").notNull(),
  otpCode: text("otpCode").notNull(),
  attempts: integer("attempts").default(0).notNull(),
});

export const emailVerificationRelations = relations(
  emailVerifications,
  ({ one }) => ({
    user: one(users, {
      fields: [emailVerifications.userId],
      references: [users.id],
    }),
  })
);
export const emailChangeRequests = sqliteTable("emailChangeRequests", {
  id: integer("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" }),
  newEmail: text("newEmail").notNull(),
  otpCode: text("otpCode").notNull(),
});

export const passwordResetRequests = sqliteTable("passwordResetRequests", {
  id: integer("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" }),
  token: text("token").notNull(),
});

export const teams = sqliteTable("teams", {
  id: integer("id").primaryKey().notNull(),
  name: text("name").notNull(),
  isPersonal: boolean("isPersonal").notNull(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" }),
});

export const teamsRelations = relations(teams, ({ one }) => ({
  user: one(users, {
    fields: [teams.userId],
    references: [users.id],
  }),
}));


export const plans = sqliteTable("plans", {
  id: integer("id").primaryKey().notNull(),
  name: text("name").notNull(),
  price: real("price").notNull()
});

// Define table schema for "subscriptions" table
export const subscriptions = sqliteTable("subscriptions", {
  id: integer("id").primaryKey().notNull(),
  team_id: integer("team_id").notNull(), // Foreign key referencing the team associated with the subscription
  plan_id: integer("plan_id").notNull().references(() => plans.id), // Reference the "id" column of the "plans" table
  start_date: timestamp("start_date").notNull(), // Date when the subscription starts
  end_date: timestamp("end_date").notNull(), // Date when the subscription ends
  status: text("status").notNull(), // Status of the subscription (active, inactive, etc.)
});

// Define table schema for "orders" table
export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey().notNull(),
  subscription_id: integer("subscription_id").notNull().references(() => subscriptions.id), // Foreign key referencing the associated subscription
  amount: integer("amount").notNull(), // The amount paid for the order, assuming it's stored as an integer (cents, for example)
  payment_date: timestamp("payment_date").notNull(), // Date when the payment was made
  activation_id: integer("activation_id"), // Foreign key referencing the associated activation record (if any)
});

// Define table schema for "subscription_activations" table
export const subscriptionActivations = sqliteTable("subscription_activations", {
  id: integer("id").primaryKey().notNull(),
  order_id: integer("order_id").notNull(), // Foreign key referencing the associated order
  activation_date: timestamp("activation_date").notNull(), // Date when the subscription was activated
});
