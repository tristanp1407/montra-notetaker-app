"use client";

import dynamic from "next/dynamic";

const TitleEditor = dynamic(() => import("./title-editor"), { ssr: false });

export default function TitleEditorWrapper(props: {
  projectId: string;
  initialTitle: string;
}) {
  return <TitleEditor {...props} />;
}
