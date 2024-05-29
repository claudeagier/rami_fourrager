import Vue from 'vue'
import { use, init, registerTheme } from 'echarts/core'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { HeatmapChart, BarChart, LineChart } from 'echarts/charts'
import theme from './echartTheme.json'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent,
  ToolboxComponent,
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'

use([
  CanvasRenderer,
  HeatmapChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  GridComponent,
  LineChart,
  ToolboxComponent,
])
registerTheme('infographic', theme)

// register component to use
Vue.component('v-chart', VChart)
