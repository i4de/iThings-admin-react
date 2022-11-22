import imgSrc from '@/assets/images/canvas/noImage.png';
import { EditCanvasConfigEnum } from '@/models/chartEditStore/chartEditStore';
import { backgroundImageSize } from '@/settings/designSetting';
import { ProFormDigit } from '@ant-design/pro-form';
import { Button, Divider, message, Segmented, Select, Space, Tabs, Typography, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import { ChromePicker } from 'react-color';
import { useDispatch, useSelector } from 'umi';

import { StylesSetting } from '@/components/pages/ChartItemSetting';
import { PreviewScaleEnum } from '@/enums/styleEnum';
import {
  AppleOutlined,
  ColumnHeightOutlined,
  ColumnWidthOutlined,
  DragOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import ChartThemeColor from './components/ChartThemeColor';
import './styles.less';

const { Text } = Typography;

const Configuration: React.FC = () => {
  const { editCanvas, editCanvasConfig } = useSelector((state) => state.chartEditStore);
  const setDispatch = useDispatch();

  const [isShowColor, setIsShowColor] = useState(false);
  const [selectColorValue, setSelectColorValue] = useState(0);
  const [segmentedValue, setSegmentedValue] = useState(PreviewScaleEnum.FIT);

  // 默认应用类型
  const selectColorOptions = [
    {
      label: '应用颜色',
      value: 0,
    },
    {
      label: '应用背景',
      value: 1,
    },
  ];

  //预览切换
  const previewTypeList = [
    {
      value: PreviewScaleEnum.FIT,
      icon: <DragOutlined />,
    },
    {
      value: PreviewScaleEnum.SCROLL_Y,
      icon: <ColumnWidthOutlined />,
    },
    {
      value: PreviewScaleEnum.SCROLL_X,
      icon: <ColumnHeightOutlined />,
    },
    {
      value: PreviewScaleEnum.FULL,
      icon: <FullscreenOutlined />,
    },
  ];

  const chromeColorHandle = () => setIsShowColor(!isShowColor);

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 jpg/png格式的图片');
    }
    const isLt = file.size / 1024 / 1024 < backgroundImageSize;
    if (!isLt) {
      message.error(`图片需小于 ${backgroundImageSize}M`);
    }
    return isJpgOrPng && isLt;
  };

  const uploadHandle: UploadProps['onChange'] = () => {};
  const selectHandle = (v: number) => setSelectColorValue(v);

  // 清除颜色
  const clearColor = () => {
    setDispatch({
      type: 'chartEditStore/setEditCanvasConfig',
      payload: {
        k: EditCanvasConfigEnum.BACKGROUND,
        v: undefined,
      },
    });

    if (editCanvasConfig.backgroundImage) {
      setDispatch({
        type: 'chartEditStore/setEditCanvasConfig',
        payload: {
          k: EditCanvasConfigEnum.SELECT_COLOR,
          v: false,
        },
      });
    }
  };

  // 清除背景
  const clearImg = () => {
    setDispatch({
      type: 'chartEditStore/setEditCanvasConfig',
      payload: {
        k: EditCanvasConfigEnum.BACKGROUND,
        v: undefined,
      },
    });
    setDispatch({
      type: 'chartEditStore/setEditCanvasConfig',
      payload: {
        k: EditCanvasConfigEnum.SELECT_COLOR,
        v: true,
      },
    });
  };

  return (
    <>
      {/*宽高*/}
      <section className="page-form">
        <ProFormDigit
          min={50}
          label="宽度"
          name="canvasWidth"
          width="xs"
          fieldProps={{
            value: editCanvasConfig?.width,
            disabled: editCanvas.lockScale,
            onChange: () =>
              setDispatch({
                type: 'chartEditStore/computedScale',
              }),
          }}
        />
        <ProFormDigit
          min={50}
          label="高度"
          name="canvasHidth"
          width="xs"
          fieldProps={{
            value: editCanvasConfig?.height,
            disabled: editCanvas.lockScale,
            onChange: () =>
              setDispatch({
                type: 'chartEditStore/computedScale',
              }),
          }}
        />
      </section>
      {/*背景相关*/}
      <section className="background-control">
        <div className="upload-box">
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={uploadHandle}
          >
            <div className="upload-dragger">
              {/* {editCanvasConfig.backgroundImage && (
                <img className="upload-show" src={editCanvasConfig.backgroundImage} alt="背景" />
              )} */}
              <div className="upload-img">
                <img src={imgSrc} className="upload-show" />
                <Text className="upload-desc">
                  背景图需小于 {backgroundImageSize}M ，格式为 png/jpg/gif 的文件
                </Text>
              </div>
            </div>
          </Upload>
        </div>
        <Space direction="vertical" size="middle">
          <Space>
            <Text className="label-text">背景颜色</Text>
            <div className="color-pick">
              <div
                className="picker-height"
                onClick={chromeColorHandle}
                style={{ backgroundColor: editCanvasConfig.background }}
              >
                {editCanvasConfig.background || '#000'}
              </div>
              <div className="color-set">
                {isShowColor && (
                  <ChromePicker
                    color={editCanvasConfig.background}
                    onChangeComplete={(color) => {
                      setDispatch({
                        type: 'chartEditStore/setEditCanvasConfig',
                        payload: {
                          k: EditCanvasConfigEnum.BACKGROUND,
                          v: `${color.hex}`,
                        },
                      });
                    }}
                  />
                )}
              </div>
            </div>
          </Space>
          <Space>
            <Text className="label-text">应用类型</Text>
            <Select
              className="color-select"
              style={{ width: '263px' }}
              disabled={!editCanvasConfig.backgroundImage}
              value={selectColorValue}
              onChange={selectHandle}
              options={selectColorOptions}
            />
          </Space>
          <Space>
            <Text className="label-text">背景控制</Text>
            <Button
              className="clear-btn"
              disabled={!editCanvasConfig.backgroundImage}
              onClick={clearImg}
            >
              清除背景
            </Button>
            <Button
              className="clear-btn"
              disabled={!editCanvasConfig.backgroundImage}
              onClick={clearColor}
            >
              清除颜色
            </Button>
          </Space>
          <Space>
            <Text className="label-text">预览方式</Text>
            <Segmented
              value={segmentedValue}
              onChange={setSegmentedValue}
              options={previewTypeList}
              className="preview-control"
            />
          </Space>
        </Space>
      </section>
      {/*滤镜*/}
      <section className="len">
        <StylesSetting isCanvas={true} />
      </section>
      <Divider />
      <section>
        <Tabs
          size="small"
          centered
          animated
          defaultActiveKey="1"
          items={[AppleOutlined].map((Icon) => {
            return {
              label: (
                <div className="tabs-label">
                  <Icon />
                  主题颜色
                </div>
              ),
              key: 'ChartTheme',
              children: <ChartThemeColor />,
            };
          })}
        />
      </section>
    </>
  );
};

export default Configuration;
