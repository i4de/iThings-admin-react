import image from '@/assets/images/chart/decorates/border06.png';
import { ConfigType, PackagesCategoryEnum } from '@/packages/index.d';
import { ChatCategoryEnum, ChatCategoryEnumName } from '../../index.d';

export const Border06Config: ConfigType = {
  key: 'Border06',
  chartKey: 'VBorder06',
  conKey: 'VCBorder06',
  title: '边框-06',
  category: ChatCategoryEnum.BORDER,
  categoryName: ChatCategoryEnumName.BORDER,
  package: PackagesCategoryEnum.DECORATES,
  image,
};