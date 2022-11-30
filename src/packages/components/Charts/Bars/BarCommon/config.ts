import type { CreateComponentType } from '@/packages/index.d';
import { echartOptionProfixHandle } from '@/packages/public/chart';
import { PublicConfigClass } from '@/packages/public/publicConfig';
import cloneDeep from 'lodash/cloneDeep';
import dataJson from './data.json';
import { BarCommonConfig } from './index';

export const includes = ['legend', 'xAxis', 'yAxis', 'grid'];
export const seriesItem = {
  type: 'bar',
  barWidth: 15,
  label: {
    show: true,
    position: 'top',
    color: '#fff',
    fontSize: 12,
  },
  itemStyle: {
    color: null,
    borderRadius: 2,
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
    type: 'category',
  },
  yAxis: {
    show: true,
    type: 'value',
  },
  dataset: { ...dataJson },
  series: [seriesItem, seriesItem],
};

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = BarCommonConfig.key;
  public chartConfig = cloneDeep(BarCommonConfig);
  // 图表配置项
  public option = echartOptionProfixHandle(option, includes);
}
