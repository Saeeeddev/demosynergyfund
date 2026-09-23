import { DEMO_PROJECT_IDS } from '@/lib/demo/config'

export const dynamicParams = false

export function generateStaticParams() {
  return DEMO_PROJECT_IDS.map((projectId) => ({ projectId }))
}

export default function ProjectDetailsLayout({ children }: { children: React.ReactNode }) {
  return children
}
