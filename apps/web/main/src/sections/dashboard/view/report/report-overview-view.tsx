'use client';

import { IsUpdated } from '../../../../sections/dashboard/components';

export function ReportOverView() {
  const isUpdated = true;
  return <>{isUpdated && <IsUpdated />}</>;
}
