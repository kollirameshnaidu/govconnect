import { SectionHeading } from "@/components/common/SectionHeading";
import { PreferredDateHelp } from "@/components/home/PreferredDateHelp";
import { SectionFrame } from "@/components/layout/SectionFrame";
import { HOW_IT_WORKS } from "@/mock/homepage";

type HowItWorksProps = {
  heading?: boolean;
  contained?: boolean;
};

export function HowItWorks({ heading = true, contained = true }: HowItWorksProps) {
  return (
    <SectionFrame contained={contained} className={contained ? "bg-white" : undefined}>
      {heading ? (
        <SectionHeading
          eyebrow="How it works"
          title="Request first, confirmation after review"
          description="Selecting a preferred date does not book a slot. An official confirms the appointment date and time."
        />
      ) : null}
      <div className="mb-6">
        <PreferredDateHelp />
      </div>
      <ol className="grid gap-4 md:grid-cols-5">
        {HOW_IT_WORKS.map((step) => (
          <li key={step.id} className="rounded-lg border border-line bg-surface p-4">
            <p className="text-sm font-bold text-saffron-600">{step.step}</p>
            <h3 className="mt-2 text-base font-semibold text-navy-900">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </SectionFrame>
  );
}
