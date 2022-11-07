import { CreateComponentType } from '@/packages/index.d';
import { PublicConfigClass } from '@/packages/public';
import cloneDeep from 'lodash/cloneDeep';
import { Decorates05Config } from './index';

export const option = {
  colors: ['#00c2ff', '#00c2ff4d'],
  dur: 3,
};

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Decorates05Config.key;
  public chartConfig = cloneDeep(Decorates05Config);
  public option = cloneDeep(option);
}
