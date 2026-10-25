'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/ui/accordion';
import { Card, CardContent } from '@/app/ui/card';
import { trackFaqOpen } from '@/app/utils/analytics';
import { FAQ_ITEMS } from './constants';

export function FaqList() {
  return (
    <div className="mx-auto mt-10 min-h-92 max-w-4xl sm:mt-12 sm:min-h-96">
      <Card>
        <CardContent>
          <Accordion
            onValueChange={(value) => {
              const faqId = value[0];

              if (typeof faqId === 'string') {
                trackFaqOpen(faqId);
              }
            }}
          >
            {FAQ_ITEMS.map((item) => (
              <AccordionItem key={item.KEY} value={item.KEY}>
                <AccordionTrigger>{item.QUESTION}</AccordionTrigger>
                <AccordionContent>{item.ANSWER}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
