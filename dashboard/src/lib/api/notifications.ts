import { client } from "./client";
import { validate } from "./validate";
import { NotificationSchema } from "@/lib/schemas/user";
import { DEMO_MODE } from "@/lib/demo/config";
import { demoService } from "@/lib/demo/service";

export async function apiListNotifications() {
  if (DEMO_MODE) return demoService.notifications();
  const res = await client.get("/notifications");
  return validate(NotificationSchema.array(), res.data);
}

export async function apiMarkNotificationRead(id: string) {
  if (DEMO_MODE) return demoService.markNotification(id);
  const res = await client.post(`/notifications/${id}/read`);
  return validate(NotificationSchema, res.data);
}

export async function apiMarkAllNotificationsRead() {
  if (DEMO_MODE) return demoService.markAllNotifications();
  await client.post("/notifications/read-all");
}
