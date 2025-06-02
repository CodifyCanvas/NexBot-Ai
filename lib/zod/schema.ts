// This file contains the Zod schemas for validating user input in the application.
import { z } from "zod"

// Define a schema for user Login validation
export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
})

export const verifyPasswordSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export const newPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }); 

export const nameSchema = z.object({
  name: z
  .string()
  .min(3, "Your name is too short — minimum 3 characters required")
  .max(20, "Name cannot exceed 20 characters"),

});