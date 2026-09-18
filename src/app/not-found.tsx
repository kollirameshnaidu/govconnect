import { Button } from "@/components/common/Button";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { SkipLink } from "@/components/common/SkipLink";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { routes } from "@/constants/routes";

export default function NotFound() {
  return (
    <>
      <SkipLink />
      <UtilityBar />
      <PublicHeader />
      <main id="main-content" className="flex-1 px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-navy-900">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">
          The page you requested is not available. Return to the public homepage
          to continue.
        </p>
        <div className="mt-6 flex justify-center">
          <Button href={routes.home}>Go to homepage</Button>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
