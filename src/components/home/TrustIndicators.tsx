import { Container } from "@/components/common/Container";
import { TRUST_STATS } from "@/mock/homepage";

export function TrustIndicators() {
  return (
    <section aria-label="Trust indicators" className="relative z-10 -mt-6">
      <Container>
        <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-line bg-white shadow-[var(--shadow-card)] md:grid-cols-4">
          {TRUST_STATS.map((stat, index) => (
            <div
              key={stat.id}
              className={`px-4 py-5 text-center md:px-6 ${index > 0 ? "border-l border-line" : ""} ${index === 2 ? "border-t md:border-t-0" : ""} ${index === 3 ? "border-t md:border-t-0" : ""}`}
            >
              <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-muted md:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
