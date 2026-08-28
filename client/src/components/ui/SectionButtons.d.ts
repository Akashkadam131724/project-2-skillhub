import type { ReactNode } from "react";

export default function SectionButtons(props: {
  buttons?: unknown[];
  button_title?: string;
  target_url?: string;
  className?: string;
  buttonClassName?: string;
  onFormOpen?: (formKey: string, button?: unknown) => void;
  inverted?: boolean;
  surface?: string;
}): ReactNode;
