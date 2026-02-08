'use client';

import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { Variant } from '@repo/design-system/types';
import { ApiResponse } from '@repo/types/response';
import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../../libs/axios';
import { useRequestHelper } from '../use-request-helper';

export interface BarcodeScannerOptions {
  onScan: (barcode: string) => void;
  enabled?: boolean;
}

export function useBarcodeScanner({ onScan, enabled = true }: BarcodeScannerOptions) {
  const onScanRef = useRef(onScan);
  const lastScanRef = useRef<{ barcode: string; time: number }>({ barcode: '', time: 0 });

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  const bufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      // Increase threshold to 100ms for better scanner compatibility
      const isFast = currentTime - lastKeyTimeRef.current < 100;

      // Reset buffer if too much time passed between keys (manual typing)
      if (currentTime - lastKeyTimeRef.current > 200) {
        bufferRef.current = '';
      }

      if (e.key === 'Enter') {
        if (bufferRef.current.length > 2) {
          const barcode = bufferRef.current;

          // Deduplication: Avoid processing the same barcode multiple times within 500ms
          const timeSinceLastScan = currentTime - lastScanRef.current.time;
          if (barcode === lastScanRef.current.barcode && timeSinceLastScan < 500) {
            bufferRef.current = '';
            lastKeyTimeRef.current = 0;
            e.preventDefault();
            e.stopPropagation();
            return;
          }

          lastScanRef.current = { barcode, time: currentTime };
          onScanRef.current(barcode);

          bufferRef.current = '';
          lastKeyTimeRef.current = 0;
          e.preventDefault();
          e.stopPropagation();
        }
      } else if (e.key.length === 1) {
        bufferRef.current += e.key;
        // Block characters if they are fast OR if we are already in a sequence
        // if (isFast || bufferRef.current.length > 1) {
        //   e.preventDefault();
        // }
      }

      lastKeyTimeRef.current = currentTime;
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [enabled]);
}

export function useCatalog() {
  const { showSuccessToast } = useToast();
  const { loading, requestWrapper } = useRequestHelper();
  const [scannedResult, setScannedResult] = useState<Variant | null>(null);
  const [isScanMode, setIsScanMode] = useState<boolean>(false);
  const scanBarcode = useCallback(
    async (barcode: string) => {
      if (isScanMode) {
        const res = await requestWrapper(() =>
          api.get<ApiResponse<Variant>>('/catalog/scan', {
            params: { barcode },
          })
        );

        if (res?.data.success) {
          showSuccessToast('Lấy dữ liệu từ barcode thành công');
          setScannedResult(res.data.data as Variant);
          return res.data.data;
        }

        return null;
      }
    },
    [requestWrapper, showSuccessToast, isScanMode]
  );

  return {
    loading,
    scannedResult,
    isScanMode,
    scanBarcode,
    setIsScanMode,
    setScannedResult,
  };
}
