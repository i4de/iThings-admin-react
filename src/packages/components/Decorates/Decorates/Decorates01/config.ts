import { CreateComponentType } from '@/packages/index.d';
import { PublicConfigClass } from '@/packages/public';
import cloneDeep from 'lodash/cloneDeep';
import { Decorates01Config } from './index';

export const option = {
  colors: ['#3faacb', '#fff'],
  dur: 3,
  lineHeight: 2,
  endWidth: 5,
};

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Decorates01Config.key;
  public chartConfig = cloneDeep(Decorates01Config);
  public option = cloneDeep(option);
}
