import { client } from "./client";
import { validate } from "./validate";
import {
  ProjectWithDetailsSchema,
  PaginatedProjectsSchema,
} from "@/lib/schemas/project";
import { DEMO_MODE } from "@/lib/demo/config";
import { demoService } from "@/lib/demo/service";

export async function apiListProjects(page = 1, pageSize = 8) {
  if (DEMO_MODE) return demoService.listProjects(page, pageSize);
  const res = await client.get("/projects", { params: { page, pageSize } });
  return validate(PaginatedProjectsSchema, res.data);
}

export async function apiGetProject(id: string) {
  if (DEMO_MODE) return demoService.getProject(id);
  const res = await client.get(`/projects/${id}`);
  return validate(ProjectWithDetailsSchema, res.data);
}
