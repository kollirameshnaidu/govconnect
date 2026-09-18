import { Button } from "@/components/common/Button";
import { routes } from "@/constants/routes";

export default function PublicNotFound() {
  return (
    <div className="px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-navy-900">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted">
        The page you requested is not available.
      </p>
      <div className="mt-6 flex justify-center">
        <Button href={routes.home}>Go to homepage</Button>
      </div>
    </div>
  );
}
