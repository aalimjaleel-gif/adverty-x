import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ACADEMY_COURSES, CourseItem } from "@/data/mockData";

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

function readSavedCourses(): CourseItem[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, "[]", "utf-8");
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed: CourseItem[] = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const cleaned = parsed.filter(c => !isDemoCourse(c));
      if (cleaned.length !== parsed.length) {
        writeSavedCourses(cleaned);
      }
      return cleaned;
    }
    return [];
  } catch (err) {
    console.error("Error reading saved courses:", err);
    return [];
  }
}

function writeSavedCourses(courses: CourseItem[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(courses, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing saved courses:", err);
  }
}

// GET /api/courses
export async function GET() {
  const saved = readSavedCourses().filter(c => !isDemoCourse(c));
  if (saved.length === 0 && ACADEMY_COURSES.length > 0) {
    return NextResponse.json(ACADEMY_COURSES.filter(c => !isDemoCourse(c)));
  }
  return NextResponse.json(saved);
}

// POST /api/courses (Create or Update Course)
export async function POST(req: Request) {
  try {
    const course: CourseItem = await req.json();
    if (!course || !course.title) {
      return NextResponse.json({ error: "Invalid course data" }, { status: 400 });
    }

    const saved = readSavedCourses();
    const existingIndex = saved.findIndex(c => c.id === course.id || c.slug === course.slug);
    
    if (existingIndex >= 0) {
      saved[existingIndex] = course;
    } else {
      saved.unshift(course);
    }

    writeSavedCourses(saved);
    return NextResponse.json({ success: true, course });
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

    const saved = readSavedCourses();
    const updated = saved.filter(c => c.id !== id);
    writeSavedCourses(updated);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete course:", err);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
