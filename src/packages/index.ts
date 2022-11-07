import { ChartList } from '@/packages/components/Charts/index';
import { DecorateList } from '@/packages/components/Decorates/index';
import { InformationList } from '@/packages/components/Informations/index';
import { TableList } from '@/packages/components/Tables/index';
import { PackagesCategoryEnum, PackagesType } from '@/packages/index.d';

// * 所有图表
export const packagesList: PackagesType = {
  [PackagesCategoryEnum.CHARTS]: ChartList,
  [PackagesCategoryEnum.INFORMATIONS]: InformationList,
  [PackagesCategoryEnum.TABLES]: TableList,
  [PackagesCategoryEnum.DECORATES]: DecorateList,
};
