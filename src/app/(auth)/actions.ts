"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@utils/supabase/server";
import { authSchema, AuthFormData } from "@customTypes/auth";

export async function signin(formData: FormData) {
  const supabase = await createClient();

  // Extract raw values from FormData
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // Validate and parse the data
  const parseResult = authSchema.safeParse(rawData);
  if (!parseResult.success) {
    console.error("Sign in validation failed:", parseResult?.error);
    return { error: "Invalid email or password" };
  }

  const data: AuthFormData = parseResult.data;

  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    console.error("Supabase sign in error:", error);
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/projects");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // Extract and validate data from FormData
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parseResult = authSchema.safeParse(rawData);
  if (!parseResult.success) {
    console.error("Sign up validation failed:", parseResult.error);
    return { error: "Invalid email or password" };
  }

  const data: AuthFormData = parseResult.data;
  const { error } = await supabase.auth.signUp(data);
  if (error) {
    console.error("Supabase sign up error:", error);
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/projects");
}
