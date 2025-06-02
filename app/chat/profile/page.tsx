// app/chat/profile/page.tsx
import ProfileForm from '@/components/custom/ProfileForm';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "NexBot - Profile",
  description: "Manage your personal information, update your account settings, and customize your experience. Everything about you, in one place.",
};

const page = () => {
  return (
    <div className='flex h-full w-full flex-col p-2 realtive gap-6 z-20 px-10 py-5'>
      <div className='flex flex-col items-start justify-center gap-2 text-center z-20 w-full'>
        <h1 className='text-xl text-white sm:text-2xl md:text-3xl'>Profile</h1>
      </div>
      <ProfileForm />
    </div>
  )
}

export default page