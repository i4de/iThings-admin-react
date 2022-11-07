import image from '@/assets/images/chart/charts/line_linear_single.png';
import { ChartFrameEnum, ConfigType, PackagesCategoryEnum } from '@/packages/index.d';
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d';

export const LineLinearSingleConfig: ConfigType = {
  key: 'LineLinearSingle',
  chartKey: 'VLineLinearSingle',
  conKey: 'VCLineLinearSingle',
  title: '单折线渐变图',
  category: ChatCategoryEnum.LINE,
  categoryName: ChatCategoryEnumName.LINE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.ECHARTS,
  image,
};
