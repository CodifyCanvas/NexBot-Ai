// This file contains the Zod schemas for validating user input in the application.
import { z } from "zod"

// Define a schema for user Login validation
export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
})