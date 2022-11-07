import image from '@/assets/images/chart/charts/radar.png';
import { ChartFrameEnum, ConfigType, PackagesCategoryEnum } from '@/packages/index.d';
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d';

export const RadarConfig: ConfigType = {
  key: 'Radar',
  chartKey: 'VRadar',
  conKey: 'VCRadar',
  title: '雷达图',
  category: ChatCategoryEnum.MORE,
  categoryName: ChatCategoryEnumName.MORE,
  package: PackagesCategoryEnum.CHARTS,
  chartFrame: ChartFrameEnum.COMMON,
  image,
};
