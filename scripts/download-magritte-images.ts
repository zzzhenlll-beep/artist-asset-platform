import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { artPlaceholderSvg } from "../lib/art-placeholder-svg";

const MAGRITTE_DIR = path.join(process.cwd(), "public", "images", "magritte");
const PLACEHOLDER_DIR = path.join(process.cwd(), "public", "images", "placeholders");

const MAGRITTE_ASSETS = [
  {
    file: "portrait.jpg",
    title: "René Magritte",
    subtitle: "1898–1967 · 玛格丽特",
    variant: "portrait" as const,
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Portrait_en_buste_du_peintre_surr%C3%A9aliste_Ren%C3%A9_Magritte_%281898-1967%29_le_18_octobre_1961_devant_une_de_ses_toiles%2C_PH19994.jpg",
  },
  {
    file: "the-treachery-of-images.jpg",
    title: "形象的叛逆",
    subtitle: "The Treachery of Images · 1929",
    url: "https://upload.wikimedia.org/wikipedia/en/b/b9/MagrittePipe.jpg",
  },
  {
    file: "the-lovers.jpg",
    title: "恋人",
    subtitle: "The Lovers · 1928",
    url: "https://upload.wikimedia.org/wikipedia/en/thumb/5/59/Ren%C3%A9_Magritte_-_The_Lovers_%28Les_Amants%29_1928.jpg/1280px-Ren%C3%A9_Magritte_-_The_Lovers_%28Les_Amants%29_1928.jpg",
  },
  {
    file: "golconda.jpg",
    title: "戈尔孔达",
    subtitle: "Golconda · 1953",
    url: "https://upload.wikimedia.org/wikipedia/en/7/71/Golconde.jpg",
  },
  {
    file: "the-son-of-man.jpg",
    title: "人类之子",
    subtitle: "The Son of Man · 1964",
    url: "https://upload.wikimedia.org/wikipedia/en/e/e5/Magritte_TheSonOfMan.jpg",
  },
  {
    file: "the-empire-of-light.jpg",
    title: "光之帝国",
    subtitle: "The Empire of Light · 1954",
    url: "https://upload.wikimedia.org/wikipedia/en/b/b6/The_Empire_of_Light_MOMA.jpg",
  },
] as const;

const GENERIC_PLACEHOLDERS = [
  { file: "avatar.svg", title: "艺术家", subtitle: "艺术家个人资产体系", variant: "square" as const, width: 400, height: 400 },
  { file: "work.svg", title: "作品配图", subtitle: "艺术家资产档案", width: 1200, height: 900 },
  { file: "cover.svg", title: "作品封面", subtitle: "系列与典藏", width: 1200, height: 750 },
  { file: "series.svg", title: "创作系列", subtitle: "主题演化脉络", width: 1200, height: 750 },
] as const;

async function download(url: string, dest: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "ArtistAssets/1.0 (local seed assets)" },
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  return buf.length;
}

function svgPathFor(jpgFile: string) {
  return jpgFile.replace(/\.jpe?g$/i, ".svg");
}

async function ensureMagritteAsset(asset: (typeof MAGRITTE_ASSETS)[number]) {
  const jpgPath = path.join(MAGRITTE_DIR, asset.file);
  const svgPath = path.join(MAGRITTE_DIR, svgPathFor(asset.file));

  await writeFile(
    svgPath,
    artPlaceholderSvg({
      title: asset.title,
      subtitle: asset.subtitle,
      variant: "variant" in asset ? asset.variant : "landscape",
    }),
    "utf8",
  );

  try {
    const bytes = await download(asset.url, jpgPath);
    console.log(`OK ${asset.file} (${bytes} bytes)`);
  } catch (err) {
    console.warn(`WARN ${asset.file} download failed (${err}), using ${path.basename(svgPath)}`);
  }
}

async function main() {
  await mkdir(MAGRITTE_DIR, { recursive: true });
  await mkdir(PLACEHOLDER_DIR, { recursive: true });

  for (const asset of MAGRITTE_ASSETS) {
    await ensureMagritteAsset(asset);
  }

  for (const item of GENERIC_PLACEHOLDERS) {
    await writeFile(
      path.join(PLACEHOLDER_DIR, item.file),
      artPlaceholderSvg({
        title: item.title,
        subtitle: item.subtitle,
        width: item.width,
        height: item.height,
        variant: "variant" in item ? item.variant : "landscape",
      }),
      "utf8",
    );
    console.log(`OK placeholders/${item.file}`);
  }

  console.log("Image assets ready under public/images/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
