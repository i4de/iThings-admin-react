import { CreateComponentType } from '@/packages/index.d';
import { PublicConfigClass } from '@/packages/public';
import cloneDeep from 'lodash/cloneDeep';
import { Border12Config } from './index';

export const option = {
  colors: ['#2862b7', '#2862b7'],
  backgroundColor: '#00000000',
};

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Border12Config.key;
  public chartConfig = cloneDeep(Border12Config);
  public option = cloneDeep(option);
}
