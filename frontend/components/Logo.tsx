import Image from "next/image";
import Link from "next/link";

export function Logo({ size = "compact" }: { size?: "compact" | "large" }) {
  const frame = size === "large" ? "h-[68px] w-[190px]" : "h-[57px] w-[160px]";
  const image =
    size === "large"
      ? "left-[-1px] top-[-31px] w-[194px]"
      : "left-[-1px] top-[-26px] w-[164px]";

  return (
    <Link
      href="/"
      className="focus-ring block rounded-md"
      aria-label="Raneem Businessmen Services home"
    >
      <span className={`relative block overflow-hidden ${frame}`}>
        <Image
          src="/images/raneem-logo.png"
          alt="Raneem Businessmen Services - Service Unlimited"
          width={612}
          height={408}
          priority
          className={`absolute h-auto max-w-none ${image}`}
          sizes={size === "large" ? "194px" : "164px"}
        />
      </span>
    </Link>
  );
}
