import { defaultTheme, globalThemeJson } from '@/settings/chartThemes';
import { previewScaleType, requestInterval, requestIntervalUnit } from '@/settings/designSetting';
import { isArray, isString } from '@/utils/type';

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
  },
  reducers: {
    setEditCanvas(state, { payload }) {
      return {
        ...state,
        [state.editCanvas.isCreate]: payload,
      };
    },
    setTargetSelectChart(state, { payload }) {
      // 重复选中
      if (state.targetChart.selectId.find((e: string) => e === payload?.selectId)) return;

      // 无 id 清空
      if (!payload?.selectId) {
        return {
          ...state.targetChart,
          selectId: [],
        };
      }
      // 多选
      if (payload?.push) {
        const selectIdArr = state.targetChart.selectId;
        // 字符串
        if (isString(payload?.selectId)) {
          selectIdArr.push(payload?.selectId);
          return {
            ...state.targetChart,
            selectId: selectIdArr,
          };
        }
        // 数组
        if (isArray(payload?.selectId)) {
          selectIdArr.push([...payload?.selectId]);
          return {
            ...state.targetChart,
            selectId: selectIdArr,
          };
        }
      } else {
        // 字符串
        if (isString(payload?.selectId)) {
          return {
            ...state.targetChart,
            selectId: [payload?.selectId],
          };
        }
        // 数组
        if (isArray(payload?.selectId)) {
          return {
            ...state.targetChart,
            selectId: payload?.selectId,
          };
        }
      }
    },
    addComponentList(state, { payload }) {
      const componentList = state.componentList;
      console.log(state);
      console.log(payload?.componentInstance);

      componentList.push(payload?.componentInstance);
      return {
        ...state,
        componentList,
      };
    },
  },
};

export default chartEditStoreModel;
