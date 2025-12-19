'use client';
import React from 'react';
import { IsUpdated } from '../components';

export function ExportInvoicesViews() {
  const isUpdate = true;
  return <>{isUpdate ? <IsUpdated /> : <div>ExportInvoicesViews</div>}</>;
}
