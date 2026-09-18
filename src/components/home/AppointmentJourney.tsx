import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { StatusBadge } from "@/components/common/StatusBadge";
import { JOURNEY_STEPS } from "@/mock/homepage";

export function AppointmentJourney() {
  return (
    <section className="bg-navy-900 py-14 text-white md:py-16">
      <Container>
        <SectionHeading
          eyebrow="Appointment journey"
          title="From request to closure"
          description="Every request keeps one appointment ID, including transfers between departments."
          tone="invert"
        />
        <ol className="grid gap-3 md:grid-cols-7">
          {JOURNEY_STEPS.map((step, index) => (
            <li key={step.id} className="rounded-lg bg-white/5 p-4">
              <p className="text-xs font-semibold text-india-saffron">
                Step {index + 1}
              </p>
              <h3 className="mt-2 text-sm font-semibold">{step.title}</h3>
              <p className="mt-2 text-xs leading-5 text-white/70">{step.description}</p>
              <div className="mt-3">
                <StatusBadge status={step.status} />
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
