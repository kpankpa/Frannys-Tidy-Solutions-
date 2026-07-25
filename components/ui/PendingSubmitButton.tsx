"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/PageSpinner";

type PendingSubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "highlight"
    | "light"
    | "ghost"
    | "whatsapp";
};

export function PendingSubmitButton({
  children,
  pendingLabel = "Saving...",
  className,
  size = "md",
  variant = "primary",
}: PendingSubmitButtonProps) {
  const { pending } = useFormStatus();
  const lightOnDark =
    variant === "primary" || variant === "whatsapp" || variant === "secondary";

  return (
    <Button
      type="submit"
      size={size}
      variant={variant}
      className={className}
      disabled={pending}
    >
      {pending ? (
        <>
          <Spinner
            size="sm"
            className={
              lightOnDark ? "border-white/30 border-t-white" : undefined
            }
          />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
