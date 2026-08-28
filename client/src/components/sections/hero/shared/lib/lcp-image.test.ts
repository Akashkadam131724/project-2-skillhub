import { describe, expect, it } from "vitest";
import { lcpImgProps } from "./lcp-image";

describe("lcpImgProps", () => {
  it("marks priority images for LCP", () => {
    expect(lcpImgProps(true)).toEqual({
      fetchPriority: "high",
      loading: "eager",
      decoding: "sync",
    });
  });

  it("lazy-loads non-priority images", () => {
    expect(lcpImgProps(false)).toEqual({
      loading: "lazy",
      decoding: "async",
    });
  });
});
