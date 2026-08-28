import "@testing-library/jest-dom/vitest";
import type { ReactNode } from "react";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

vi.mock("@/components/sections/shared/CardPlaceholder", () => ({
  default: ({ children }: { children?: ReactNode }) => <span>{children}</span>,
}));

vi.mock("@/components/cms/primitives/CmsEditable", () => ({
  default: ({
    children,
    label,
  }: {
    children?: ReactNode;
    label?: string;
  }) => <div data-cms-editable={label}>{children}</div>,
}));

vi.mock("@/components/cms/primitives/CmsRichText", () => ({
  default: ({
    html,
    empty,
  }: {
    html?: string;
    empty?: ReactNode;
  }) =>
    html ? <div data-testid="cms-rich-text">{html}</div> : (empty ?? null),
}));

vi.mock("@/components/cms/sections/CmsButtonsManageBar", () => ({
  default: () => <div data-testid="cms-buttons-manage-bar" />,
}));

vi.mock("@/components/cms/sections/SectionCmsContext", () => ({
  useSectionCmsKeys: () => ({
    sectionKey: "test_section",
    renderKey: null,
  }),
}));

vi.mock("@/components/ui/DsButton", () => ({
  default: ({
    button,
  }: {
    button?: { title?: string; label?: string; href?: string };
  }) => (
    <a href={button?.href || "#"}>
      {button?.title || button?.label || "Button"}
    </a>
  ),
}));

vi.mock("@/components/ui/SectionButtons", () => ({
  default: ({
    buttons,
    button_title,
    className,
  }: {
    buttons?: Array<{ title?: string; label?: string; href?: string }>;
    button_title?: string;
    className?: string;
  }) => (
    <div className={className} data-testid="section-buttons">
      {Array.isArray(buttons) && buttons.length
        ? buttons.map((button, index) => (
            <a key={index} href={button.href || "#"}>
              {button.title || button.label}
            </a>
          ))
        : button_title ? <a href="#">{button_title}</a> : null}
    </div>
  ),
}));
