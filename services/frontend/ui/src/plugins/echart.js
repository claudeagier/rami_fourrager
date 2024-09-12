import Vue from 'vue'
import { use, init, registerTheme } from 'echarts/core'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { HeatmapChart, BarChart, LineChart, GaugeChart } from 'echarts/charts'
import theme from './echartTheme.json'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent,
  ToolboxComponent,
  TimelineComponent,
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'

use([
  CanvasRenderer,
  HeatmapChart,
  BarChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  GridComponent,
  LineChart,
  ToolboxComponent,
  TimelineComponent,
])
registerTheme('infographic', theme)

// register component to use
Vue.component('v-chart', VChart)
