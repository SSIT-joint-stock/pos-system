'use client';
import { IsUpdated } from '../../../../sections/dashboard/components';

export function ReportEmployeesView() {
  const isUpdated = true;
  return <>{isUpdated && <IsUpdated />}</>;
}
