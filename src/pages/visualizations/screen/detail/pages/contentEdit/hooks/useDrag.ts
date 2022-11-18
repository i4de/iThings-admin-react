/* eslint-disable prefer-const */
import { useEffect, useRef } from 'react';
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DragKeyEnum, MouseEventButton } from '@/enums/editPageEnum';
import { createComponent } from '@/packages';
import type {
  ConfigType,
  CreateComponentGroupType,
  CreateComponentType,
  PickCreateComponentType,
} from '@/packages/index.d';
import { message } from 'antd';

import { EditCanvasTypeEnum } from '@/models/chartEditStore/chartEditStore';
import {
  HistoryActionTypeEnum,
  HistoryTargetTypeEnum,
} from '@/models/chartHistoryStore/chartHistoryStore';
import useContextMenu from '@/pages/visualizations/hooks/useContextMenu';
import { awaitHandle, setComponentPosition } from '@/utils/utils';
import cloneDeep from 'lodash/cloneDeep';
import throttle from 'lodash/throttle';
import { uid } from 'uid';
import { useDispatch, useSelector } from 'umi';

const useDrag = () => {
  const setDispatch = useDispatch();
  const { editCanvas, targetChart, editCanvasConfig, componentList, targetId } = useSelector(
    (state) => state.chartEditStore,
  );

  const targetIdRef = useRef(null);
  const scaledRef = useRef(null);

  useEffect(() => {
    scaledRef.current = editCanvas?.scale;
  }, [editCanvas?.scale]);

  useEffect(() => {
    if (targetId !== undefined) targetIdRef.current = targetId;
  }, [targetId]);

  const { onClickOutSide } = useContextMenu();

  // * 拖拽到编辑区域里
  const dragHandle = async (e: DragEvent) => {
    e?.preventDefault();

    try {
      // 获取拖拽数据
      const drayDataString = e!.dataTransfer!.getData(DragKeyEnum.DRAG_KEY);
      if (!drayDataString) return;

      // 修改状态
      setDispatch({
        type: 'chartEditStore/setEditCanvas',
        payload: {
          k: EditCanvasTypeEnum.IS_CREATE,
          v: false,
        },
      });
      const dropData: Exclude<ConfigType, ['image']> = JSON.parse(drayDataString);

      // 创建新图表组件
      const component: CreateComponentType = await createComponent(dropData);
      const newComponent = { ...component, id: uid() };

      setComponentPosition(
        newComponent,
        e.nativeEvent.offsetX - newComponent.attr.w / 2,
        e.nativeEvent.offsetY - newComponent.attr.h / 2,
      );

      setDispatch({
        type: 'chartHistoryStore/pushBackStackItem',
        payload: {
          item: [newComponent],
          actionType: HistoryActionTypeEnum.ADD,
          targetType: HistoryTargetTypeEnum.CHART,
        },
      });

      setDispatch({
        type: 'chartEditStore/addComponentList',
        payload: { componentInstance: newComponent },
      });

      setDispatch({
        type: 'chartEditStore/setTargetSelectChart',
        payload: { selectId: newComponent.id },
      });

      return dropData;
    } catch (error) {
      message.error(`图表正在研发中, 敬请期待...`);
    }
  };

  // * 进入拖拽区域
  const dragoverHandle = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
  };

  // * 不拦截默认行为点击
  const mousedownHandleUnStop = (
    e: MouseEvent,
    item?: CreateComponentType | CreateComponentGroupType,
  ) => {
    if (item) {
      setDispatch({
        type: 'chartEditStore/setTargetSelectChart',
        payload: { selectId: item.id },
      });
      return;
    }
    setDispatch({
      type: 'chartEditStore/setTargetSelectChart',
      payload: { selectId: undefined },
    });
  };

  // * 框选
  const mousedownBoxSelect = (e: MouseEvent) => {
    mousedownHandleUnStop(e);

    // 记录点击初始位置
    const startOffsetX = e.nativeEvent.offsetX;
    const startOffsetY = e.nativeEvent.offsetY;
    const startScreenX = e.nativeEvent.screenX;
    const startScreenY = e.nativeEvent.screenY;

    // 记录缩放
    const scale = editCanvas.scale;

    setDispatch({
      type: 'chartEditStore/setMousePosition',
      payload: {
        x: undefined,
        y: undefined,
        startX: startOffsetX,
        startY: startOffsetY,
      },
    });

    // 移动框选
    const mousemove = throttle((moveEvent: MouseEvent) => {
      // 取消当前选中
      setDispatch({
        type: 'chartEditStore/setTargetSelectChart',
      });

      setDispatch({
        type: 'chartEditStore/setEditCanvas',
        payload: {
          k: EditCanvasTypeEnum.IS_SELECT,
          v: true,
        },
      });

      // 这里先把相对值算好，不然组件无法获取 startScreenX 和 startScreenY 的值
      const currX = startOffsetX + moveEvent.screenX - startScreenX;
      const currY = startOffsetY + moveEvent.screenY - startScreenY;
      setDispatch({
        type: 'chartEditStore/setMousePosition',
        payload: {
          x: currX,
          y: currX,
        },
      });
      // 计算框选的左上角和右下角
      const selectAttr = {
        // 左上角
        x1: 0,
        y1: 0,
        // 右下角
        x2: 0,
        y2: 0,
      };
      if (currX > startOffsetX && currY > startOffsetY) {
        // 右下方向
        selectAttr.x1 = startOffsetX;
        selectAttr.y1 = startOffsetY;
        selectAttr.x2 = Math.round(startOffsetX + (moveEvent.screenX - startScreenX) / scale);
        selectAttr.y2 = Math.round(startOffsetY + (moveEvent.screenY - startScreenY) / scale);
      } else if (currX > startOffsetX && currY < startOffsetY) {
        // 右上方向
        selectAttr.x1 = startOffsetX;
        selectAttr.y1 = Math.round(startOffsetY - (startScreenY - moveEvent.screenY) / scale);
        selectAttr.x2 = Math.round(startOffsetX + (moveEvent.screenX - startScreenX) / scale);
        selectAttr.y2 = startOffsetY;
      } else if (currX < startOffsetX && currY > startOffsetY) {
        selectAttr.x1 = Math.round(startOffsetX - (startScreenX - moveEvent.screenX) / scale);
        selectAttr.y1 = startOffsetY;
        selectAttr.x2 = startOffsetX;
        selectAttr.y2 = Math.round(startOffsetY + (moveEvent.screenY - startScreenY) / scale);
        // 左下方向
      } else {
        // 左上方向
        selectAttr.x1 = Math.round(startOffsetX - (startScreenX - moveEvent.screenX) / scale);
        selectAttr.y1 = Math.round(startOffsetY - (startScreenY - moveEvent.screenY) / scale);
        selectAttr.x2 = startOffsetX;
        selectAttr.y2 = startOffsetY;
      }

      // 遍历组件
      componentList.forEach((item) => {
        if (!targetChart.selectId.includes(item.id)) {
          // 处理左上角
          let isSelect = false;
          const { x, y, w, h } = item.attr;
          const targetAttr = {
            // 左上角
            x1: x,
            y1: y,
            // 右下角
            x2: x + w,
            y2: y + h,
          };
          // 全包含则选中
          if (
            targetAttr.x1 - selectAttr.x1 >= 0 &&
            targetAttr.y1 - selectAttr.y1 >= 0 &&
            targetAttr.x2 - selectAttr.x2 <= 0 &&
            targetAttr.y2 - selectAttr.y2 <= 0 &&
            !item.status.lock &&
            !item.status.hide
          ) {
            isSelect = true;
            setDispatch({
              type: 'chartEditStore/setTargetSelectChart',
              payload: {
                selectId: item.id,
                push: true,
              },
            });
          }
        }
      });
    }, 20);

    // 鼠标抬起
    const mouseup = () => {
      // 鼠标抬起时，结束mousemove的节流函数，避免选框不消失问题
      mousemove.cancel();
      setDispatch({
        type: 'chartEditStore/setEditCanvas',
        payload: {
          k: EditCanvasTypeEnum.IS_SELECT,
          v: false,
        },
      });

      setDispatch({
        type: 'chartEditStore/setMousePosition',
        payload: {
          x: 0,
          y: 0,
          startX: 0,
          startY: 0,
        },
      });
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
    };
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  };

  // *  Click 事件, 松开鼠标触发
  const mouseClickHandle = async (
    e: MouseEvent,
    item: CreateComponentType | CreateComponentGroupType,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (item.status.lock) return;

    // // 若此时按下了 CTRL, 表示多选
    if (window.$KeyboardActive?.ctrl) {
      // 若已选中，则去除
      if (targetChart.selectId.includes(item.id)) {
        const exList = targetChart.selectId.filter((e) => e !== item.id);
        setDispatch({
          type: 'chartEditStore/setTargetSelectChart',
          payload: { selectId: exList },
        });
      } else {
        setDispatch({
          type: 'chartEditStore/setTargetSelectChart',
          payload: {
            selectId: item.id,
            push: true,
          },
        });
      }
    }
  };

  // * 按下事件（包含移动事件）
  const mousedownHandle = async (
    e: MouseEvent,
    item: CreateComponentType | CreateComponentGroupType,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (item.status.lock) return;
    onClickOutSide();
    // 按下左键 + CTRL
    if (e.buttons === MouseEventButton.LEFT && window.$KeyboardActive?.ctrl) return;

    // 按下右键 + 选中多个 + 目标元素是多选子元素
    const selectId = targetChart.selectId;
    if (e.buttons === MouseEventButton.RIGHT && selectId.length > 1 && selectId.includes(item.id))
      return;

    // 选中当前目标组件
    setDispatch({
      type: 'chartEditStore/setTargetSelectChart',
      payload: {
        selectId: item.id,
      },
    });

    // 按下右键
    if (e.buttons === MouseEventButton.RIGHT) return;

    const scale = editCanvas.scale;
    const canvasWidth = editCanvasConfig.width;
    const canvasHeight = editCanvasConfig.height;

    // 记录图表初始位置和大小
    const targetMap = new Map();
    targetChart.selectId.forEach(async (id) => {
      setDispatch({
        type: 'chartEditStore/fetchTargetIndex',
        payload: {
          id,
        },
      });
      await awaitHandle();
      if (targetIdRef.current !== -1) {
        const { x, y, w, h } = componentList[targetIdRef.current].attr;
        targetMap.set(id, { x, y, w, h });
      }
    });

    await awaitHandle();
    // 记录点击初始位置
    const startX = e.nativeEvent.screenX;
    const startY = e.nativeEvent.screenY;

    // 记录历史位置
    const prevComponentInstance: CreateComponentType | CreateComponentGroupType[] = [];
    targetChart.selectId.forEach(async (id) => {
      await awaitHandle();
      if (!targetMap.has(id)) return;
      setDispatch({
        type: 'chartEditStore/fetchTargetIndex',
        payload: {
          id,
        },
      });
      await awaitHandle();
      // 拿到初始位置数据
      prevComponentInstance.push(cloneDeep(componentList[targetIdRef.current]));
    });

    await awaitHandle();

    // 记录初始位置
    setDispatch({
      type: 'chartEditStore/setMousePosition',
      payload: {
        x: undefined,
        y: undefined,
        startX,
        startY,
      },
    });

    // 移动-计算偏移量
    const mousemove = throttle(async (moveEvent: MouseEvent) => {
      setDispatch({
        type: 'chartEditStore/setEditCanvas',
        payload: {
          k: EditCanvasTypeEnum.IS_DRAG,
          v: true,
        },
      });
      setDispatch({
        type: 'chartEditStore/setMousePosition',
        payload: {
          x: moveEvent.screenX,
          y: moveEvent.screenY,
        },
      });

      await awaitHandle();

      // 当前偏移量，处理 scale 比例问题
      const offsetX = (moveEvent.screenX - startX) / scale;
      const offsetY = (moveEvent.screenY - startY) / scale;

      targetChart.selectId.forEach(async (id) => {
        await awaitHandle();
        if (!targetMap.has(id)) return;
        setDispatch({
          type: 'chartEditStore/fetchTargetIndex',
          payload: {
            id,
          },
        });
        await awaitHandle();
        // 拿到初始位置数据
        const { x, y, w, h } = targetMap.get(id);
        let componentInstance = componentList[targetIdRef.current];

        await awaitHandle();

        let currX = Math.round(x + offsetX);
        let currY = Math.round(y + offsetY);

        // 要预留的距离
        const distance = 50;

        // 基于左上角位置检测
        currX = currX < -w + distance ? -w + distance : currX;
        currY = currY < -h + distance ? -h + distance : currY;

        // 基于右下角位置检测
        currX = currX > canvasWidth - distance ? canvasWidth - distance : currX;
        currY = currY > canvasHeight - distance ? canvasHeight - distance : currY;

        let currObj = {
          x: currX,
          y: currY,
        };

        if (componentInstance) {
          componentInstance = {
            ...componentInstance,
            attr: { ...componentInstance.attr, ...currObj },
          };
        }

        await awaitHandle();

        setDispatch({
          type: 'chartEditStore/setComponentListAttr',
          payload: {
            componentInstance,
          },
        });
      });
      return;
    }, 20);

    const mouseup = async () => {
      try {
        setDispatch({
          type: 'chartEditStore/setMousePosition',
          payload: {
            x: 0,
            y: 0,
            startX: 0,
            startY: 0,
          },
        });
        setDispatch({
          type: 'chartEditStore/setEditCanvas',
          payload: {
            k: EditCanvasTypeEnum.IS_DRAG,
            v: false,
          },
        });
        await awaitHandle();
        // 加入历史栈
        if (prevComponentInstance.length) {
          targetChart.selectId.forEach(async (id) => {
            await awaitHandle();
            if (!targetMap.has(id)) return;
            setDispatch({
              type: 'chartEditStore/fetchTargetIndex',
              payload: {
                id,
              },
            });
            await awaitHandle();

            const curComponentInstance = componentList[targetIdRef.current];

            await awaitHandle();

            // 找到记录的所选组件
            prevComponentInstance.forEach((preItem) => {
              if (preItem.id === id) {
                preItem.attr = Object.assign(preItem.attr, {
                  offsetX: curComponentInstance.attr.x - preItem.attr.x,
                  offsetY: curComponentInstance.attr.y - preItem.attr.y,
                });
              }
            });
          });

          setDispatch({
            type: 'chartHistoryStore/pushBackStackItem',
            payload: {
              item: prevComponentInstance,
              actionType: HistoryActionTypeEnum.MOVE,
              targetType: HistoryTargetTypeEnum.CHART,
            },
          });
        }
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
      } catch (err) {
        console.log(err);
      }
    };

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  };

  // * 进入事件
  const mouseenterHandle = (
    e: MouseEvent,
    item: CreateComponentType | CreateComponentGroupType,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editCanvas.isSelect) {
      setDispatch({
        type: 'chartEditStore/setTargetHoverChart',
        payload: {
          hoverId: item.id,
        },
      });
    }
  };

  // * 移出事件
  const mouseleaveHandle = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setDispatch({
      type: 'chartEditStore/setEditCanvas',
      payload: {
        k: EditCanvasTypeEnum.IS_DRAG,
        v: false,
      },
    });

    setDispatch({
      type: 'chartEditStore/setTargetHoverChart',
      payload: {
        hoverId: undefined,
      },
    });
  };

  // * 移动锚点
  const mousePointHandle = (
    e: MouseEvent,
    point: string,
    attr: PickCreateComponentType<'attr'>,
  ) => {
    e.stopPropagation();
    e.preventDefault();

    // 设置拖拽状态
    setDispatch({
      type: 'chartEditStore/setEditCanvas',
      payload: {
        k: EditCanvasTypeEnum.IS_DRAG,
        v: true,
      },
    });

    const scale = editCanvas.scale;

    const itemAttrX = attr.x;
    const itemAttrY = attr.y;
    const itemAttrW = attr.w;
    const itemAttrH = attr.h;

    // 记录点击初始位置
    const startX = e.screenX;
    const startY = e.screenY;

    // 记录初始位置
    setDispatch({
      type: 'chartEditStore/setMousePosition',
      payload: {
        x: startX,
        y: startY,
      },
    });

    const mousemove = throttle((moveEvent: MouseEvent) => {
      setDispatch({
        type: 'chartEditStore/setMousePosition',
        payload: {
          x: moveEvent.screenX,
          y: moveEvent.screenY,
        },
      });

      const currX = Math.round((moveEvent.screenX - startX) / scale);
      const currY = Math.round((moveEvent.screenY - startY) / scale);

      const isTop = /t/.test(point);
      const isBottom = /b/.test(point);
      const isLeft = /l/.test(point);
      const isRight = /r/.test(point);

      const newHeight = itemAttrH + (isTop ? -currY : isBottom ? currY : 0);
      const newWidth = itemAttrW + (isLeft ? -currX : isRight ? currX : 0);

      attr.h = newHeight > 0 ? newHeight : 0;
      attr.w = newWidth > 0 ? newWidth : 0;
      attr.x = itemAttrX + (isLeft ? currX : 0);
      attr.y = itemAttrY + (isTop ? currY : 0);
    }, 50);

    const mouseup = () => {
      setDispatch({
        type: 'chartEditStore/setEditCanvas',
        payload: {
          k: EditCanvasTypeEnum.IS_DRAG,
          v: false,
        },
      });

      setDispatch({
        type: 'chartEditStore/setMousePosition',
        payload: {
          x: 0,
          y: 0,
          startX: 0,
          startY: 0,
        },
      });

      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
    };

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  };

  return {
    mousedownHandleUnStop,
    dragHandle,
    dragoverHandle,
    mousePointHandle,
    mouseClickHandle,
    mousedownHandle,
    mouseenterHandle,
    mouseleaveHandle,
    mousedownBoxSelect,
  };
};

export default useDrag;
