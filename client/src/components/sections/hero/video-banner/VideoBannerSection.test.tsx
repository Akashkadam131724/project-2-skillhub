import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import VideoBannerSection from "./VideoBannerSection";

describe("VideoBannerSection", () => {
  it("renders CMS empty media shell when no video is configured", () => {
    render(
      <VideoBannerSection items={[]} onEditField={() => {}} />
    );

    expect(
      screen.getByText(/add a video url in the banner item/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add video/i })).toBeInTheDocument();
  });

  it("renders CMS video embed and items bar when configured", () => {
    render(
      <VideoBannerSection
        items={[
          {
            title: "CMS walkthrough",
            subtitle: "See the product",
            href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          },
        ]}
        onEditField={() => {}}
      />
    );

    expect(screen.getByTitle("CMS walkthrough")).toBeInTheDocument();
    expect(screen.getByText("CMS walkthrough")).toBeInTheDocument();
    expect(screen.getByText("See the product")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit video/i })).toBeInTheDocument();
  });
});
