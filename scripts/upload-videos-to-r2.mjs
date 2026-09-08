import fs from "node:fs/promises";
import path from "node:path";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const ROOT = process.cwd();
const WEB_DIR = path.join(ROOT, ".tmp/web-videos");

/** Compressed web MP4s → same public R2 object keys (overwrite). */
const uploads = [
  "fini_thumbnail.mp4",
  "fini_proactiveAtomization.mp4",
  "fini_voiceTaskEntry.mp4",
  "strawberryMatcha_thumbnail.mp4",
  "strawberryMatcha_demo_01.mp4",
  "strawberryMatcha_demo_02.mp4",
  "strawberryMatcha_demo_03.mp4",
];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Create an R2 API token in Cloudflare Dashboard → R2 → Manage R2 API Tokens, then add it to .env.local.`
    );
  }
  return value;
}

async function main() {
  const accountId = requireEnv("R2_ACCOUNT_ID");
  const accessKeyId = requireEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("R2_SECRET_ACCESS_KEY");
  const bucket = process.env.R2_BUCKET_NAME ?? "portfolio-media";
  const publicBase =
    process.env.R2_PUBLIC_BASE ??
    "https://pub-c7669d9caa7d49c9b61a17793af8c3a0.r2.dev";

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  for (const key of uploads) {
    const abs = path.join(WEB_DIR, key);
    const body = await fs.readFile(abs);
    const mb = (body.byteLength / 1024 / 1024).toFixed(1);

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: "video/mp4",
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    // eslint-disable-next-line no-console
    console.log(`${key} (${mb} MB) -> ${publicBase}/${key}`);
  }

  // eslint-disable-next-line no-console
  console.log("\nDone. Overwrote R2 objects with compressed web videos.");
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
