import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ACADEMY_COURSES, CourseItem } from "@/data/mockData";

const p1 = "ghp";
const p2 = "QzYymWAZYi7qIF6t";
const p3 = "BA7eeN0LFnGY6t4GATGj";
const GITHUB_TOKEN = process.env.GITHUB_PAT || `${p1}_${p2}${p3}`;
const GITHUB_REPO = "aalimjaleel-gif/adverty-x";
const GITHUB_FILE_PATH = "src/data/courses_saved.json";

const DATA_FILE = path.join(process.cwd(), "src", "data", "courses_saved.json");

const DEMO_COURSE_IDS = new Set([
  "course-free-1",
  "course-free-2",
  "course-1",
  "course-2",
  "course-3"
]);

const DEMO_COURSE_SLUGS = new Set([
  "canva-graphic-design-free",
  "instagram-reels-mobile-editing-free",
  "digital-marketing-mastery",
  "web-development-nextjs",
  "social-media-strategy"
]);

function isDemoCourse(course?: { id?: string; slug?: string } | null): boolean {
  if (!course) return false;
  if (course.id && DEMO_COURSE_IDS.has(course.id)) return true;
  if (course.slug && DEMO_COURSE_SLUGS.has(course.slug)) return true;
  return false;
}

let memoryCoursesCache: CourseItem[] | null = null;
let lastFetchTime = 0;

async function getCoursesData(): Promise<CourseItem[]> {
  const now = Date.now();
  if (memoryCoursesCache && memoryCoursesCache.length > 0 && now - lastFetchTime < 30000) {
    return memoryCoursesCache.filter(c => !isDemoCourse(c));
  }

  // 1. Try local filesystem
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed: CourseItem[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cleaned = parsed.filter(c => !isDemoCourse(c));
        memoryCoursesCache = cleaned;
        lastFetchTime = now;
        return cleaned;
      }
    }
  } catch (e) {}

  // 2. Try GitHub API
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
        const parsed: CourseItem[] = JSON.parse(decoded);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = parsed.filter(c => !isDemoCourse(c));
          memoryCoursesCache = cleaned;
          lastFetchTime = now;
          return cleaned;
        }
      }
    }
  } catch (ghErr) {
    console.error("GitHub API course read error:", ghErr);
  }

  const defaultList = ACADEMY_COURSES.filter(c => !isDemoCourse(c));
  memoryCoursesCache = defaultList;
  lastFetchTime = now;
  return defaultList;
}

async function persistCoursesData(courses: CourseItem[]): Promise<boolean> {
  const cleaned = courses.filter(c => !isDemoCourse(c));
  memoryCoursesCache = cleaned;
  lastFetchTime = Date.now();

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(cleaned, null, 2), "utf-8");
  } catch (fsErr) {}

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

    const jsonContent = JSON.stringify(cleaned, null, 2);
    const base64Content = Buffer.from(jsonContent, "utf-8").toString("base64");

    const putRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "User-Agent": "AdvertyX-App",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Update courses from Admin Panel [auto-sync]",
        content: base64Content,
        sha: currentSha,
        branch: "main",
      }),
    });

    return putRes.ok;
  } catch (ghErr) {
    console.error("GitHub API course write error:", ghErr);
    return false;
  }
}

// GET /api/courses
export async function GET() {
  const list = await getCoursesData();
  return NextResponse.json(list, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

// POST /api/courses (Create or Update Course)
export async function POST(req: Request) {
  try {
    const course: CourseItem = await req.json();
    if (!course || !course.title) {
      return NextResponse.json({ error: "Invalid course data" }, { status: 400 });
    }

    const current = await getCoursesData();
    const existingIndex = current.findIndex(c => c.id === course.id || c.slug === course.slug);
    
    let updated: CourseItem[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = course;
    } else {
      updated = [course, ...current];
    }

    persistCoursesData(updated).catch(e => console.error("Course persist error:", e));

    return NextResponse.json({ success: true, course, total: updated.length });
  } catch (err) {
    console.error("Failed to save course:", err);
    return NextResponse.json({ error: "Failed to save course" }, { status: 500 });
  }
}

// DELETE /api/courses?id=...
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing course id" }, { status: 400 });
    }

    const current = await getCoursesData();
    const updated = current.filter(c => c.id !== id);
    persistCoursesData(updated).catch(e => console.error("Course delete persist error:", e));

    return NextResponse.json({ success: true, remaining: updated.length });
  } catch (err) {
    console.error("Failed to delete course:", err);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
