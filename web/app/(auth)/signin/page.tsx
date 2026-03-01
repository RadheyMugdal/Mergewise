"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, Github } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { CornerLoader } from "@/components/ui/corner-loader";


export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
 const {data,isPending}=authClient.useSession()
  if (isPending) {
    return(
       <div className="flex items-center justify-center h-screen">
        <CornerLoader/>
       </div>
    )
  }
   if (data?.session){
    router.push('/dashboard')
   }

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social(
        {
          provider: "github"
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
            toast.success("Welcome back!");
          },
          onError: () => {
            toast.error("Failed to sign in. Please try again.");
          }
        }
      );
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />

      {/* Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-xl">
            <Terminal className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">Mergewise</span>
        </div>

        {/* Sign In Card */}
        <Card className=" border-0 px-8 shadow-xl">
          <CardHeader className="text-center space-y-2 pb-6">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription className="text-base">
              Sign in to access your code review dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* GitHub Sign In Button */}
            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              <Github className="w-5 h-5 mr-2" />
              {isLoading ? "Connecting to GitHub..." : "Continue with GitHub"}
            </Button>

            {/* Info text */}
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>
                By continuing, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>

          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
          >
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
