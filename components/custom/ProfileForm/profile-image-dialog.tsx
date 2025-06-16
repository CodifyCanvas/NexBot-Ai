// ProfileImageDialog.tsx
"use client";

import React, { useState, useMemo } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CircleCheckIcon } from "lucide-react";
import { useUserContext } from "@/hooks/context/userContext";
import { imageSchema } from "@/lib/zod/schema";
import Spinner from "../Spinner";
import Image from "next/image";

type FormValues = z.infer<typeof imageSchema>;

interface Props {
  onClose: () => void;
}

const ProfileImageDialog: React.FC<Props> = ({ onClose }) => {
  const { user, refetch } = useUserContext();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(imageSchema),
    defaultValues: { file: null },
  });

  const selectedFile = form.watch("file");

  const previewUrl = useMemo(() => {
    if (selectedFile instanceof File) {
      return URL.createObjectURL(selectedFile);
    }
    return null;
  }, [selectedFile]);

  const handleSubmit = async (data: FormValues) => {
    if (!data.file) {
      toast.error("Please select an image to upload");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", data.file);

      const response = await fetch("/api/user/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Upload failed:", error);
        toast.error("Failed to update profile image");
        return;
      }

      toast.custom(
        () => (
          <div className="isolate p-4 w-80 bg-green-300/50 dark:bg-green-300/20 backdrop-blur-2xl shadow-lg border dark:border-none border-black/10 md:rounded-md flex items-center gap-2">
            <CircleCheckIcon size={17} className="text-green-800 dark:text-green-300" />
            <span className="font-semibold text-sm text-green-800 dark:text-green-300 truncate">
              Profile image updated successfully
            </span>
          </div>
        ),
        { position: "top-center" }
      );

      await refetch();
      onClose();
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An error occurred while uploading the image", { richColors: true });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-white/50 dark:bg-white/10 backdrop-blur-xl shadow-lg border dark:border-none border-black/10">
        <DialogHeader>
          <DialogTitle>Update Profile Image</DialogTitle>
          <DialogDescription className="text-gray-700 dark:text-gray-400">
            Select and upload a new profile image.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center">
          {previewUrl ? (
            <div className="relative w-60 h-60 rounded-lg outline outline-gray-300 dark:outline-gray-600 overflow-hidden">
              <Image src={previewUrl} alt="New preview" fill style={{ objectFit: "cover" }} priority />
            </div>
          ) : user?.profileImg ? (
            <div className="relative w-60 h-60 rounded-lg outline outline-gray-300 dark:outline-gray-600 overflow-hidden">
              <Image src={user.profileImg} alt="Current profile" fill style={{ objectFit: "cover" }} priority />
            </div>
          ) : (
            <div className="w-36 h-36 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-600">
              No Image
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-1">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Image</FormLabel>
                  <FormControl>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        field.onChange(file);
                      }}
                      className="cursor-pointer text-gray-300 h-10 w-full bg-white/5 backdrop-blur-xl rounded-lg content-center px-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-5 flex flex-row justify-end gap-3">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="w-1/2 bg-white/40 sm:w-28 dark:bg-white/5">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isUploading}
                className="w-1/2 sm:w-28 text-white bg-gradient-to-tr from-blue-500 to-blue-800 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
              >
                {isUploading ? <Spinner /> : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileImageDialog;
