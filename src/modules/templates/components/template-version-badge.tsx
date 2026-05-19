import { Badge } from "@/components/ui/badge";

type Props = {
  version: string;
  className?: string;
};

export function TemplateVersionBadge({ version, className }: Props) {
  return (
    <Badge variant="outline" className={className}>
      v{version}
    </Badge>
  );
}
