import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import { routes } from "@/constants/routes";

export type Crumb = {
  href?: string;
  label: string;
};

type BreadcrumbsProps = {
  items: Crumb[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const trail = [{ href: routes.home, label: "Home" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-muted">
        {trail.map((item, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 ? <Icon name="chevronRight" className="h-3.5 w-3.5" /> : null}
              {last || !item.href ? (
                <span className="font-medium text-navy-900" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-navy-800">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
