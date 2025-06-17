"use client";

import React from "react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CircleCheckIcon } from "lucide-react";
import { handleSignOut } from "@/app/login/authActions";
import { User } from "@/lib/definations";

interface DeleteAllAccountProps {
  onClose: () => void;
  user: User | null;
}

const DeleteAllAccount: React.FC<DeleteAllAccountProps> = ({ onClose, user }) => {

  const deleteConfirmationSchema = z.object({
  confirmation: z.string().refine(
    (val) => user?.email && val.trim().toLowerCase() === user.email.trim().toLowerCase(),
    { message: `You must type "${user?.email}" to proceed.` }
  ),
});

  const form = useForm<z.infer<typeof deleteConfirmationSchema>>({
    resolver: zodResolver(deleteConfirmationSchema),
    defaultValues: { confirmation: "" },
  });

  const onSubmit = async () => {
  try {
    const response = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("API error:", error);
      throw new Error("Failed to delete account");
    }

    toast.custom(() => (
      <div className="isolate p-4 w-80 bg-red-700/75 dark:bg-red-500/20 backdrop-blur-2xl shadow-lg border border-black/10 dark:border-none rounded-md flex items-center gap-2">
        <CircleCheckIcon size={17} className="text-red-200 dark:text-red-400" />
        <span className="font-semibold text-sm text-red-200 dark:text-red-400">
          Your Account Deleted Successfully
        </span>
      </div>
    ), {
      position: 'top-center',
      duration: 3000,
    });

    onClose();

    try {
      await handleSignOut(); // this might be the real source of the error
    } catch (signOutErr) {
      console.error("Sign out failed:", signOutErr);
      // Optionally show a separate toast here
    }
  } catch (error) {
    console.error("Delete account error:", error);
    toast.error("Something went wrong. Could not delete account.", {
      richColors: true,
    });
  }
};



  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogDescription className="text-gray-700 dark:text-gray-400">
          This action is irreversible.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-1">
          <FormField
            control={form.control}
            name="confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm by typing your email</FormLabel>
                <FormControl>
                  <Input id="confirmation-delete-account-field" placeholder="example@domain.com" {...field} />
                </FormControl>
                <FormDescription className="text-gray-600 dark:text-gray-400">
                  You must type <strong>{user?.email}</strong> to proceed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button type="button" className="bg-white/40 dark:bg-white/5" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="destructive"
              disabled={!form.formState.isValid}
              className="danger_button"
            >
              Delete Account
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default DeleteAllAccount;
