import logo from '@/assets/logo.png';
import { CreateComponentType } from '@/packages/index.d';
import { PublicConfigClass } from '@/packages/public';
import cloneDeep from 'lodash/cloneDeep';
import { ImageConfig } from './index';

export const option = {
  // 图片路径
  dataset: logo,
  // 适应方式
  fit: 'contain',
  // 圆角
  borderRadius: 10,
};

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = ImageConfig.key;
  public chartConfig = cloneDeep(ImageConfig);
  public option = cloneDeep(option);
}
