import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

export function isR2Configured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET &&
    process.env.R2_ENDPOINT &&
    process.env.R2_PUBLIC_BASE_URL
  );
}

function getClient(): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export async function uploadToR2(
  buffer: Buffer,
  mimeType: string,
  ext: string,
  category = "uploads",
): Promise<{ url: string; key: string }> {
  const key = `${category}/${randomUUID()}${ext}`;
  await getClient().send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    }),
  );
  const base = process.env.R2_PUBLIC_BASE_URL!.replace(/\/$/, "");
  return { key, url: `${base}/${key}` };
}

export async function deleteFromR2(publicUrl: string): Promise<void> {
  if (!isR2Configured() || !publicUrl) return;

  const base = process.env.R2_PUBLIC_BASE_URL!.replace(/\/$/, "");
  let parsed: URL;
  try {
    parsed = new URL(publicUrl);
  } catch {
    return;
  }

  const baseHost = new URL(base).host;
  if (parsed.host !== baseHost) return;

  const key = parsed.pathname.slice(1); // strip leading "/"
  if (!key) return;

  try {
    await getClient().send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
      }),
    );
  } catch (e) {
    console.error("[R2] Failed to delete object:", key, e);
  }
}
