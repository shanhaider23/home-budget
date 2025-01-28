import { pgTable, varchar, serial } from 'drizzle-orm/pg-core';

export const Budgets = pgTable('budgets', {
	id: serial('id').notNull(),
	name: varchar('name').notNull(),
	amount: varchar('amount').notNull(),
	icon: varchar('icon'),
	createdBy: varchar('createdBy').notNull(),
});
