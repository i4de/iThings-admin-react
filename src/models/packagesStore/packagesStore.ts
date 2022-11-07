import { packagesList } from '@/packages/index';
import type { Reducer } from 'umi';
import type { PackagesType } from '../../packages/index.d';

export interface PackagesStoreType {
  packagesList: PackagesType;
}

export interface packagesStoreModelType {
  namespace: 'packagesStore';
  state: PackagesStoreType;
  reducers: {
    getPackagesList: Reducer<PackagesType>;
  };
}

const packagesStoreModel: packagesStoreModelType = {
  namespace: 'packagesStore',
  state: {
    packagesList: Object.freeze(packagesList),
  },
  reducers: {
    getPackagesList(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default packagesStoreModel;
