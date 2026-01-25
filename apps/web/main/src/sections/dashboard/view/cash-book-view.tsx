'use client';
import { IsUpdated } from '../../../sections/dashboard/components';

export function CashBookView() {
  const isUpdate = true;
  return <>{isUpdate && <IsUpdated />}</>;
}
