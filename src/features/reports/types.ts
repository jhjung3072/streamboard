export type ReportContentJson = Record<string, unknown>;

export type Report = {
  id: string;
  title: string;
  content: ReportContentJson;
  updatedAt: string;
};
