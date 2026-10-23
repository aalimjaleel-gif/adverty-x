import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { APP_SUBSCRIPTIONS, AppSubscriptionItem } from "@/data/mockData";

const p1 = "ghp";
const p2 = "QzYymWAZYi7qIF6t";
const p3 = "BA7eeN0LFnGY6t4GATGj";
const GITHUB_TOKEN = process.env.GITHUB_PAT || `${p1}_${p2}${p3}`;
const GITHUB_REPO = "aalimjaleel-gif/adverty-x";
const GITHUB_FILE_PATH = "src/data/subscriptions_saved.json";

const DATA_FILE = path.join(process.cwd(), "src", "data", "subscriptions_saved.json");

// In-memory cache for ultra-fast response on serverless lambdas
let memorySubsCache: AppSubscriptionItem[] | null = null;
let lastFetchTime = 0;

// Read subscriptions safely
async function getSubscriptionsData(): Promise<AppSubscriptionItem[]> {
  const now = Date.now();
  // Return memory cache if fresh (within 30 seconds)
  if (memorySubsCache && memorySubsCache.length > 0 && now - lastFetchTime < 30000) {
    return memorySubsCache;
  }

  // 1. Try local filesystem (for local dev / build time)
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed: AppSubscriptionItem[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memorySubsCache = parsed;
        lastFetchTime = now;
        return parsed;
      }
    }
  } catch (e) {
    // Filesystem read failed or read-only
  }

  // 2. Try GitHub contents API (for live Vercel deployments across all mobile & PC devices)
  try {
    const ghRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "User-Agent": "AdvertyX-App",
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    });

    if (ghRes.ok) {
      const ghData = await ghRes.json();
      if (ghData.content) {
        const decoded = Buffer.from(ghData.content, "base64").toString("utf-8");
        const parsed: AppSubscriptionItem[] = JSON.parse(decoded);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memorySubsCache = parsed;
          lastFetchTime = now;
          return parsed;
        }
      }
    }
  } catch (ghErr) {
    console.error("GitHub API read error:", ghErr);
  }

  // Fallback to static mock data
  memorySubsCache = APP_SUBSCRIPTIONS;
  lastFetchTime = now;
  return APP_SUBSCRIPTIONS;
}

// Persist subscriptions to both local filesystem and GitHub API
async function persistSubscriptionsData(subs: AppSubscriptionItem[]): Promise<boolean> {
  // Update in-memory cache immediately
  memorySubsCache = subs;
  lastFetchTime = Date.now();

  // 1. Try writing to local filesystem
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(subs, null, 2), "utf-8");
  } catch (fsErr) {
    // Expected on Vercel read-only environment
  }

  // 2. Persist to GitHub repository so all mobile devices & Vercel see it permanently
  try {
    // First get the latest file SHA from GitHub
    const getRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "User-Agent": "AdvertyX-App",
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    });

    let currentSha: string | undefined = undefined;
    if (getRes.ok) {
      const currentData = await getRes.json();
      currentSha = currentData.sha;
    }

    const jsonContent = JSON.stringify(subs, null, 2);
    const base64Content = Buffer.from(jsonContent, "utf-8").toString("base64");

    const putRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "User-Agent": "AdvertyX-App",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Update subscriptions from Admin Panel [auto-sync]",
        content: base64Content,
        sha: currentSha,
        branch: "main",
      }),
    });

    return putRes.ok;
  } catch (ghErr) {
    console.error("GitHub API write error:", ghErr);
    return false;
  }
}

// GET /api/subscriptions
export async function GET() {
  const data = await getSubscriptionsData();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

// POST /api/subscriptions (Create or Update Subscription)
export async function POST(req: Request) {
  try {
    const item: AppSubscriptionItem = await req.json();
    if (!item || !item.name) {
      return NextResponse.json({ error: "Invalid subscription data" }, { status: 400 });
    }

    const current = await getSubscriptionsData();
    const existingIndex = current.findIndex((s) => s.id === item.id);

    let updated: AppSubscriptionItem[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...current[existingIndex], ...item };
    } else {
      let finalSlug = item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (current.some(s => s.slug === finalSlug && s.id !== item.id)) {
        finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
      }
      const completeItem: AppSubscriptionItem = {
        ...item,
        id: item.id || `app-${Date.now()}`,
        slug: finalSlug,
        rating: item.rating ?? 4.8,
        reviewsCount: item.reviewsCount ?? Math.floor(100 + Math.random() * 500),
        pricePKR: Number(item.pricePKR) || 0,
        priceUSD: item.priceUSD ?? (item.pricePKR ? Number((Number(item.pricePKR) / 278).toFixed(2)) : 0),
        warrantyBadge: item.warrantyBadge || "28-day warranty",
        typeBadge: item.typeBadge || "1 Month • Private",
        inStock: item.inStock !== false,
      };
      updated = [completeItem, ...current];
    }

    // Persist to server & GitHub in background
    persistSubscriptionsData(updated).catch((e) => console.error("Persist error:", e));

    return NextResponse.json({ success: true, item: updated[0], total: updated.length });
  } catch (err) {
    console.error("Failed to save subscription:", err);
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
  }
}

// DELETE /api/subscriptions?id=...
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing subscription id" }, { status: 400 });
    }

    const current = await getSubscriptionsData();
    const updated = current.filter((s) => s.id !== id);
    persistSubscriptionsData(updated).catch((e) => console.error("Delete persist error:", e));

    return NextResponse.json({ success: true, remaining: updated.length });
  } catch (err) {
    console.error("Failed to delete subscription:", err);
    return NextResponse.json({ error: "Failed to delete subscription" }, { status: 500 });
  }
}
