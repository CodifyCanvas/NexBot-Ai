"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import NewPasswordFields from "./newPasswordFields";
import { verifyPasswordSchema } from "@/lib/zod/schema";
import Spinner from "../Spinner";
import { Eye, EyeClosed } from "lucide-react";



type VerifyFormValues = z.infer<typeof verifyPasswordSchema>;

interface ProfilePasswordFieldProps {
  onClose: () => void;
}

const ProfilePasswordField: React.FC<ProfilePasswordFieldProps> = ({ onClose }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const verifyForm = useForm<VerifyFormValues>({
    resolver: zodResolver(verifyPasswordSchema),
    defaultValues: { currentPassword: "" },
  });

  const handleVerify = async (values: VerifyFormValues) => {
    try {
      setloading(true);
      const res = await fetch("/api/user/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: values.currentPassword.trim() }),
      });

      if (!res.ok) {
        toast.error("Incorrect password. Please try again.", {
          richColors: true,
        });
        return; 
      }

      setStep(2); // Move to step 2 after successful verification
    } catch (err) {
      console.error(err);
      toast.error("Failed to verify password. Try again.", {
        richColors: true,
      });
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Update Password</DialogTitle>
        <DialogDescription className="text-gray-700 dark:text-gray-400">
          {step === 1
            ? "Enter your current password to continue."
            : "Set your new password below."}
        </DialogDescription>
      </DialogHeader>

      {step === 1 ? (
        <Form {...verifyForm}>
          <form onSubmit={verifyForm.handleSubmit(handleVerify)} className="space-y-4 mt-2">
            <FormField
              control={verifyForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem> 
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                    {showPassword
                      ? <EyeClosed onClick={() => setShowPassword(false)} size={15} className="absolute right-3 bottom-1/2 translate-y-1/2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer" />
                      : <Eye onClick={() => setShowPassword(true)} size={15} className="absolute right-3 bottom-1/2 translate-y-1/2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer" />
                    }
                    <Input id="current-password-field" type={showPassword ? "text" : "password"} placeholder="••••••" {...field} />
                  </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="bg-white/40 dark:bg-white/5" onClick={onClose}>
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={loading} type="submit" className="bg-gradient-to-tr from-blue-500 to-blue-800 text-white sm:w-20">{loading ? <Spinner /> : 'Next'}</Button>
            </DialogFooter>
          </form>
        </Form>
      ) : (
        <NewPasswordFields onClose={onClose} />
      )}
    </>
  );
};

export default ProfilePasswordField;
