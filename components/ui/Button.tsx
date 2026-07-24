import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "highlight"
  | "light"
  | "ghost"
  | "whatsapp";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-[0_4px_14px_rgba(15,93,127,0.18)] hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_8px_18px_rgba(15,93,127,0.22)] focus-visible:ring-primary/25",
  secondary:
    "bg-secondary/90 text-primary-dark shadow-[0_4px_12px_rgba(30,211,198,0.22)] hover:-translate-y-0.5 hover:bg-secondary hover:shadow-[0_8px_16px_rgba(30,211,198,0.28)] focus-visible:ring-secondary/35",
  outline:
    "bg-white/90 text-primary border border-primary/15 shadow-[0_2px_8px_rgba(15,47,61,0.04)] hover:-translate-y-0.5 hover:border-secondary/50 hover:bg-secondary/10 hover:shadow-[0_6px_14px_rgba(30,211,198,0.12)] focus-visible:ring-primary/20",
  highlight:
    "bg-highlight text-primary-dark shadow-[0_4px_12px_rgba(215,241,42,0.28)] hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_8px_16px_rgba(215,241,42,0.35)] focus-visible:ring-highlight/40",
  light:
    "bg-white text-primary shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 hover:bg-white hover:text-primary-dark hover:shadow-[0_8px_18px_rgba(0,0,0,0.12)] focus-visible:ring-white/40",
  ghost:
    "bg-transparent text-primary hover:bg-secondary/10 hover:text-primary-dark focus-visible:ring-primary/20",
  whatsapp:
    "bg-[#25D366] text-white shadow-[0_4px_12px_rgba(37,211,102,0.24)] hover:-translate-y-0.5 hover:bg-[#20c05c] hover:shadow-[0_8px_16px_rgba(37,211,102,0.3)] focus-visible:ring-[#25D366]/30",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-11 px-6 text-sm",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-300 ease-out active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, target, rel, onClick } = props;
    return (
      <Link href={href} target={target} rel={rel} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonAsButton)}>
      {children}
    </button>
  );
}
