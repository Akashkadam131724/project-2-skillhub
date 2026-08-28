import Image from "next/image";
import type { SarderEcosystemLogoItem } from "./lib/types";

type SarderEcosystemLogoPillProps = SarderEcosystemLogoItem;

function LogoArrowMobile() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="none"
      className="ml-2 h-5 w-5 shrink-0 self-center md:hidden"
      aria-hidden
    >
      <path
        d="M17.364 7.37629C17.5514 7.18876 17.6567 6.93445 17.6567 6.66929C17.6567 6.40412 17.5514 6.14982 17.364 5.96229L11.707 0.305288C11.6147 0.209778 11.5044 0.133596 11.3824 0.0811866C11.2604 0.0287776 11.1291 0.00119129 10.9964 3.74652e-05C10.8636 -0.00111636 10.7319 0.0241856 10.609 0.0744665C10.4861 0.124747 10.3745 0.199 10.2806 0.292893C10.1867 0.386786 10.1124 0.498437 10.0621 0.621334C10.0119 0.74423 9.98655 0.87591 9.9877 1.00869C9.98886 1.14147 10.0164 1.27269 10.0689 1.39469C10.1213 1.5167 10.1974 1.62704 10.293 1.71929L14.243 5.66929L0.999954 5.66929C0.734737 5.66929 0.480383 5.77464 0.292846 5.96218C0.10531 6.14972 -4.60563e-05 6.40407 -4.60679e-05 6.66929C-4.60795e-05 6.9345 0.10531 7.18886 0.292846 7.37639C0.480383 7.56393 0.734737 7.66929 0.999954 7.66929L14.243 7.66929L10.293 11.6193C10.1108 11.8079 10.01 12.0605 10.0123 12.3227C10.0146 12.5849 10.1197 12.8357 10.3051 13.0211C10.4905 13.2065 10.7414 13.3117 11.0036 13.314C11.2657 13.3162 11.5183 13.2154 11.707 13.0333L17.364 7.37629Z"
        fill="#B2B2B2"
      />
    </svg>
  );
}

function LogoArrowDesktop() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="ml-2 hidden h-5 w-5 opacity-0 transition duration-200 group-hover:translate-x-1 group-hover:opacity-100 md:block"
      aria-hidden
    >
      <path
        d="M20.3635 12.7064C20.5509 12.5188 20.6562 12.2645 20.6562 11.9994C20.6562 11.7342 20.5509 11.4799 20.3635 11.2924L14.7065 5.63537C14.6142 5.53986 14.5039 5.46367 14.3819 5.41126C14.2599 5.35886 14.1286 5.33127 13.9959 5.33012C13.8631 5.32896 13.7314 5.35426 13.6085 5.40454C13.4856 5.45483 13.374 5.52908 13.2801 5.62297C13.1862 5.71686 13.1119 5.82852 13.0616 5.95141C13.0114 6.07431 12.9861 6.20599 12.9872 6.33877C12.9884 6.47155 13.016 6.60277 13.0684 6.72477C13.1208 6.84677 13.197 6.95712 13.2925 7.04937L17.2425 10.9994L3.99947 10.9994C3.73425 10.9994 3.47989 11.1047 3.29236 11.2923C3.10482 11.4798 2.99947 11.7341 2.99947 11.9994C2.99947 12.2646 3.10482 12.5189 3.29236 12.7065C3.47989 12.894 3.73425 12.9994 3.99947 12.9994L17.2425 12.9994L13.2925 16.9494C13.1103 17.138 13.0095 17.3906 13.0118 17.6528C13.0141 17.915 13.1192 18.1658 13.3046 18.3512C13.4901 18.5366 13.7409 18.6418 14.0031 18.644C14.2653 18.6463 14.5179 18.5455 14.7065 18.3634L20.3635 12.7064Z"
        fill="#0362D3"
      />
    </svg>
  );
}

export default function SarderEcosystemLogoPill({
  logo,
  alt,
  label,
  href,
  disabled = false,
  logoHeightClass,
}: SarderEcosystemLogoPillProps) {
  const heightClass = logoHeightClass || "h-6 md:h-7";

  const inner = (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="min-w-0 flex-1">
          <Image
            src={logo}
            alt={alt}
            width={160}
            height={44}
            className={`w-auto object-contain ${heightClass}`}
          />
        </div>
        {!disabled ? (
          <>
            <LogoArrowMobile />
            <LogoArrowDesktop />
          </>
        ) : null}
      </div>
      <span
        className={`mt-auto pt-1 ${
          disabled
            ? "text-sm font-normal text-gray-700"
            : "text-[13px] font-medium text-gray-700"
        }`}
      >
        {label}
      </span>
    </>
  );

  if (disabled || !href) {
    return (
      <div
        className="group flex cursor-default flex-col items-start gap-1 rounded-xl border border-transparent bg-white px-3 py-2"
        style={{ borderRadius: 12 }}
      >
        {inner}
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col items-start gap-1 rounded-xl border border-transparent bg-white px-3 py-2 no-underline hover:border-[#0362D3] hover:shadow-sm"
      style={{ borderRadius: 12 }}
    >
      {inner}
    </a>
  );
}
