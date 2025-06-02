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
import { refreshChats } from "@/lib/chat-refresh";

interface DeleteAllChatsProps {
  onClose: () => void;
}

const deleteConfirmationSchema = z.object({
  confirmation: z
    .string()
    .refine((val) => val.trim().toLowerCase() === "delete all chats", {
      message: "You must type 'delete all chats' to proceed.",
    }),
});

type DeleteFormValues = z.infer<typeof deleteConfirmationSchema>;

const DeleteAllChats: React.FC<DeleteAllChatsProps> = ({ onClose }) => {
  const form = useForm<DeleteFormValues>({
    resolver: zodResolver(deleteConfirmationSchema),
    defaultValues: { confirmation: "" },
  });

  const onSubmit = async () => {
    try {
      const response = await fetch("/api/chats", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to delete chats");
      }

      toast.custom(() => (
        <div className="isolate p-4 w-80 bg-red-700/75 dark:bg-red-500/20 backdrop-blur-2xl shadow-lg border border-black/10 dark:border-none rounded-md flex items-center gap-2">
          <CircleCheckIcon size={17} className="text-red-200 dark:text-red-400" />
          <span className="font-semibold text-sm text-red-200 dark:text-red-400">
            All Chats Deleted Successfully
          </span>
        </div>
      ), {
        position: 'top-center',
        duration: 3000,
      });
      
      refreshChats();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Could not delete chats.", {
        richColors: true,
      });
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete All Chats</DialogTitle>
        <DialogDescription className="text-gray-700 dark:text-gray-400">
          This action is irreversible. To confirm, type <strong className="font-semibold">delete all chats</strong> below.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-1">
          <FormField
            control={form.control}
            name="confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type to Confirm</FormLabel>
                <FormControl>
                  <Input placeholder="Delete all chats" {...field} />
                </FormControl>
                <FormDescription  className="text-gray-600 dark:text-gray-400">You must type &apos;Delete all chats&apos; to proceed.</FormDescription>
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
            <Button type="submit" className="danger_button" variant="destructive" disabled={!form.formState.isValid}>
              Delete All Chats
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default DeleteAllChats;
