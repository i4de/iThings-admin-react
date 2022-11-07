import { CreateComponentType } from '@/packages/index.d';
import { PublicConfigClass } from '@/packages/public';
import cloneDeep from 'lodash/cloneDeep';
import { Border09Config } from './index';

export const option = {
  colors: ['#3140ad', '#235fa7'],
  backgroundColor: '#00000000',
};

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Border09Config.key;
  public chartConfig = cloneDeep(Border09Config);
  public option = cloneDeep(option);
}
