import fs from "node:fs/promises";
import path from "node:path";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const ROOT = process.cwd();

const uploads = [
  {
    local: "public/media/fini/design-build/proactiveAtomization.mp4",
    key: "fini_proactiveAtomization.mp4",
  },
  {
    local: "public/media/fini/design-build/voiceTaskEntry.mp4",
    key: "fini_voiceTaskEntry.mp4",
  },
  {
    local: "public/media/fini/system-architecture/system-layer.mp4",
    key: "fini_system-layer.mp4",
  },
  {
    local: "public/media/strawberryMatcha/demo/demo_01.mp4",
    key: "strawberryMatcha_demo_01.mp4",
  },
  {
    local: "public/media/strawberryMatcha/demo/demo_02.mp4",
    key: "strawberryMatcha_demo_02.mp4",
  },
  {
    local: "public/media/strawberryMatcha/demo/demo_03.mp4",
    key: "strawberryMatcha_demo_03.mp4",
  },
  {
    local: "public/media/aeon/principles/principle_1.mp4",
    key: "aeon_principle_1.mp4",
  },
  {
    local: "public/media/aeon/principles/principle_2.mp4",
    key: "aeon_principle_2.mp4",
  },
  {
    local: "public/media/aeon/principles/principle_3.mp4",
    key: "aeon_principle_3.mp4",
  },
  {
    local: "public/images/aeon/ia/visual-language/Floating Lights.mp3",
    key: "audio/Floating Lights.mp3",
    contentType: "audio/mpeg",
  },
  {
    local: "public/images/aeon/ia/visual-language/Gliding Through the Mist.mp3",
    key: "audio/Gliding Through the Mist.mp3",
    contentType: "audio/mpeg",
  },
  {
    local: "public/images/aeon/ia/visual-language/Silver Glider.mp3",
    key: "audio/Silver Glider.mp3",
    contentType: "audio/mpeg",
  },
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

  for (const { local, key, contentType } of uploads) {
    const abs = path.join(ROOT, local);
    const body = await fs.readFile(abs);

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType ?? "video/mp4",
      })
    );

    // eslint-disable-next-line no-console
    console.log(`${local} -> ${publicBase}/${key}`);
  }

  // eslint-disable-next-line no-console
  console.log("\nDone. Videos are public via your R2 dev subdomain.");
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
