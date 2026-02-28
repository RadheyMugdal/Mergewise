import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Monitor your code reviews, repository activity, and usage stats. Get AI-powered insights for your GitHub repositories.",
  robots: {
    index: false,
    follow: true,
  },
}

const DashboardLayout =async ({children}:{children:React.ReactNode}) => {
  
  return (  
 <SidebarProvider>
     <AppSidebar />
     <SidebarInset>
        {children}
     </SidebarInset>
 </SidebarProvider>
  )
}

export default DashboardLayout
