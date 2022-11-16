import { mergeTheme } from '@/packages/public/chart';
import ReactECharts from 'echarts-for-react';
import { useEffect } from 'react';
import { includes } from './config';

const BarCrossrange: React.FC = (props) => {
  const { themeColor, themeSetting, chartConfig } = props || {};

  const getOption = () => mergeTheme(chartConfig?.option, themeSetting, includes);

  // dataset 无法变更条数的补丁
  useEffect(() => {}, []);

  return <ReactECharts theme={themeColor} option={getOption()} />;
};

export default BarCrossrange;
