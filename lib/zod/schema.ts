// This file contains the Zod schemas for validating user input in the application.
import { z } from "zod"

/**
 * 🔐 Login schema
 * Validates user login inputs.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

/**
 * 📝 Signup schema
 * Validates inputs for user registration.
 */
export const signupSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long." })
      .max(30, { message: "Name must not exceed 30 characters." }),
    email: z
      .string()
      .email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Oops! Passwords don't match.",
    path: ["confirmPassword"],
  });


/**
 * 🔑 Verify current password schema
 */
export const verifyPasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

/**
 * 🔁 New password schema
 * Ensures new password and confirmation match.
 */
export const newPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Make your new password at least 6 chars long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Oops! Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * ✏️ Name schema (e.g., profile update)
 */
export const nameSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(20, { message: "Name must not exceed 20 characters." }),
});

/**
 * 🖼️ Image upload schema
 * Validates uploaded image file size & type.
 */
export const imageSchema = z.object({
  file: z
    .instanceof(File, { message: "Choose an image to upload" })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Image must be smaller than 5MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      {
        message: "Unsupported format — try JPG, PNG, or GIF 🚀",
      }
    ),
});


/**
 * 📩 Contact form schema
 * Validates user-submitted contact messages.
 */
export const contactUsFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." }),
  message: z
    .string()
    .min(5, { message: "Message must be at least 5 characters." }),
});