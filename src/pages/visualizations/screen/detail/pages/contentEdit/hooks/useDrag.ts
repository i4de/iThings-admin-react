import { DragKeyEnum } from '@/enums/editPageEnum';
import { createComponent } from '@/packages';
import { ConfigType, CreateComponentGroupType, CreateComponentType } from '@/packages/index.d';
import { message } from 'antd';

import { EditCanvasTypeEnum } from '@/models/chartEditStore/chartEditStore';
import { setComponentPosition } from '@/utils/utils';
import { useDispatch } from 'umi';

const useDrag = () => {
  const setDispatch = useDispatch();

  // * 拖拽到编辑区域里
  const dragHandle = async (e: DragEvent) => {
    console.log('1');

    e.preventDefault();

    try {
      // 获取拖拽数据
      const drayDataString = e!.dataTransfer!.getData(DragKeyEnum.DRAG_KEY);
      if (!drayDataString) return;

      // 修改状态
      setDispatch({
        type: 'chartEditStore/setEditCanvas',
        payload: {
          [EditCanvasTypeEnum.IS_CREATE]: false,
        },
      });

      const dropData: Exclude<ConfigType, ['image']> = JSON.parse(drayDataString);
      // 创建新图表组件
      const newComponent: CreateComponentType = await createComponent(dropData);
      setComponentPosition(
        newComponent,
        e.offsetX - newComponent.attr.w / 2,
        e.offsetY - newComponent.attr.h / 2,
      );

      setDispatch({
        type: 'chartHistoryStore/pushBackStackItem',
        payload: { componentInstance: [newComponent] },
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

  return {
    mousedownHandleUnStop,
    dragHandle,
    dragoverHandle,
  };
};

export default useDrag;
