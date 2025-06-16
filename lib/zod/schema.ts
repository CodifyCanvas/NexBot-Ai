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
    newPassword: z.string().min(6, "Make your new password at least 6 chars long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Oops! Passwords don't match",
    path: ["confirmPassword"],
  }); 

export const nameSchema = z.object({
  name: z
  .string()
  .min(3, "Your name is too short — minimum 3 characters required")
  .max(20, "Name cannot exceed 20 characters"),

});

export const imageSchema = z.object({
  file: z
    .instanceof(File)
    .nullable()
    .refine((file) => file !== null, { message: "Choose an image to upload" })
    .refine((file) => file === null || file.size <= 5 * 1024 * 1024, { message: "Image must be smaller than 5MB" })
    .refine(
      (file) =>
        file === null ||
        ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      {
  message: "Unsupported format — try JPG, PNG, or GIF 🚀",
}
    ),
});

// ✅ Zod schema for validation
export const contactUsFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});