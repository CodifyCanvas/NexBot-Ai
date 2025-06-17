"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Spinner from "./custom/Spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { signupSchema } from "@/lib/zod/schema"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { Eye, EyeClosed } from "lucide-react"


export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)


  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Submit handler
  async function onSubmit(data: z.infer<typeof signupSchema>) {
    setLoading(true);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      setLoading(false);

      if (!res.ok) {
        if (res.status === 403) {
          toast.warning("Oops!", {
            description: "Account already exists.",
            richColors: true,
          });
        } else {
          toast.error("Failed to Process", {
            description: `We're having trouble: ${responseData.error || "Unknown error"}.`,
            richColors: true,
          });
        }
        return;
      }

      // Success case
      toast.success("Success", {
        description: "Account created! Access will be granted after admin verification.",
        richColors: true,
      });

    } catch (error) {
      setLoading(false);
      console.error("Signup error:", error);
      toast.error("Error", {
        description: "Something went wrong. Please try again later.",
        richColors: true,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm">
            Fill in your details to create your account.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input id="signup-name" type="text" placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input id="signup-email" type="email" placeholder="john123@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    {showPassword
                      ? <EyeClosed onClick={() => setShowPassword(false)} size={15} className="absolute right-3 bottom-1/2 translate-y-1/2 text-gray-300 hover:text-white transition-colors cursor-pointer" />
                      : <Eye onClick={() => setShowPassword(true)} size={15} className="absolute right-3 bottom-1/2 translate-y-1/2 text-gray-300 hover:text-white transition-colors cursor-pointer" />
                    }
                    <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="••••••" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    {showConfirmPassword
                      ? <EyeClosed onClick={() => setShowConfirmPassword(false)} size={15} className="absolute right-3 bottom-1/2 translate-y-1/2 text-gray-300 hover:text-white transition-colors cursor-pointer" />
                      : <Eye onClick={() => setShowConfirmPassword(true)} size={15} className="absolute right-3 bottom-1/2 translate-y-1/2 text-gray-300 hover:text-white transition-colors cursor-pointer" />
                    }
                    <Input id="signup-confirm-password" type={showConfirmPassword ? "text" : "password"} placeholder="••••••" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-gradient-to-tr active:to-blue-800 active:from-blue-500 from-blue-400 to-blue-700  text-white cursor-pointer" disabled={loading}>
            {loading ? <Spinner className="mr-2" /> : 'Sign Up'}
          </Button>


        </div>

        {/* Footer */}
        <div className="text-center text-sm ">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4 text-blue-400">
            Login
          </Link>
        </div>
      </form>
    </Form>
  )
}
