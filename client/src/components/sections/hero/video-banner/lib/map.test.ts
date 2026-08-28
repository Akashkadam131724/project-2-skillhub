import { describe, expect, it } from "vitest";
import {
  isVideoBannerItemShowable,
  resolveVideoBannerUiItem,
  toVideoBannerUiItem,
} from "./map";

describe("video banner map", () => {
  it("builds a YouTube embed from item href", () => {
    const item = toVideoBannerUiItem({
      href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "Demo",
    });

    expect(item.videoSrc).toContain("youtube-nocookie.com/embed/dQw4w9WgXcQ");
    expect(item.title).toBe("Demo");
  });

  it("treats inactive items as not showable", () => {
    expect(
      isVideoBannerItemShowable({
        status: false,
        title: "Hidden",
      })
    ).toBe(false);
  });

  it("resolves the first showable item on public pages", () => {
    const item = resolveVideoBannerUiItem("video_banner", [
      { status: false, title: "Skip" },
      { title: "Visible banner", href: "https://youtu.be/abc123def45" },
    ]);

    expect(item?.title).toBe("Visible banner");
    expect(item?.videoSrc).toContain("youtube-nocookie.com/embed/");
  });
});
