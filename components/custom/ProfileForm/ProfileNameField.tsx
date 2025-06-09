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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CircleCheckIcon } from "lucide-react";
import { useUserContext } from "@/hooks/context/userContext";
import { nameSchema } from "@/lib/zod/schema";
import Spinner from "../Spinner";

type NameFormValues = z.infer<typeof nameSchema>;

interface ProfileNameFieldProps {
  onClose: () => void;
} 

const ProfileNameField: React.FC<ProfileNameFieldProps> = ({ onClose }) => {
  const { user, refetch } = useUserContext();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<NameFormValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  const watchedName = form.watch("name");

  const isSameName =
    watchedName.trim().toLowerCase() === user?.name?.trim().toLowerCase();

  const onSubmit = async (values: NameFormValues) => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: values.name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update name:', errorData.error);
        return;
      }

      toast.custom((id) => (
        <div className="isolate p-4 w-80 bg-green-300/50 dark:bg-green-300/20 backdrop-blur-2xl shadow-lg md:outline-1 outline-white/20 border dark:border-none border-black/10 md:rounded-md flex items-center gap-2">
          <CircleCheckIcon size={17} className="text-green-800 dark:text-green-300" />
          <span className="font-semibold text-sm whitespace-nowrap overflow-hidden text-green-800 dark:text-green-300 text-ellipsis">
            Name Updated Successfully
          </span>
        </div>
      ), {
        position: 'top-center',
      });

      refetch();
      onClose();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Something went wrong while updating your name', {
        richColors: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Update Display Name</DialogTitle>
        <DialogDescription className="text-gray-700 dark:text-gray-400">
          Set your new display name and save the changes.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-1">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g, Shahzaib Awan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isSameName && (
  <p className="text-xs -mt-3 text-gray-700 dark:text-gray-400">
    This is already your current name.
  </p>
)}

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={onClose} className="bg-white/40 dark:bg-white/5">
                Cancel
              </Button>
            </DialogClose>
              <Button
  type="submit"
  disabled={isSameName || loading}
  className="w-20 text-white bg-gradient-to-tr from-blue-500 to-blue-800 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
>
  {loading ? <Spinner /> : "Update"}
</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};


export default ProfileNameField;
