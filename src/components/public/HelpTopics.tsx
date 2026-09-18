import Link from "next/link";
import { Card } from "@/components/common/Card";
import { Icon } from "@/components/common/Icon";
import { HELP_TOPICS } from "@/mock/public-content";

export function HelpTopics() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {HELP_TOPICS.map((topic) => (
        <Link key={topic.id} href={topic.href} className="block h-full">
          <Card className="h-full hover:border-navy-700">
            <Icon name="help" className="text-navy-800" />
            <h2 className="mt-4 text-base font-semibold text-navy-900">{topic.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{topic.detail}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
