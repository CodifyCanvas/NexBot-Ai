"use client";
import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Images, Names } from '@/constants/constants';

type ConfirmationDialog = {
  title?: string;
  description?: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  confirmButtonClassName?: string;
  children: React.ReactNode;
  onConfirm: () => void;
};

const ConfirmationDialog: React.FC<ConfirmationDialog> = ({ title, description, confirmButtonLabel = "Yes", cancelButtonLabel = "No", confirmButtonClassName, children, onConfirm, }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true)
      await onConfirm();
      setIsOpen(false);
    } catch (err) {
      console.log(`Error: `, err)
    } finally {
      setLoading(false)
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger className='w-full'>{children}</AlertDialogTrigger>
      <AlertDialogContent className='isolate bg-white/10 backdrop-blur-xl shadow-lg md:outline-1 outline-white/20 border dark:border-none border-black/10'>
        <AlertDialogHeader>
          <AlertDialogDescription className='flex flex-row items-center gap-2'>
            <Image src={Images.main_logo_transparent} alt="logo" width={16} height={16} />
            {Names.app_name}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer" onClick={() => setIsOpen(false)}>{cancelButtonLabel}</AlertDialogCancel>
          <AlertDialogAction className={`${confirmButtonClassName}`} onClick={handleConfirm} disabled={loading}>{loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" />
                Processing...
              </div>
            ) : (
              confirmButtonLabel
            )}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmationDialog;
