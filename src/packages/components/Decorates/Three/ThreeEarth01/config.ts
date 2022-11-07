import { CreateComponentType } from '@/packages/index.d';
import { PublicConfigClass } from '@/packages/public';
import { chartInitConfig } from '@/settings/designSetting';
import cloneDeep from 'lodash/cloneDeep';
import dataJson from './data.json';
import { ThreeEarth01Config } from './index';

export const option = {
  dataset: dataJson,
};

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = ThreeEarth01Config.key;
  public attr = { ...chartInitConfig, w: 800, h: 800, zIndex: -1 };
  public chartConfig = cloneDeep(ThreeEarth01Config);
  public option = cloneDeep(option);
}
