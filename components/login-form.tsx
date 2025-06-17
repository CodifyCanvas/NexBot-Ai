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
import { loginSchema } from "@/lib/zod/schema"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { Eye, EyeClosed } from "lucide-react"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Submit handler
  async function onSubmit(data: z.infer<typeof loginSchema>) {
    setLoading(true);
  
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false, // prevent redirect on failure
      callbackUrl: '/chat',
    });
  
    setLoading(false);

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast.warning("Oops!", {
          description: "We couldn't log you in. Double-check your email and password.",
          richColors: true,
        });
        
      } else {
        toast.error("Failed to Process", {
          description: `We're having trouble: ${result.error}. Check logs or try again.`,
          richColors: true,
        });
        
      }
    } else if (result?.ok) {
      toast.success("Success", {
        description: `Successfully logged in. Welcome back!`,
        richColors: true,
      });

      router.push('/chat');
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
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm">
            Enter your credentials to access your account.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input id="login-email" type="email" placeholder="you@example.com" {...field} />
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
                <div className="flex justify-between items-center">
                  <FormLabel>Password</FormLabel>
                  <a
                    href="#"
                    className="text-sm text-white underline-offset-4 hover:text-blue-400 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <FormControl>
                  <div className="relative">
                    {showPassword
                      ? <EyeClosed onClick={() => setShowPassword(false)} size={15} className="absolute right-3 bottom-1/2 translate-y-1/2 text-gray-300 hover:text-white transition-colors cursor-pointer" />
                      : <Eye onClick={() => setShowPassword(true)} size={15} className="absolute right-3 bottom-1/2 translate-y-1/2 text-gray-300 hover:text-white transition-colors cursor-pointer" />
                    }
                    <Input id="login-password" type={showPassword ? "text" : "password"} placeholder="••••••" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-gradient-to-tr active:to-blue-800 active:from-blue-500 from-blue-400 to-blue-700  text-white cursor-pointer" disabled={loading}>  
            {loading ? <Spinner className="mr-2" /> : 'Login'}
          </Button>

          
        </div>

        {/* Footer */}
        <div className="text-center text-sm ">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline underline-offset-4 text-blue-400">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  )
}
