/* eslint-disable @typescript-eslint/no-unused-vars */
import { PackagesCategoryEnum, PackagesCategoryName, PackagesType } from '@/packages/index.d';
import {
  CopyrightOutlined,
  InfoCircleOutlined,
  InsertRowAboveOutlined,
  PartitionOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';

export type MenuOptionsType = {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  list: PackagesType;
};

const useAside = () => {
  const menuOptions: MenuOptionsType[] = [];
  const packagesListDispatch = useDispatch();
  const { packagesList } = useSelector((state) => state.packagesStore);
  // 选中的对象值
  const [selectOptions, setSelectOptions] = useState<MenuOptionsType[]>([]);

  useEffect(() => {
    packagesListDispatch({
      type: 'packagesStore/getPackagesList',
    });
  }, []);

  const packagesListObj = {
    [PackagesCategoryEnum.CHARTS]: {
      icon: <PartitionOutlined />,
      label: PackagesCategoryName.CHARTS,
    },
    [PackagesCategoryEnum.INFORMATIONS]: {
      icon: <InfoCircleOutlined />,
      label: PackagesCategoryName.INFORMATIONS,
    },
    [PackagesCategoryEnum.TABLES]: {
      icon: <InsertRowAboveOutlined />,
      label: PackagesCategoryName.TABLES,
    },
    [PackagesCategoryEnum.DECORATES]: {
      icon: <CopyrightOutlined />,
      label: PackagesCategoryName.DECORATES,
    },
  };

  // 处理列表
  const handlePackagesList = () => {
    for (const val in packagesList) {
      menuOptions.push({
        key: val,
        icon: packagesListObj[val]?.icon,
        label: packagesListObj[val]?.label,
        list: packagesList[val],
      });
    }
  };
  handlePackagesList();

  // 记录选中值
  let beforeSelect: string = menuOptions[0]['key'];
  const [leftselectValue, setLeftSelectValue] = useState<string>(menuOptions[0]['key']);

  useEffect(() => {
    setSelectOptions(menuOptions[0]);
  }, []);

  // 点击左边菜单item

  const clickItemHandle = (e) => {
    const { item, key } = e;

    setSelectOptions(item.props);
    setLeftSelectValue(key);
    // // 处理折叠
    // if (beforeSelect === key) {
    //   setItem(ChartLayoutStoreEnum.CHARTS, !getCharts.value);
    // } else {
    //   setItem(ChartLayoutStoreEnum.CHARTS, true);
    // }
    beforeSelect = key;
  };
  return {
    menuOptions,
    clickItemHandle,
    selectOptions,
    leftselectValue,
  };
};

export default useAside;
