CREATE TABLE `abstracts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uid` text NOT NULL,
	`spreadsheet` text,
	`name` text NOT NULL,
	`mount` integer NOT NULL,
	`year` integer NOT NULL,
	`budgets` text NOT NULL,
	`notes` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`spreadsheet`) REFERENCES `spreadsheets`(`uid`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `abstracts_uid_unique` ON `abstracts` (`uid`);--> statement-breakpoint
CREATE TABLE `expense_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uid` text NOT NULL,
	`spreadsheet` text,
	`name` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`spreadsheet`) REFERENCES `spreadsheets`(`uid`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `expense_categories_uid_unique` ON `expense_categories` (`uid`);--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uid` text NOT NULL,
	`spreadsheet` text,
	`category` text,
	`payment_option` text,
	`month` integer NOT NULL,
	`year` integer NOT NULL,
	`date` integer NOT NULL,
	`fixed` integer NOT NULL,
	`amount` integer NOT NULL,
	`description` text NOT NULL,
	`metadata` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`spreadsheet`) REFERENCES `spreadsheets`(`uid`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category`) REFERENCES `expense_categories`(`uid`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`payment_option`) REFERENCES `payment_options`(`uid`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `expenses_uid_unique` ON `expenses` (`uid`);--> statement-breakpoint
CREATE TABLE `payment_options` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uid` text NOT NULL,
	`spreadsheet` text,
	`name` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`spreadsheet`) REFERENCES `spreadsheets`(`uid`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_options_uid_unique` ON `payment_options` (`uid`);--> statement-breakpoint
CREATE TABLE `revenues` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uid` text NOT NULL,
	`spreadsheet` text,
	`payment_option` text,
	`month` integer NOT NULL,
	`year` integer NOT NULL,
	`date` integer NOT NULL,
	`amount` integer NOT NULL,
	`description` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`spreadsheet`) REFERENCES `spreadsheets`(`uid`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`payment_option`) REFERENCES `payment_options`(`uid`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `revenues_uid_unique` ON `revenues` (`uid`);--> statement-breakpoint
CREATE TABLE `spreadsheets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uid` text NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`password_reset_required` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `spreadsheets_uid_unique` ON `spreadsheets` (`uid`);--> statement-breakpoint
CREATE UNIQUE INDEX `spreadsheets_username_unique` ON `spreadsheets` (`username`);