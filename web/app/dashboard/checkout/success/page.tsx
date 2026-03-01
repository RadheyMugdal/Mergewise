"use client"

import { Suspense } from "react";
import PaymentSuccessPage from "@/modules/dashboard/components/PaymentSuccessPage";
import { CornerLoader } from "@/components/ui/corner-loader";

export default function SuccessPage() {

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">
      <CornerLoader />
    </div>}>
      <PaymentSuccessPage />
    </Suspense>
  );
}
