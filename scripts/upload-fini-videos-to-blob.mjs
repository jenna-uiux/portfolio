import fs from "node:fs/promises";
import path from "node:path";

import { put } from "@vercel/blob";

const ROOT = process.cwd();

const uploads = [
  "public/media/fini/thumbnail/finiDemo.mp4",
  "public/media/fini/design-build/voiceTaskEntry.mp4",
  "public/media/fini/design-build/proactiveAtomization.mp4",
  "public/media/fini/system-architecture/system-layer.mp4",
];

function toPublicPath(filePath) {
  // "public/media/..." -> "/media/..."
  return `/${filePath.replace(/^public\//, "")}`;
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "Missing BLOB_READ_WRITE_TOKEN. Create a Vercel Blob store and set the token in your shell env."
    );
  }

  const results = [];

  for (const rel of uploads) {
    const abs = path.join(ROOT, rel);
    const data = await fs.readFile(abs);
    const pathname = toPublicPath(rel).replace(/^\//, ""); // blob pathname must not start with "/"

    const res = await put(pathname, data, {
      access: "public",
      addRandomSuffix: false,
      contentType: "video/mp4",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    results.push({ file: rel, url: res.url });
    // eslint-disable-next-line no-console
    console.log(`${rel} -> ${res.url}`);
  }

  const base = results[0]?.url.split("/media/")[0] ?? "";
  // eslint-disable-next-line no-console
  console.log("\nSet this in Vercel Environment Variables:");
  // eslint-disable-next-line no-console
  console.log(`NEXT_PUBLIC_MEDIA_CDN_BASE=${base}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

