import { ReactNode } from "react";

export default async function ProjectPageLayout({
  children,
}: {
  children: ReactNode;
}) {
  // const supabase = await createClient();
  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();

  // if (!session) redirect("/sign-in");

  return <>{children}</>;
}
