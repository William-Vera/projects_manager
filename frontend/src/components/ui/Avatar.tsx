import { getInitials } from "../../utils/projectStatus";

export function Avatar({
  name,
  className = "w-10 h-10",
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      className={`${className} rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm border-2 border-primary-fixed shrink-0`}
    >
      {getInitials(name)}
    </div>
  );
}
