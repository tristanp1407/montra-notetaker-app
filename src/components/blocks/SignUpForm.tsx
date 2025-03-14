import { useState, FormHTMLAttributes } from "react";

import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Input } from "@components/ui/input";

type SignUpFormProps = FormHTMLAttributes<HTMLFormElement> & {
  isPending?: boolean;
};

export function SignUpForm({
  className,
  isPending,
  ...props
}: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className={cn("w-[400px] flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>A few steps to access the app</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  className="pl-10 bg-gray-100"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="pl-10 pr-10 bg-gray-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing up..." : "Sign up"}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/sign-in" className="text-black hover:underline">
              Sign in
            </a>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
