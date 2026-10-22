import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { APP_SUBSCRIPTIONS, AppSubscriptionItem } from "@/data/mockData";

const DATA_FILE = path.join(process.cwd(), "src", "data", "subscriptions_saved.json");

function readSavedSubscriptions(): AppSubscriptionItem[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(APP_SUBSCRIPTIONS, null, 2), "utf-8");
      return APP_SUBSCRIPTIONS;
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed: AppSubscriptionItem[] = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure any newly introduced official items (like Prime Video) are present
      let hasMerged = false;
      APP_SUBSCRIPTIONS.forEach(defaultItem => {
        if (!parsed.some(p => p.id === defaultItem.id || p.slug === defaultItem.slug)) {
          parsed.push(defaultItem);
          hasMerged = true;
        }
      });
      if (hasMerged) {
        writeSavedSubscriptions(parsed);
      }
      return parsed;
    }
    return APP_SUBSCRIPTIONS;
  } catch (err) {
    console.error("Error reading saved subscriptions:", err);
    return APP_SUBSCRIPTIONS;
  }
}

function writeSavedSubscriptions(subs: AppSubscriptionItem[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(subs, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing saved subscriptions:", err);
  }
}

// GET /api/subscriptions
export async function GET() {
  const saved = readSavedSubscriptions();
  return NextResponse.json(saved);
}

// POST /api/subscriptions (Create or Update Subscription)
export async function POST(req: Request) {
  try {
    const item: AppSubscriptionItem = await req.json();
    if (!item || !item.name) {
      return NextResponse.json({ error: "Invalid subscription data" }, { status: 400 });
    }

    const saved = readSavedSubscriptions();
    const existingIndex = saved.findIndex(s => s.id === item.id || s.slug === item.slug);

    if (existingIndex >= 0) {
      saved[existingIndex] = { ...item, id: saved[existingIndex].id };
    } else {
      saved.unshift(item);
    }

    writeSavedSubscriptions(saved);
    return NextResponse.json({ success: true, item });
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

    const saved = readSavedSubscriptions();
    const updated = saved.filter(s => s.id !== id);
    writeSavedSubscriptions(updated);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete subscription:", err);
    return NextResponse.json({ error: "Failed to delete subscription" }, { status: 500 });
  }
}
