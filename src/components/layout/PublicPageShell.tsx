import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/common/Breadcrumbs";
import { Container } from "@/components/common/Container";

type PublicPageShellProps = {
  title: string;
  description: string;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
  children?: ReactNode;
};

export function PublicPageShell({
  title,
  description,
  breadcrumbs,
  actions,
  children,
}: PublicPageShellProps) {
  return (
    <div className="bg-surface py-10 md:py-14">
      <Container>
        {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-navy-900">{title}</h1>
            <p className="mt-3 text-base leading-7 text-muted">{description}</p>
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </header>
        {children}
      </Container>
    </div>
  );
}
