"use client";

import { useState } from "react";
import { Icon } from "@/components/common/Icon";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SectionFrame } from "@/components/layout/SectionFrame";
import { routes } from "@/constants/routes";
import { FAQS } from "@/mock/homepage";
import { cn } from "@/lib/cn";
import type { FaqItem } from "@/types";

type FaqSectionProps = {
  heading?: boolean;
  contained?: boolean;
  items?: FaqItem[];
  showAllLink?: boolean;
};

export function FaqSection({
  heading = true,
  contained = true,
  items = FAQS,
  showAllLink = true,
}: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <SectionFrame contained={contained}>
      {heading ? (
        <SectionHeading
          eyebrow="FAQ"
          title="Common questions"
          href={showAllLink ? routes.faq : undefined}
          actionLabel={showAllLink ? "View all FAQs" : undefined}
        />
      ) : null}
      <div className="mx-auto max-w-3xl divide-y divide-line rounded-lg border border-line bg-white">
        {items.map((item) => {
          const open = openId === item.id;
          return (
            <div key={item.id} id={item.id}>
              <h3>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-navy-900"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : item.id)}
                >
                  {item.question}
                  <Icon name="chevronDown" className={cn("transition", open && "rotate-180")} />
                </button>
              </h3>
              {open ? (
                <p className="px-5 pb-4 text-sm leading-6 text-muted">{item.answer}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </SectionFrame>
  );
}
