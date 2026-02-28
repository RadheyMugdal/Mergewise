"use client"

import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const subscriptionId = searchParams.get("subscription_id");
  const status = searchParams.get("status");
  const email = searchParams.get("email");

  const isPending = status === "pending";
  const isSucceeded = status === "succeeded";
  const isFailed = status === "failed" || status === "cancelled";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8 space-y-6">
          {/* Status Icon */}
          <div className="flex justify-center">
            <div className="relative">
              {isSucceeded && (
                <>
                  <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                  <CheckCircle2 className="relative w-20 h-20 text-green-500" strokeWidth={1.5} />
                </>
              )}
              {isPending && (
                <>
                  <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-pulse" />
                  <Clock className="relative w-20 h-20 text-yellow-500" strokeWidth={1.5} />
                </>
              )}
              {isFailed && (
                <>
                  <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
                  <AlertCircle className="relative w-20 h-20 text-red-500" strokeWidth={1.5} />
                </>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              {isSucceeded && "Payment Successful!"}
              {isPending && "Payment Pending"}
              {isFailed && "Payment Failed"}
            </h1>
            <p className="text-muted-foreground">
              {isSucceeded && "You've successfully upgraded to the Pro plan. Enjoy all the premium features!"}
              {isPending && "Your payment is being processed. We'll send a confirmation email once it's complete."}
              {isFailed && "Something went wrong with your payment. Please try again or contact support."}
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge
              variant={isSucceeded ? "default" : isPending ? "secondary" : "destructive"}
              className="text-sm px-3 py-1"
            >
              Status: {status || "unknown"}
            </Badge>
          </div>

          {/* Subscription Details */}
          {subscriptionId && (
            <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2">
              <p className="text-sm font-semibold text-foreground">Subscription Details:</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Subscription ID: <span className="font-mono">{subscriptionId}</span></p>
                {email && <p>Email: {email}</p>}
              </div>
            </div>
          )}

          {/* Features List - Only show for successful/pending */}
          {(isSucceeded || isPending) && (
            <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2">
              <p className="text-sm font-semibold text-foreground">Your Pro plan includes:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Unlimited repositories</li>
                <li>✓ Unlimited PR reviews</li>
                <li>✓ Advanced AI analysis</li>
                <li>✓ Priority support</li>
                <li>✓ API access</li>
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1" asChild>
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
            {isFailed && (
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/dashboard/pricing">
                  Try Again
                </Link>
              </Button>
            )}
            {!isFailed && (
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/dashboard/pricing">
                  Manage Plan
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
