// Server-only module. Do not import in client components.
import type { Report, ReportContentJson } from '@/features/reports/types';

declare global {
  // eslint-disable-next-line no-var
  var __streamboardReports: Map<string, Report> | undefined;
}

const reports = globalThis.__streamboardReports ?? new Map<string, Report>();

function normalizeContent(value: unknown): ReportContentJson {
  if (typeof value === 'string') {
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: value
            ? [{ type: 'text', text: value }]
            : [],
        },
      ],
    };
  }
  if (value && typeof value === 'object') {
    return value as ReportContentJson;
  }
  return { type: 'doc', content: [{ type: 'paragraph' }] };
}

function normalizeReport(report: Report): Report {
  const content = normalizeContent(report.content);
  if (content === report.content) {
    return report;
  }
  const next = { ...report, content };
  reports.set(report.id, next);
  return next;
}

function seedReport(title: string, content: ReportContentJson): void {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  reports.set(id, { id, title, content, updatedAt: now });
}

if (reports.size === 0) {
  seedReport('주간 리포트 예시', {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: '이번 주 주요 진행 상황을 요약합니다.' }],
      },
    ],
  });
  seedReport('분석 리포트 예시', {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: '데이터 추이와 인사이트를 정리합니다.' }],
      },
    ],
  });
  seedReport('협업 노트 예시', {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: '공유해야 할 이슈와 결정 사항을 기록합니다.' }],
      },
    ],
  });
}

globalThis.__streamboardReports = reports;

export function listReports(): Report[] {
  return Array.from(reports.values())
    .map(normalizeReport)
    .sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  );
}

export function getReport(id: string): Report | null {
  const report = reports.get(id);
  if (!report) {
    return null;
  }
  return normalizeReport(report);
}

export function createReport(): Report {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const report: Report = {
    id,
    title: '새 리포트',
    content: { type: 'doc', content: [{ type: 'paragraph' }] },
    updatedAt: now,
  };
  reports.set(id, report);
  return report;
}

export function saveReport(
  id: string,
  patch: { title?: string; content?: ReportContentJson }
): Report {
  const current = reports.get(id);
  const now = new Date().toISOString();
  const report: Report = {
    id,
    title: patch.title ?? current?.title ?? '새 리포트',
    content: normalizeContent(
      patch.content ?? current?.content ?? { type: 'doc', content: [{ type: 'paragraph' }] }
    ),
    updatedAt: now,
  };
  reports.set(id, report);
  return report;
}
