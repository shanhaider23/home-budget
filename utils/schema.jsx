import {
	pgTable,
	varchar,
	serial,
	integer,
	numeric,
	primaryKey,
} from 'drizzle-orm/pg-core';

export const Budgets = pgTable('budgets', {
	id: serial('id').notNull().primaryKey(),
	name: varchar('name').notNull(),
	amount: varchar('amount').notNull(),
	currency: varchar('currency').notNull(),
	icon: varchar('icon'),
	createdBy: varchar('createdBy').notNull(),
});
export const Expenses = pgTable('expenses', {
	id: serial('id').primaryKey(),
	name: varchar('name').notNull(),
	amount: numeric('amount').notNull().default(0),
	budgetId: integer('budgetId').references(() => Budgets.id),
	category: varchar('category').notNull(),
	createdAt: varchar('createdAt').notNull(),
});
export const Monthly = pgTable('monthly', {
	id: serial('id').primaryKey(),
	date: varchar('date').notNull(),
	type: varchar('type').notNull(),
	category: varchar('category').notNull(),
	amount: numeric('amount').notNull().default(0),
});
