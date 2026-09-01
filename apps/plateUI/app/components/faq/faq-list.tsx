'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/ui/accordion';
import { Card, CardContent } from '@/app/ui/card';
import { FAQ_ITEMS } from './constants';

export function FaqList() {
  return (
    <div className="mx-auto mt-10 min-h-128 max-w-4xl sm:mt-12 sm:min-h-136">
      <Card>
        <CardContent>
          <Accordion>
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
