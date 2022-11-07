import { CreateComponentType } from '@/packages/index.d';
import { PublicConfigClass } from '@/packages/public';
import cloneDeep from 'lodash/cloneDeep';
import { Decorates02Config } from './index';

export const option = {
  colors: ['#ffffff4d', '#ffffff4d'],
  dur: 3,
  lineHeight: 3,
};

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Decorates02Config.key;
  public chartConfig = cloneDeep(Decorates02Config);
  public option = cloneDeep(option);
}
