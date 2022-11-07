import { CreateComponentType } from '@/packages/index.d';
import { PublicConfigClass } from '@/packages/public';
import cloneDeep from 'lodash/cloneDeep';
import { Border13Config } from './index';

export const option = {
  colors: ['#2862b7', '#4b77b7'],
  backgroundColor: '#00000000',
};

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Border13Config.key;
  public chartConfig = cloneDeep(Border13Config);
  public option = cloneDeep(option);
}
