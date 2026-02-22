import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const DashboardLayout =async ({children}:{children:React.ReactNode}) => {
  const session=await auth.api.getSession({
    headers:await headers()
  })

  if (!session?.session ) {
    redirect('/signin')
  }
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
