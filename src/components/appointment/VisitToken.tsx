import { buildVisitToken } from "@/lib/visit-token";

type VisitTokenProps = {
  value: string;
  size?: number;
};

export function VisitToken({ value, size = 180 }: VisitTokenProps) {
  const modules = buildVisitToken(value);
  const dim = modules.length;
  const cell = size / dim;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      role="img"
      aria-label={`Visit token for appointment ${value}`}
      className="rounded-md border border-line bg-white"
    >
      <rect width={size} height={size} fill="#ffffff" />
      {modules.flatMap((row, rowIndex) =>
        row.map((on, colIndex) =>
          on ? (
            <rect
              key={`${rowIndex}-${colIndex}`}
              x={colIndex * cell}
              y={rowIndex * cell}
              width={cell}
              height={cell}
              fill="#0B1F3A"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}
