import { editHistoryMax } from '@/settings/designSetting';

// 历史记录项
export enum HistoryStackItemEnum {
  ID = 'id',
  TARGET_TYPE = 'targetType',
  ACTION_TYPE = 'actionType',
  HISTORY_DATA = 'historyData',
}

export enum HistoryActionTypeEnum {
  // 新增
  ADD = 'add',
  // 删除
  DELETE = 'delete',
  // 更新（位置，属性）
  UPDATE = 'update',
  // 移动
  MOVE = 'move',
  // 复制
  COPY = 'copy',
  // 剪切
  CUT = 'cut',
  // 粘贴
  PASTE = 'paste',
  // 置顶
  TOP = 'top',
  // 置底
  BOTTOM = 'bottom',
  // 上移
  UP = 'up',
  // 下移
  DOWN = 'down',
  // 成组
  GROUP = 'group',
  // 解组
  UN_GROUP = 'unGroup',
  // 锁定
  LOCK = 'lock',
  // 解除锁定
  UNLOCK = 'unLock',
  // 隐藏
  HIDE = 'hide',
  // 显示
  SHOW = 'show',
}

// 对象类型
export enum HistoryTargetTypeEnum {
  CANVAS = 'canvas',
  CHART = 'chart',
}

const chartEditStoreModel = {
  namespace: 'chartHistoryStore',
  state: {
    // 后退栈
    backStack: [],
    // 前进栈
    forwardStack: [],
  },
  reducers: {
    // * 推入后退栈
    pushBackStackItem(state, { payload }) {
      const obj = Object.freeze({
        [HistoryStackItemEnum.ID]: new Date().getTime().toString(),
        [HistoryStackItemEnum.HISTORY_DATA]: payload?.item,
        [HistoryStackItemEnum.ACTION_TYPE]: HistoryActionTypeEnum.ADD,
        [HistoryStackItemEnum.TARGET_TYPE]: HistoryTargetTypeEnum.CHART,
      });
      const backStackArr = state.backStack;
      backStackArr.splice(0, state.backStack.length - editHistoryMax);
      // 新动作需清空前进栈
      if (payload?.notClear) return;
      state.forwardStack = [];

      if (payload?.item instanceof Array) {
        return {
          ...state.backStack,
          ...obj,
        };
      } else {
        backStackArr.push(obj);
        return {
          ...state,
          backStack: backStackArr,
        };
      }
    },
  },
};

export default chartEditStoreModel;
