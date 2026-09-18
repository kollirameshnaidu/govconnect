import type { ReactNode } from "react";
import { Container } from "@/components/common/Container";
import { cn } from "@/lib/cn";

type SectionFrameProps = {
  id?: string;
  contained?: boolean;
  className?: string;
  children: ReactNode;
};

export function SectionFrame({
  id,
  contained = true,
  className,
  children,
}: SectionFrameProps) {
  if (!contained) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <section id={id} className={cn("py-14 md:py-16", className)}>
      <Container>{children}</Container>
    </section>
  );
}
