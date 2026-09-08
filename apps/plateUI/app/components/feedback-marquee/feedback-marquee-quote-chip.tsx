import { Badge } from '@/app/ui/badge';

type FeedbackMarqueeQuoteChipProps = Readonly<{
  quote: string;
}>;

export function FeedbackMarqueeQuoteChip({ quote }: FeedbackMarqueeQuoteChipProps) {
  return (
    <Badge
      variant="outline"
      className="h-auto w-auto justify-start whitespace-normal px-3 py-1.5 text-left text-xs/relaxed sm:text-sm/relaxed"
    >
      {quote}
    </Badge>
  );
}
