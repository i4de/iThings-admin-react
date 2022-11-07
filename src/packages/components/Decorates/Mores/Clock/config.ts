import { CreateComponentType } from '@/packages/index.d';
import { PublicConfigClass } from '@/packages/public';
import cloneDeep from 'lodash/cloneDeep';
import { ClockConfig } from './index';

export const option = {
  border: 6,
  color: '#ffffff',
  bgColor: '#84a5e9',
  borderColor: '#ffffff',
};

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = ClockConfig.key;
  public chartConfig = cloneDeep(ClockConfig);
  public option = cloneDeep(option);
}
