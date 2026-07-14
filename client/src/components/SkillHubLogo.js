import Image from "next/image";

/**
 * SkillHub brand mark + optional wordmark.
 */
export default function SkillHubLogo({
  showWordmark = true,
  size = 32,
  className = "",
  priority = false,
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <Image
        src="/skillhub-logo.png"
        alt="SkillHub"
        width={size}
        height={size}
        className="shrink-0 rounded-lg"
        priority={priority}
      />
      {showWordmark ? (
        <span className="text-sm font-bold tracking-wide text-ink dark:text-white">
          SkillHub
        </span>
      ) : null}
    </span>
  );
}
