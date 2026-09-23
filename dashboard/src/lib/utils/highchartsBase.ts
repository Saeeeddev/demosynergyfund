// Chart design-token values — must stay in sync with design-tokens.css [D §12].
// Referenced by all four chart wrappers; never use raw hex in components.

/**
 * asas chart palette — used for ALL charts.
 * COLORS = ['#4361ee', '#00A67E', '#5DADE2', '#F39C12', '#8E44AD']
 */
export const CHART_COLORS = {
  green: '#00A67E',                        // positive / turquoise (name kept for compat)
  greenDeep: '#00876A',
  greenGradTop: 'rgba(67,97,238,.18)',     // area fill — top (blue #4361ee)
  greenGradBot: 'rgba(67,97,238,0)',       // area fill — bottom (transparent)

  blue: '#4361ee',                         // primary slate-blue (series, bars)
  blueSoft: '#5DADE2',                     // light blue (gradient end)

  gold: '#F39C12',                         // orange (energy identity)
  goldBase: '#E08E0B',
  goldDeep: '#C47F08',

  purple: '#8E44AD',                       // violet
  gray: '#9AA3B2',                         // neutral

  red: '#E74C3C',                          // negative / below-benchmark

  border: '#ECEFF3',                       // gridlines, tooltip border
  textSubtle: '#9AA3B2',                   // axis labels, captions
  text: '#2D2D2D',                         // primary
  surface: '#FFFFFF',                      // light tooltip bg

  surfaceDark: '#2D2D2D',                  // dark multi-series tooltip bg
  surfaceDark2: '#4A4F57',                 // dark tooltip border
} as const

/**
 * Categorical color order for Donut / multi-series charts.
 * Exact asas palette: blue → turquoise → light-blue → orange → violet
 */
export const CATEGORICAL_COLORS: readonly string[] = [
  '#4361ee',
  '#00A67E',
  '#5DADE2',
  '#F39C12',
  '#8E44AD',
]

export const CHART_FONT = '"Yekan Bakh", Tahoma, Arial, sans-serif'
