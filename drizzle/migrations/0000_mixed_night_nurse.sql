CREATE TABLE `chats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`chat_id` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`is_shareable` boolean NOT NULL DEFAULT false,
	`color` int NOT NULL DEFAULT 1,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `chats_id` PRIMARY KEY(`id`),
	CONSTRAINT `chats_chat_id_unique` UNIQUE(`chat_id`)
);
--> statement-breakpoint
CREATE TABLE `contact_us` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`responded_at` datetime,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `contact_us_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `favoriteChats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`chat_id` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `favoriteChats_id` PRIMARY KEY(`id`),
	CONSTRAINT `favoriteChats_chat_id_unique` UNIQUE(`chat_id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`chat_id` varchar(255) NOT NULL,
	`message` varchar(10000) NOT NULL,
	`sender` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profile_img` text,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`admin` boolean NOT NULL DEFAULT false,
	`verified` boolean NOT NULL DEFAULT false,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `chats` ADD CONSTRAINT `chats_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favoriteChats` ADD CONSTRAINT `favoriteChats_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_chat_id_chats_chat_id_fk` FOREIGN KEY (`chat_id`) REFERENCES `chats`(`chat_id`) ON DELETE no action ON UPDATE no action;