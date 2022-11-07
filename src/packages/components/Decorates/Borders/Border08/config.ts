import { CreateComponentType } from '@/packages/index.d';
import { PublicConfigClass } from '@/packages/public';
import cloneDeep from 'lodash/cloneDeep';
import { Border08Config } from './index';

export const option = {
  colors: ['#235fa7', '#4fd2dd'],
  dur: 3,
  reverse: false,
  backgroundColor: '#00000000',
};

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Border08Config.key;
  public chartConfig = cloneDeep(Border08Config);
  public option = cloneDeep(option);
}
