import { MenuEnum } from '@/enums/editPageEnum';
import { StorageEnum } from '@/enums/storageEnum';
import { PreviewScaleEnum } from '@/enums/styleEnum';
import type { CreateComponentGroupType, FilterEnum } from '@/packages/index.d';
import {
  ChartColorsNameType,
  defaultTheme,
  globalThemeJson,
  GlobalThemeJsonType,
} from '@/settings/chartThemes';
import { previewScaleType, requestInterval, requestIntervalUnit } from '@/settings/designSetting';
import { SettingStoreEnums, systemSetting, ToolsStatusEnum } from '@/settings/systemSetting';
import { getLocalStorage } from '@/utils/storage';
import { isArray, isString } from '@/utils/type';
import { message } from 'antd';

const { ITHINGS_SYSTEM_SETTING_STORE } = StorageEnum;

export enum EditCanvasTypeEnum {
  EDIT_LAYOUT_DOM = 'editLayoutDom',
  EDIT_CONTENT_DOM = 'editContentDom',
  OFFSET = 'offset',
  SCALE = 'scale',
  USER_SCALE = 'userScale',
  LOCK_SCALE = 'lockScale',
  IS_CREATE = 'isCreate',
  IS_DRAG = 'isDrag',
  IS_SELECT = 'isSelect',
}

// 滤镜/背景色/宽高主题等
export enum EditCanvasConfigEnum {
  WIDTH = 'width',
  HEIGHT = 'height',
  CHART_THEME_COLOR = 'chartThemeColor',
  CHART_THEME_SETTING = 'chartThemeSetting',
  BACKGROUND = 'background',
  BACKGROUND_IMAGE = 'backgroundImage',
  SELECT_COLOR = 'selectColor',
  PREVIEW_SCALE_TYPE = 'previewScaleType',
  FILTER_SHOW = 'filterShow',
}

export interface EditCanvasConfigType {
  // 滤镜-启用
  [FilterEnum.FILTERS_SHOW]: boolean;
  // 滤镜-色相
  [FilterEnum.HUE_ROTATE]: number;
  // 滤镜-饱和度
  [FilterEnum.SATURATE]: number;
  // 滤镜-亮度
  [FilterEnum.BRIGHTNESS]: number;
  // 滤镜-对比度
  [FilterEnum.CONTRAST]: number;
  // 滤镜-不透明度
  [FilterEnum.OPACITY]: number;
  // 变换（暂不使用）
  [FilterEnum.ROTATE_Z]: number;
  [FilterEnum.ROTATE_X]: number;
  [FilterEnum.ROTATE_Y]: number;
  [FilterEnum.SKEW_X]: number;
  [FilterEnum.SKEW_Y]: number;
  [FilterEnum.BLEND_MODE]: string;
  // 大屏宽度
  [EditCanvasConfigEnum.WIDTH]: number;
  // 大屏高度
  [EditCanvasConfigEnum.HEIGHT]: number;
  // 背景色
  [EditCanvasConfigEnum.BACKGROUND]?: string;
  [EditCanvasConfigEnum.BACKGROUND_IMAGE]?: string | null;
  // 图表主题颜色
  [EditCanvasConfigEnum.CHART_THEME_COLOR]: ChartColorsNameType;
  // 图表全局配置
  [EditCanvasConfigEnum.CHART_THEME_SETTING]: GlobalThemeJsonType;
  // 图表主题颜色
  [EditCanvasConfigEnum.SELECT_COLOR]: boolean;
  // 预览展示方式
  [EditCanvasConfigEnum.PREVIEW_SCALE_TYPE]: PreviewScaleEnum;
}

export interface SettingStoreType {
  [SettingStoreEnums.HIDE_PACKAGE_ONE_CATEGORY]: boolean;
  [SettingStoreEnums.CHANGE_LANG_RELOAD]: boolean;
  [SettingStoreEnums.ASIDE_ALL_COLLAPSED]: boolean;
  [SettingStoreEnums.CHART_MOVE_DISTANCE]: number;
  [SettingStoreEnums.CHART_ALIGN_RANGE]: number;
  [SettingStoreEnums.CHART_TOOLS_STATUS]: ToolsStatusEnum;
  [SettingStoreEnums.CHART_TOOLS_STATUS_HIDE]: boolean;
}

// 编辑区域
export type EditCanvasType = {
  // 编辑区域 DOM
  [EditCanvasTypeEnum.EDIT_LAYOUT_DOM]: HTMLElement | null;
  [EditCanvasTypeEnum.EDIT_CONTENT_DOM]: HTMLElement | null;
  // 偏移大小
  [EditCanvasTypeEnum.OFFSET]: number;
  // 缩放
  [EditCanvasTypeEnum.SCALE]: number;
  // 缩放
  [EditCanvasTypeEnum.USER_SCALE]: number;
  // 锁定缩放
  [EditCanvasTypeEnum.LOCK_SCALE]: boolean;
  // 初始化创建
  [EditCanvasTypeEnum.IS_CREATE]: boolean;
  // 拖拽中
  [EditCanvasTypeEnum.IS_DRAG]: boolean;
  // 框选中
  [EditCanvasTypeEnum.IS_SELECT]: boolean;
};

const storageSetting: SettingStoreType = getLocalStorage(ITHINGS_SYSTEM_SETTING_STORE);

const chartEditStoreModel = {
  namespace: 'chartEditStore',
  state: {
    // 画布属性
    editCanvas: {
      // 编辑区域 Dom
      editLayoutDom: null,
      editContentDom: null,
      // 偏移量
      offset: 20,
      // 系统控制缩放
      scale: 1,
      // 用户控制的缩放
      userScale: 1,
      // 锁定缩放
      lockScale: false,
      // 初始化
      isCreate: false,
      // 拖拽中
      isDrag: false,
      // 框选中
      isSelect: false,
    },
    // 右键菜单
    rightMenuShow: false,
    // 鼠标定位
    mousePosition: {
      startX: 0,
      startY: 0,
      x: 0,
      y: 0,
    },
    // 目标图表
    targetChart: {
      hoverId: undefined,
      selectId: [],
    },
    // 记录临时数据（复制等）
    recordChart: undefined,
    // -----------------------
    // 画布属性（需存储给后端）
    editCanvasConfig: {
      // 默认宽度
      width: 1920,
      // 默认高度
      height: 1080,
      // 启用滤镜
      filterShow: false,
      // 色相
      hueRotate: 0,
      // 饱和度
      saturate: 1,
      // 对比度
      contrast: 1,
      // 亮度
      brightness: 1,
      // 透明度
      opacity: 1,
      // 变换（暂不更改）
      rotateZ: 0,
      rotateX: 0,
      rotateY: 0,
      skewX: 0,
      skewY: 0,
      // 混合模式
      blendMode: 'normal',
      // 默认背景色
      background: undefined,
      backgroundImage: undefined,
      // 是否使用纯颜色
      selectColor: true,
      // chart 主题色
      chartThemeColor: defaultTheme || 'dark',
      // 全局配置
      chartThemeSetting: globalThemeJson,
      // 预览方式
      previewScaleType: previewScaleType,
    },
    // 数据请求处理（需存储给后端）
    requestGlobalConfig: {
      requestOriginUrl: '',
      requestInterval: requestInterval,
      requestIntervalUnit: requestIntervalUnit,
      requestParams: {
        Body: {
          'form-data': {},
          'x-www-form-urlencoded': {},
          json: '',
          xml: '',
        },
        Header: {},
        Params: {},
      },
    },
    // 图表数组（需存储给后端）
    componentList: [],

    targetId: undefined,
  },
  reducers: {
    setEditCanvas(state, { payload }) {
      state.editCanvas[payload?.k] = payload?.v;
    },
    setEditCanvasConfig(state, { payload }) {
      state.editCanvasConfig[payload?.k] = payload?.v;
    },
    setComponentListAttr(state, { payload }) {
      state.componentList[0] = payload?.componentInstance;
    },

    setTargetSelectChart(state, { payload }) {
      // 重复选中
      if (state.targetChart.selectId.find((e: string) => e === payload?.selectId)) return;

      // 无 id 清空
      if (!payload?.selectId) {
        console.log('1');

        state.targetChart.selectId = [];
      }

      // 多选
      if (payload?.push) {
        // 字符串
        if (isString(payload?.selectId)) {
          state.targetChart.selectId.push(payload?.selectId);
        }
        // 数组
        if (isArray(payload?.selectId)) {
          state.targetChart.selectId.push(...payload?.selectId);
        }
      } else {
        // 字符串
        if (isString(payload?.selectId)) {
          state.targetChart.selectId = [payload?.selectId];
        }
        // 数组
        if (isArray(payload?.selectId)) {
          state.targetChart.selectId = payload?.selectId;
        }
      }
    },

    addComponentList(state, { payload }) {
      state.componentList.push(payload?.componentInstance);
    },

    // 监听缩放
    listenerScale(state) {
      const setPageStyle = <T extends keyof CSSStyleDeclaration>(key: T, value: any) => {
        if (state?.editCanvas?.editContentDom) {
          state.editCanvas.editContentDom[key] = value;
        }
      };

      const setPageSize = (scale: number) => {
        setPageStyle('height', `${state.editCanvasConfig.height * scale}px`);
        setPageStyle('width', `${state.editCanvasConfig.height * scale}px`);
      };

      /**
       * * 设置缩放
       * @param scale 0~1 number 缩放比例;
       * @param force boolean 强制缩放
       */

      const setScale = (scale: number, force = false) => {
        if (state.editCanvas.lockScale || force) {
          setPageSize(scale);
          state.EditCanvas.userScale = scale;
          state.EditCanvas.scale = scale;
        }
      };
      const resize = () => {
        if (state?.editCanvas?.editLayoutDom) {
          // 现有展示区域
          const width =
            state?.editCanvas?.editLayoutDom?.clientWidth - state.editCanvas.offset * 2 - 5;
          const height =
            state?.editCanvas?.editLayoutDom?.clientHeight - state.editCanvas.offset * 4;

          // 用户设定大小
          const editCanvasWidth = state.editCanvasConfig.width;
          const editCanvasHeight = state.editCanvasConfig.height;

          // 需保持的比例
          const baseProportion = parseFloat((editCanvasWidth / editCanvasHeight).toFixed(5));
          const currentRate = parseFloat((width / height).toFixed(5));

          if (currentRate > baseProportion) {
            // 表示更宽
            const scaleWidth = parseFloat(((height * baseProportion) / editCanvasWidth).toFixed(5));
            setScale(scaleWidth > 1 ? 1 : scaleWidth);
          } else {
            // 表示更高
            const scaleHeight = parseFloat((width / baseProportion / editCanvasHeight).toFixed(5));
            setScale(scaleHeight > 1 ? 1 : scaleHeight);
          }
        } else {
          message.warning('请先创建画布，再进行缩放');
        }
      };

      // 默认执行一次
      resize();
      // 开始监听
      window.addEventListener('resize', resize);

      // 销毁函数
      const remove = () => {
        window.removeEventListener('resize', resize);
      };
      return remove;
    },

    // 设置鼠标位置
    setMousePosition(state, { payload }) {
      if (payload?.x) state.mousePosition.x = payload?.x;
      if (payload?.y) state.mousePosition.x = payload?.y;
      if (payload?.startX) state.mousePosition.x = payload?.startX;
      if (payload?.startX) state.mousePosition.x = payload?.startY;
    },

    // * 设置右键菜单
    setRightMenuShow(state, { payload }) {
      state.rightMenuShow = payload?.value;
    },

    // * 移动位置
    setMove(state, { payload }) {
      // * 找到目标 id 数据的下标位置，id可为父级或子集数组（无则返回-1）
      const fetchTargetIndex = (id?: string) => {
        const targetId =
          id || (state.targetChart.selectId.length && state.targetChart.selectId[0]) || undefined;
        if (!targetId) {
          return -1;
        }
        const targetIndex = state.componentList.findIndex((e) => e.id === targetId);

        // 当前
        if (targetIndex !== -1) {
          return targetIndex;
        } else {
          const length = state.componentList.length;
          for (let i = 0; i < length; i++) {
            if (state.componentList[i].isGroup) {
              for (const cItem of (state.componentList[i] as CreateComponentGroupType).groupList) {
                if (cItem.id === targetId) {
                  return i;
                }
              }
            }
          }
        }
        return -1;
      };
      const index = fetchTargetIndex();
      if (index === -1) return;

      const setting = storageSetting || systemSetting;
      const attr = state.componentList[index].attr;
      const distance = setting.chartMoveDistance;
      switch (payload?.keyboardValue) {
        case MenuEnum.ARROW_UP:
          attr.y -= distance;
          break;
        case MenuEnum.ARROW_RIGHT:
          attr.x += distance;
          break;
        case MenuEnum.ARROW_DOWN:
          attr.y += distance;
          break;
        case MenuEnum.ARROW_LEFT:
          attr.x -= distance;
          break;
      }
    },

    // * 找到目标 id 数据的下标位置，id可为父级或子集数组（无则返回-1）
    fetchTargetIndex(state, { payload }) {
      const targetId =
        payload?.id ||
        (state.targetChart.selectId.length && state.targetChart.selectId[0]) ||
        undefined;
      if (!targetId) {
        state.targetId = -1;
        return;
      }
      const targetIndex = state.componentList.findIndex((e) => e.id === targetId);

      // 当前
      if (targetIndex !== -1) {
        state.targetId = targetIndex;
        return;
      } else {
        const length = state.componentList.length;
        for (let i = 0; i < length; i++) {
          if (state.componentList[i].isGroup) {
            for (const cItem of (state.componentList[i] as CreateComponentGroupType).groupList) {
              if (cItem.id === targetId) {
                state.targetId = i;
              }
            }
          }
        }
      }
      state.targetId = -1;
      return;
    },

    setTargetHoverChart(state, { payload }) {
      state.targetChart.hoverId = payload?.hoverId;
    },
  },
};

export default chartEditStoreModel;
