import { FormHTMLAttributes } from "react";

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
import { Label } from "@components/ui/label";

type SignInFormProps = FormHTMLAttributes<HTMLFormElement> & {
  isPending?: boolean;
};

export function SignInForm({
  className,
  isPending,
  ...props
}: SignInFormProps) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>A few steps to access Redraft</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account? <a href="/sign-up">Sign up</a>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
