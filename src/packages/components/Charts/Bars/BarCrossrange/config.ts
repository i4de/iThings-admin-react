import type { CreateComponentType } from '@/packages/index.d';
import { echartOptionProfixHandle } from '@/packages/public/chart';
import { PublicConfigClass } from '@/packages/public/publicConfig';
import cloneDeep from 'lodash/cloneDeep';
import dataJson from './data.json';
import { BarCrossrangeConfig } from './index';

export const includes = ['legend', 'xAxis', 'yAxis', 'grid'];
export const seriesItem = {
  type: 'bar',
  barWidth: null,
  label: {
    show: true,
    position: 'right',
    color: '#fff',
    fontSize: 12,
  },
  itemStyle: {
    color: null,
    borderRadius: 0,
  },
};
export const option = {
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      show: true,
      type: 'shadow',
    },
  },
  xAxis: {
    show: true,
    type: 'value',
  },
  yAxis: {
    show: true,
    type: 'category',
  },
  dataset: { ...dataJson },
  series: [seriesItem, seriesItem],
};

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = BarCrossrangeConfig.key;
  public chartConfig = cloneDeep(BarCrossrangeConfig);
  // 图表配置项
  public option = echartOptionProfixHandle(option, includes);
}
