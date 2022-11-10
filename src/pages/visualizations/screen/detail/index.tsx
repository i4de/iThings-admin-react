import { Layout, Menu, MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import useAside from './hooks/useAside';
// import {loadAsyncComponent} from '@/utils/component'

import { ConfigType } from '@/packages';
import '@/styles/scrollStyle.less';
import ChartsItemBox from './components/ChartsItemBox';
import ContentEdit from './pages/contentEdit';

import './index.less';

const { Header, Content, Sider } = Layout;

const ScreenDetail: React.FC = () => {
  const { menuOptions, clickItemHandle, selectOptions, leftselectValue } = useAside();

  const [rightSelectValue, setRightSelectValue] = useState('');
  const [itemBoxOptions, setItemBoxOptions] = useState([]);
  const [packages, setPackages] = useState<{
    [T: string]: any;
  }>({
    // 侧边栏
    menuOptions: [],
    // 当前选择
    selectOptions: [],
    // 分类归档
    categorys: {
      all: [],
    },
    categoryNames: {
      all: '所有',
    },
    // 分类归档数量
    categorysNum: 0,
    // 存储不同类别组件进来的选中值
    saveSelectOptions: {},
  });

  const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
  }));

  // 处理点击事件
  const rightClickItemHandle = (e) => {
    const { key } = e;
    setPackages((pre) => ({ ...pre, selectOptions: packages.categorys[key] }));
    setRightSelectValue(key);
  };

  const categoryNamesArr = {
    all: '所有',
  };
  const categorysObj = {
    all: [],
  };
  const menuOptionsArr = [];
  const allcategorysArr = [];
  let selectOptionsObj = {};

  // 设置初始列表
  const selectOptionsHandle = (categorys: any) => {
    for (const val in categorys) {
      selectOptionsObj = categorys[val];
      break;
    }
    setItemBoxOptions(selectOptionsObj);
    setPackages((pre) => ({ ...pre, selectOptions: selectOptionsObj }));
  };

  useEffect(() => {
    if (!selectOptions) return;
    selectOptions?.list?.forEach((e: ConfigType) => {
      allcategorysArr.push(e);

      const value: ConfigType[] = (packages.categorys as any)[e.category];
      categorysObj[e.category] = value && value.length ? [...value, e] : [e];

      setPackages((pre) => ({ ...pre, categorys: { ...categorysObj, all: [...allcategorysArr] } }));

      categoryNamesArr[e.category] = e.categoryName;
      setPackages((pre) => ({ ...pre, categoryNames: categoryNamesArr }));
    });
    for (const val in packages.categorys) {
      setPackages((pre) => ({ ...pre, categorysNum: Object.keys(packages?.categorys).length }));
      if (val !== 'Mores')
        menuOptionsArr.push({
          key: val,
          label: packages.categoryNames[val],
        });
    }
    menuOptionsArr.push({
      key: 'Mores',
      label: packages.categoryNames['Mores'],
    });
    setPackages((pre) => ({ ...pre, menuOptions: menuOptionsArr }));
    selectOptionsHandle(packages.categorys);
    // // 默认选中处理
    setRightSelectValue(menuOptionsArr[0]['key']);
  }, [selectOptions, Object.keys(packages?.categorys).length]);

  const arrType = [];
  itemBoxOptions.forEach((v) => {
    arrType.push(v.key);
  });

  console.log(packages);

  return (
    <>
      <Header className="site-header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} />
      </Header>
      <Content>
        <Layout className="site-layout-background">
          <section>
            <header className="site-layout-background">123</header>
            <aside style={{ display: 'flex' }}>
              <Sider className="site-layout-background" width={100}>
                <Menu
                  mode="vertical"
                  selectedKeys={[leftselectValue]}
                  style={{ height: '100%' }}
                  items={menuOptions}
                  onClick={clickItemHandle}
                />
              </Sider>
              <Sider className="site-layout-background" width={100}>
                <Menu
                  mode="vertical"
                  selectedKeys={[rightSelectValue]}
                  style={{ height: '100%' }}
                  items={packages.categorysNum > 0 && packages.menuOptions}
                  onClick={rightClickItemHandle}
                />
              </Sider>
              <Sider className="site-layout-background site-img" width={180}>
                <div className="charts-box scroll-bar">
                  {itemBoxOptions?.map((v) => (
                    <ChartsItemBox menuOptionsItem={v} key={v?.key} />
                  ))}
                </div>
              </Sider>
            </aside>
          </section>
          <Content>
            <ContentEdit itemBoxOptions={itemBoxOptions} allType={arrType} />
          </Content>
        </Layout>
      </Content>
    </>
  );
};

export default ScreenDetail;
