import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const SpreadsheetsTable = sqliteTable('spreadsheets', {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    uid: text('uid').notNull().unique(),
    name: text('name').notNull(),
    email: text('email'),
    username: text('username').notNull().unique(),
    password: text('password').notNull(),
    passwordResetRequired: integer('password_reset_required', {
        mode: 'boolean',
    })
        .notNull()
        .default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export const AbstractsTable = sqliteTable('abstracts', {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    uid: text('uid').notNull().unique(),
    spreadsheet: text('spreadsheet').references(() => SpreadsheetsTable.uid),

    name: text('name').notNull(),
    mount: integer('mount').notNull(),
    year: integer('year').notNull(),

    // interface Budgets {
    //   revenue: {
    //     planned: number;
    //   };
    //   expenses: {
    //     category: string;
    //     planned: number;
    //   }[];
    // }
    budgets: text('budgets', { mode: 'json' }).notNull(),
    notes: text('notes', { mode: 'json' }).notNull(),

    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export const PaymentOptionsTable = sqliteTable('payment_options', {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    uid: text('uid').notNull().unique(),
    spreadsheet: text('spreadsheet').references(() => SpreadsheetsTable.uid),
    name: text('name').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export const RevenueTable = sqliteTable('revenues', {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    uid: text('uid').notNull().unique(),
    spreadsheet: text('spreadsheet').references(() => SpreadsheetsTable.uid),
    paymentOption: text('payment_option').references(
        () => PaymentOptionsTable.uid,
    ),
    month: integer('month').notNull(),
    year: integer('year').notNull(),
    date: integer('date').notNull(),
    amount: integer('amount').notNull(),
    description: text('description').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export const ExpenseCategoryTable = sqliteTable('expense_categories', {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    uid: text('uid').notNull().unique(),
    spreadsheet: text('spreadsheet').references(() => SpreadsheetsTable.uid),
    name: text('name').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

export const ExpenseTable = sqliteTable('expenses', {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    uid: text('uid').notNull().unique(),
    spreadsheet: text('spreadsheet').references(() => SpreadsheetsTable.uid),
    category: text('category').references(() => ExpenseCategoryTable.uid),
    paymentOption: text('payment_option').references(
        () => PaymentOptionsTable.uid,
    ),
    month: integer('month').notNull(),
    year: integer('year').notNull(),
    date: integer('date').notNull(),
    fixed: integer('fixed', { mode: 'boolean' }).notNull(),
    amount: integer('amount').notNull(),
    description: text('description').notNull(),
    metadata: text('metadata', { mode: 'json' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});
