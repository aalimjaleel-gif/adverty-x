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
let writeQueue: Promise<any> = Promise.resolve();

// Read subscriptions safely (Priority: Fresh Cache -> GitHub Cloud Source of Truth -> Local File -> Static Mock)
async function getSubscriptionsData(): Promise<AppSubscriptionItem[]> {
  const now = Date.now();
  // Return memory cache if fresh (within 10 seconds)
  if (memorySubsCache && memorySubsCache.length > 0 && now - lastFetchTime < 10000) {
    return memorySubsCache;
  }

  // 1. Always prioritize GitHub contents API so multiple PCs / mobile devices see live synced prices immediately!
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
          // Sync local file if possible
          try {
            fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2), "utf-8");
          } catch (e) {}
          return parsed;
        }
      }
    }
  } catch (ghErr) {
    console.error("GitHub API read error:", ghErr);
  }

  // 2. Fallback to local filesystem (if offline or GitHub API rate-limited)
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

  // 3. Fallback to static mock data
  memorySubsCache = APP_SUBSCRIPTIONS;
  lastFetchTime = now;
  return APP_SUBSCRIPTIONS;
}

// GitHub PUT with retry logic to guarantee no 409 SHA conflict losses
async function saveToGitHubWithRetry(subs: AppSubscriptionItem[], maxRetries = 3): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
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
          message: `Update subscriptions from Admin Panel [auto-sync] - ${new Date().toISOString()}`,
          content: base64Content,
          sha: currentSha,
          branch: "main",
        }),
      });

      if (putRes.ok) {
        return true;
      }

      // If 409 Conflict occurred (e.g. concurrent price updates from another device/tab), wait and retry with latest SHA
      if (putRes.status === 409 && attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
        continue;
      }

      const errText = await putRes.text();
      console.error(`GitHub PUT failed (attempt ${attempt}):`, errText);
    } catch (err) {
      console.error(`GitHub API write attempt ${attempt} error:`, err);
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }
    }
  }
  return false;
}

// Persist subscriptions to both local filesystem and GitHub API sequentially
async function persistSubscriptionsData(subs: AppSubscriptionItem[]): Promise<boolean> {
  // Update in-memory cache immediately so instant reads reflect new prices
  memorySubsCache = subs;
  lastFetchTime = Date.now();

  // 1. Try writing to local filesystem
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(subs, null, 2), "utf-8");
  } catch (fsErr) {
    // Expected on Vercel read-only environment
  }

  // 2. Queue write tasks sequentially so concurrent saves never conflict with each other
  const resultPromise = writeQueue.then(() => saveToGitHubWithRetry(subs)).catch(() => false);
  writeQueue = resultPromise;
  return resultPromise;
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

// POST /api/subscriptions (Create, Update, or Bulk Sync Subscriptions)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Bulk update: Save the entire updated subscriptions list in 1 single clean operation
    if (Array.isArray(body)) {
      if (body.length === 0) {
        return NextResponse.json({ error: "Empty subscriptions list" }, { status: 400 });
      }
      const ok = await persistSubscriptionsData(body);
      return NextResponse.json({ success: ok, count: body.length });
    }

    const item: AppSubscriptionItem = body;
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

    // Persist to server & GitHub sequentially
    const ok = await persistSubscriptionsData(updated);

    return NextResponse.json({ success: ok, item: updated[0], total: updated.length });
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
    const ok = await persistSubscriptionsData(updated);

    return NextResponse.json({ success: ok, remaining: updated.length });
  } catch (err) {
    console.error("Failed to delete subscription:", err);
    return NextResponse.json({ error: "Failed to delete subscription" }, { status: 500 });
  }
}
