'use client';
import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

export function usePrint({ title }: { title: string }) {
  const [printing, setPrinting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${title}`,
    onBeforePrint: async () => {
      setPrinting(true);

      await new Promise((resolve) => setTimeout(resolve, 200));
    },

    onAfterPrint: () => {
      setPrinting(false);
    },

    onPrintError: () => {
      setPrinting(false);
    },
  });
  return { printing, printRef, handlePrint };
}
