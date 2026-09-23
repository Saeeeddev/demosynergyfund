// Standalone project-card data for the public site's "فرصت‌های سرمایه‌گذاری"
// section. The public site never pulls project *details* — only these card
// fields — so the shape stays deliberately flat and local.

export type ProjectStatus = 'active' | 'funding' | 'closed';

export interface ProjectCardData {
  id: string;
  name: string;
  location: string;
  status: ProjectStatus;
  image: string;
  /** Nameplate capacity in megawatts. */
  capacityMw: number;
  /** Forecast annual yield, as a percentage. */
  targetYield: number;
  /** Toman per kilowatt of purchased capacity. */
  pricePerKw: number;
  /** Minimum ticket in Toman. */
  minInvestment: number;
  /** Percentage of the offering already sold. */
  soldPercent: number;
}

// Only one project is currently open to investment; the section shows it alone,
// centered. Add more entries here to bring the grid back.
export const PROJECTS: ProjectCardData[] = [
  {
    id: 'yazd-01',
    name: 'نیروگاه خورشیدی مهرآباد یزد',
    location: 'یزد، ایران',
    status: 'active',
    image: '/Images/projects/image4.webp',
    capacityMw: 12.5,
    targetYield: 31.5,
    pricePerKw: 4200000,
    minInvestment: 5000000,
    soldPercent: 78,
  },
];
