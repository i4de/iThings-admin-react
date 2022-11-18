import { StorageEnum } from '@/enums/storageEnum';
import { ThemeEnum } from '@/enums/styleEnum';
import { theme } from '@/settings/designSetting';
import { getLocalStorage, setLocalStorage } from '@/utils/storage';

const { darkTheme, appTheme, appThemeDetail } = theme;

const { ITHINGS_DESIGN_STORE } = StorageEnum;

const storageDesign = getLocalStorage(ITHINGS_DESIGN_STORE);

export type AppThemeColorType = {
  CMYK: number[];
  RGB: number[];
  hex: string;
  name: string;
  pinyin: string;
};

export interface DesignStateType {
  // 是否是深色主题
  darkTheme: boolean;
  // 主题名称
  themeName: ThemeEnum;
  //色号
  appTheme: string;
  appThemeDetail: AppThemeColorType | null;
}

const designStoreModel = {
  namespace: 'designStore',
  state: storageDesign || {
    // 是否暗黑
    darkTheme,
    // 主题名称
    themeName: (darkTheme && ThemeEnum.DARK) || ThemeEnum.LIGHT,
    // 颜色色号
    appTheme,
    appThemeDetail,
  },
  reducers: {
    // 切换主题
    changeTheme(state) {
      state.darkTheme = !state.darkTheme;
      state.themeName = state.darkTheme ? ThemeEnum.DARK : ThemeEnum.LIGHT;
      setLocalStorage(ITHINGS_DESIGN_STORE, state.$state);
    },
    // 设置颜色
    setAppColor(state, { payload }) {
      state.appTheme = payload?.color.hex;
      state.appThemeDetail = payload?.color;
      setLocalStorage(ITHINGS_DESIGN_STORE, state.$state);
    },
  },
};

export default designStoreModel;
