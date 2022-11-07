import { CreateComponentType } from '@/packages/index.d';
import { PublicConfigClass } from '@/packages/public';
import cloneDeep from 'lodash/cloneDeep';
import { Border10Config } from './index';

export const option = {
  colors: ['#1089ff', '#0000ff'],
  backgroundColor: '#00000000',
};

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Border10Config.key;
  public chartConfig = cloneDeep(Border10Config);
  public option = cloneDeep(option);
}
