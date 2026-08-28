/** Props for above-the-fold / LCP candidate images. */
export function lcpImgProps(priority = true) {
  return priority
    ? ({
        fetchPriority: "high" as const,
        loading: "eager" as const,
        decoding: "sync" as const,
      })
    : ({
        loading: "lazy" as const,
        decoding: "async" as const,
      });
}
