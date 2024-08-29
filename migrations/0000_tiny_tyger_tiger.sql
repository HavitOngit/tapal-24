CREATE TABLE `changes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`date` integer NOT NULL,
	`data` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `school` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`address` text DEFAULT 'null'
);
--> statement-breakpoint
CREATE TABLE `todo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`done` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `univarsalList` (
	`id` integer NOT NULL,
	`name` text NOT NULL,
	`image` text NOT NULL,
	`time` integer
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`image` text NOT NULL
);
