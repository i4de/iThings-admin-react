import { CreateComponentType } from '@/packages/index.d';
import { PublicConfigClass } from '@/packages/public';
import cloneDeep from 'lodash/cloneDeep';
import { Border07Config } from './index';

export const option = {
  colors: ['#11eefd', '#0078d2'],
  backgroundColor: '#00000000',
};

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Border07Config.key;
  public chartConfig = cloneDeep(Border07Config);
  public option = cloneDeep(option);
}