"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
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
import { CircleCheckIcon } from "lucide-react";
import { newPasswordSchema } from "@/lib/zod/schema";
import Spinner from "../Spinner";



type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;

interface NewPasswordFieldsProps {
  onClose: () => void;
}

const NewPasswordFields: React.FC<NewPasswordFieldsProps> = ({ onClose }) => {
    const [loading, setloading] = useState(false);
  
  const newPassForm = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const handlePasswordUpdate = async (values: NewPasswordFormValues) => {
    try {
      setloading(true);
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: values.newPassword.trim() }),
      });

      if (!res.ok) {
        toast.error("Failed to update password.", {
          richColors: true,
          position: 'top-center',
        }); 
        return;
      }

      toast.custom((id) => (
              <div className="isolate p-4 w-80 bg-green-300/50 dark:bg-green-300/20 backdrop-blur-2xl shadow-lg md:outline-1 outline-white/20 border dark:border-none border-black/10 md:rounded-md flex items-center gap-2">
                <CircleCheckIcon size={17} className="text-green-800 dark:text-green-300" />
                <span className="font-semibold text-sm whitespace-nowrap overflow-hidden text-green-800 dark:text-green-300 text-ellipsis">
                  Password Updated Successfully
                </span>
              </div>
            ), {
              position: 'top-center',
            });

      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.", {
        richColors: true,
      });
    } finally {
      setloading(false);
    }
  };

  return (
    <Form {...newPassForm}>
      <form onSubmit={newPassForm.handleSubmit(handlePasswordUpdate)} className="space-y-4 mt-2">
        <FormField
          control={newPassForm.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={newPassForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
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
                        <Button disabled={loading} type="submit" className="bg-gradient-to-tr from-blue-500 to-blue-800 text-white sm:w-20 hover:from-blue-700 hover:to-blue-800 transition-all duration-300">{loading ? <Spinner /> : 'Change'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default NewPasswordFields;
