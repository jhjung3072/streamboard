'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { reportTag, reportsListTag } from './cache';
import { createReport, saveReport } from '@/server/reports/store';
import type { ReportContentJson } from '@/features/reports/types';

export async function createReportAction(): Promise<{ id: string }> {
  const report = createReport();
  revalidateTag(reportsListTag(), 'max');
  revalidatePath('/reports');
  return { id: report.id };
}

export async function saveReportAction(input: {
  id: string;
  title: string;
  content: ReportContentJson;
}): Promise<{ ok: true }> {
  saveReport(input.id, { title: input.title, content: input.content });
  revalidateTag(reportsListTag(), 'max');
  revalidateTag(reportTag(input.id), 'max');
  revalidatePath(`/reports/${input.id}`);
  revalidatePath('/reports');
  return { ok: true };
}
