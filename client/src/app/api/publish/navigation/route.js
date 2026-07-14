import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { NAVIGATION_CACHE_TAG } from "@/lib/isr";
import { logPublish } from "@/lib/cache-log";

/**
 * Refresh the cached site header navigation.
 */
export async function POST(request) {
  const expected = process.env.REVALIDATE_SECRET;
  if (expected) {
    const provided = request.headers.get("x-revalidate-secret") || "";
    let bodySecret = "";
    try {
      const body = await request.json();
      bodySecret = body?.secret || "";
    } catch {
      /* empty body is fine */
    }
    if (provided !== expected && bodySecret !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  logPublish("api/navigation:start", { tag: NAVIGATION_CACHE_TAG });
  revalidateTag(NAVIGATION_CACHE_TAG, "max");
  revalidatePath("/", "layout");
  logPublish("api/navigation:done", {
    tag: NAVIGATION_CACHE_TAG,
    layout: "/",
    next: "header nav should MISS then refill on next request",
  });

  return NextResponse.json({
    revalidated: true,
    tag: NAVIGATION_CACHE_TAG,
    now: Date.now(),
  });
}
