CREATE TABLE `favoriteChats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`chat_id` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `favoriteChats_id` PRIMARY KEY(`id`),
	CONSTRAINT `favoriteChats_chat_id_unique` UNIQUE(`chat_id`)
);
--> statement-breakpoint
DROP TABLE `favouritesChats`;--> statement-breakpoint
ALTER TABLE `favoriteChats` ADD CONSTRAINT `favoriteChats_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;