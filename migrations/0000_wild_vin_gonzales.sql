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
	`image` text
);
