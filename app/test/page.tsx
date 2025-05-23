"use client"
import DynamicAlertDialog from '@/components/custom/AlertDialog'
import { Input } from '@/components/ui/input'
import { Link } from 'lucide-react'
import React from 'react'

const handleLogOut = () => {
  console.log("Logging out...");
}
const page = () => {
  return (
    <div className='flex-1 flex items-center justify-center'>
        <div className='w-full flex-1 flex items-center justify-center pt-[200px]'>
        <DynamicAlertDialog
        title="Are you sure you want to log out?"
        description="You will be logged out of your account. Are you sure you want to proceed?"
        acceptText="yes, log out"
        rejectText="No"
        onContinue={handleLogOut} // Calls the handleLogOut function on continue
      ><Link />Logout</DynamicAlertDialog>
        </div>
    </div>
  )
}

export default page