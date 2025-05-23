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

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogDescription className='flex flex-row items-center gap-2'>
            <Image src='/assets/images/main_logo_transparent.png' alt="logo" width={16} height={16} />
            NexBot
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer" onClick={() => setIsOpen(false)}>{cancelButtonLabel}</AlertDialogCancel>
          <AlertDialogAction className={`${confirmButtonClassName}`} onClick={handleConfirm}>{confirmButtonLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmationDialog;
