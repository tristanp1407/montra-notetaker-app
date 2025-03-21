import { createClient } from "@utils/supabase/client";

export type FileType =
  | "audio"
  | "video"
  | "image"
  | "pdf"
  | "text"
  | "doc"
  | "other";

interface UploadToStorageOptions {
  file: File;
  draftId: string;
}

export async function uploadToStorage({
  file,
  draftId,
}: UploadToStorageOptions): Promise<{
  url: string | null;
  path: string;
  type: FileType;
  error?: string;
}> {
  let supabase;
  try {
    supabase = await createClient();
  } catch (error) {
    console.error("[uploadToStorage] Failed to create Supabase client:", error);
    return {
      url: null,
      path: "",
      type: "other",
      error: "Failed to initialize Supabase client",
    };
  }

  const mime = file.type;
  const extension = file.name.split(".").pop()?.toLowerCase();
  let type: FileType = "other";

  // Determine file type
  if (mime.startsWith("audio")) type = "audio";
  else if (mime.startsWith("video")) type = "video";
  else if (mime.startsWith("image")) type = "image";
  else if (mime === "application/pdf") type = "pdf";
  else if (mime.startsWith("text")) type = "text";
  else if (
    mime.includes("msword") ||
    mime.includes("officedocument") ||
    extension === "docx"
  )
    type = "doc";

  const timestamp = Date.now();
  const sanitizedFilename = file.name.replace(/\s+/g, "_");
  const storagePath = `public/${draftId}/${timestamp}-${sanitizedFilename}`;

  try {
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("project-files")
      .upload(storagePath, file, {
        contentType: mime,
        upsert: true,
      });

    if (uploadError) {
      console.error("[uploadToStorage] Upload failed:", uploadError.message);
      return {
        url: null,
        path: storagePath,
        type,
        error: `Upload failed: ${uploadError.message}`,
      };
    }

    // Get public URL
    const { data: publicUrlData, error: publicUrlError } = supabase.storage
      .from("project-files")
      .getPublicUrl(storagePath);

    if (publicUrlError) {
      console.error(
        "[uploadToStorage] Failed to retrieve public URL:",
        publicUrlError.message
      );
      return {
        url: null,
        path: storagePath,
        type,
        error: `Failed to retrieve public URL: ${publicUrlError.message}`,
      };
    }

    return {
      url: publicUrlData?.publicUrl ?? null,
      path: storagePath,
      type,
    };
  } catch (error) {
    console.error("[uploadToStorage] Unexpected error:", error);
    return {
      url: null,
      path: storagePath,
      type,
      error: "An unexpected error occurred during the upload process",
    };
  }
}
