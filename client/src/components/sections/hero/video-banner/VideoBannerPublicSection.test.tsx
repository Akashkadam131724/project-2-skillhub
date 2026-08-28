import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import VideoBannerPublicSection from "./VideoBannerPublicSection";

describe("VideoBannerPublicSection", () => {
  it("renders nothing when the banner item is empty", () => {
    const { container } = render(
      <VideoBannerPublicSection items={[{ title: "", href: "" }]} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders a YouTube embed for public video banners", () => {
    render(
      <VideoBannerPublicSection
        items={[
          {
            title: "Product walkthrough",
            href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          },
        ]}
      />
    );

    const iframe = screen.getByTitle("Product walkthrough");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      "src",
      expect.stringContaining("youtube-nocookie.com/embed/dQw4w9WgXcQ")
    );
  });

  it("does not render CMS empty media shell", () => {
    render(
      <VideoBannerPublicSection
        items={[
          {
            title: "Launch video",
            href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          },
        ]}
      />
    );

    expect(
      screen.queryByText(/add a video url in the banner item/i)
    ).not.toBeInTheDocument();
  });
});
