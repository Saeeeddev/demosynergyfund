import { client } from "./client";
import { validate } from "./validate";
import { PaginatedReportsSchema } from "@/lib/schemas/report";
import { DEMO_MODE } from "@/lib/demo/config";
import { demoService } from "@/lib/demo/service";

// The backend's downloadUrl is a bare Django path ("/api/reports/5/download")
// — reverse() has no notion of the frontend's cross-origin split. Absolutize
// it against the API's origin so the download link works from :3000.
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api").replace(
  /\/api\/?$/,
  "",
);

export async function apiListReports(
  page = 1,
  pageSize = 8,
  category?: string,
  project?: string,
) {
  if (DEMO_MODE) return demoService.reports(page, pageSize, category, project);
  const res = await client.get("/reports", { params: { page, pageSize, category, project } });
  const parsed = validate(PaginatedReportsSchema, res.data);
  return {
    ...parsed,
    data: parsed.data.map((report) => ({
      ...report,
      downloadUrl: `${API_ORIGIN}${report.downloadUrl}`,
    })),
  };
}
