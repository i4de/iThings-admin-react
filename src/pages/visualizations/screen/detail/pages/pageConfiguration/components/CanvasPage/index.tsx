import imgSrc from '@/assets/images/canvas/noImage.png';
import { EditCanvasConfigEnum } from '@/models/chartEditStore/chartEditStore';
import { backgroundImageSize } from '@/settings/designSetting';
import {
  Button,
  Divider,
  InputNumber,
  message,
  Popover,
  Select,
  Space,
  Tabs,
  Tooltip,
  Typography,
  Upload,
} from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import ReactGPicker from 'react-gcolor-picker';
import { useDispatch, useSelector } from 'umi';

import { StylesSetting } from '@/components/pages/ChartItemSetting';
import { PreviewScaleEnum } from '@/enums/styleEnum';
import { fileToUrl } from '@/utils/utils';
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

  // //预览切换
  const previewTypeList = [
    {
      key: PreviewScaleEnum.FIT,
      icon: <DragOutlined />,
      title: '自适应比例展示，页面会有留白',
    },
    {
      key: PreviewScaleEnum.SCROLL_Y,
      icon: <ColumnWidthOutlined />,
      title: 'X轴铺满，Y轴自适应滚动',
    },
    {
      key: PreviewScaleEnum.SCROLL_X,
      icon: <ColumnHeightOutlined />,
      title: 'Y轴铺满，X轴自适应滚动',
    },
    {
      key: PreviewScaleEnum.FULL,
      icon: <FullscreenOutlined />,
      title: '强行拉伸画面，填充所有视图',
    },
  ];

  // 选择预览方式
  const selectPreviewType = (key: PreviewScaleEnum) => {
    setDispatch({
      type: 'chartEditStore/setEditCanvasConfig',
      payload: {
        k: EditCanvasConfigEnum.PREVIEW_SCALE_TYPE,
        v: key,
      },
    });
  };

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

  // 自定义上传操作
  const customRequest: UploadProps['customRequest'] = (options) => {
    const { file } = options;

    if (file) {
      const ImageUrl = fileToUrl(file as RcFile);

      setDispatch({
        type: 'chartEditStore/setEditCanvasConfig',
        payload: {
          k: EditCanvasConfigEnum.BACKGROUND_IMAGE,
          v: ImageUrl,
        },
      });
      setDispatch({
        type: 'chartEditStore/setEditCanvasConfig',
        payload: {
          k: EditCanvasConfigEnum.SELECT_COLOR,
          v: false,
        },
      });
    } else {
      message.error('添加图片失败，请稍后重试！');
    }
  };

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

  // 计算宽高

  const computedScaleHandle = (k: EditCanvasConfigEnum, v: number) => {
    setDispatch({
      type: 'chartEditStore/setEditCanvasConfig',
      payload: {
        k,
        v,
      },
    });
    setDispatch({
      type: 'chartEditStore/computedScale',
    });
  };

  const colorPickHandle = (color: string) =>
    setDispatch({
      type: 'chartEditStore/setEditCanvasConfig',
      payload: {
        k: EditCanvasConfigEnum.BACKGROUND,
        v: color,
      },
    });

  return (
    <>
      {/*宽高*/}
      <section className="page-form">
        <Space size={30}>
          <Text className="label-text n-text">宽度</Text>
          <InputNumber
            size="small"
            min={50}
            value={editCanvasConfig?.width}
            onChange={(v) => computedScaleHandle(EditCanvasConfigEnum.WIDTH, v)}
            placeholder="宽度"
            disabled={editCanvas.lockScale}
            className="radius"
          />
          <Text className="label-text n-text">高度</Text>
          <InputNumber
            size="small"
            min={50}
            value={editCanvasConfig?.height}
            onChange={(v) => computedScaleHandle(EditCanvasConfigEnum.HEIGHT, v)}
            placeholder="高度"
            disabled={editCanvas.lockScale}
            className="radius"
          />
        </Space>
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
            customRequest={customRequest}
          >
            <div className="upload-dragger">
              {editCanvasConfig.backgroundImage ? (
                <img className="upload-show" src={editCanvasConfig.backgroundImage} alt="背景" />
              ) : (
                <div className="upload-img">
                  <img src={imgSrc} className="upload-show radius" />
                  <Text className="upload-desc">
                    背景图需小于 {backgroundImageSize}M ，格式为 png/jpg/gif 的文件
                  </Text>
                </div>
              )}
            </div>
          </Upload>
        </div>
        <Space direction="vertical" size="middle">
          <Space>
            <Text className="label-text">背景颜色</Text>
            <div className="color-pick radius">
              <Popover
                content={
                  <div className="color-set">
                    {isShowColor && (
                      <ReactGPicker
                        value={editCanvasConfig.background}
                        format="hex"
                        onChange={colorPickHandle}
                      />
                    )}
                  </div>
                }
                trigger="click"
                placement="bottom"
              >
                <div
                  className="picker-height radius"
                  onClick={chromeColorHandle}
                  style={{ backgroundColor: editCanvasConfig.background }}
                >
                  {editCanvasConfig.background || '#000'}
                </div>
              </Popover>
            </div>
          </Space>
          <Space>
            <Text className="label-text">应用类型</Text>
            <Select
              size="small"
              className="color-select"
              style={{ width: '263px' }}
              disabled={!editCanvasConfig.backgroundImage}
              value={selectColorValue}
              onChange={selectHandle}
              options={selectColorOptions}
              popupClassName="select-option"
            />
          </Space>
          <Space>
            <Text className="label-text">背景控制</Text>
            <Button
              size="small"
              className="clear-btn radius"
              disabled={!editCanvasConfig.backgroundImage}
              onClick={clearImg}
            >
              清除背景
            </Button>
            <Button
              size="small"
              className="clear-btn radius"
              disabled={!editCanvasConfig.backgroundImage}
              onClick={clearColor}
            >
              清除颜色
            </Button>
          </Space>
          <Space>
            <Text className="label-text">预览方式</Text>
            <Space.Compact block>
              {previewTypeList.map((item) => (
                <Tooltip title={item.title} key={item.key}>
                  <Button
                    icon={item.icon}
                    style={{ width: '66px', height: '24px' }}
                    size="small"
                    onClick={() => selectPreviewType(item.key)}
                    className="radius preview-btn"
                  />
                </Tooltip>
              ))}
            </Space.Compact>
          </Space>
        </Space>
      </section>
      {/*滤镜*/}
      <section className="len">
        <StylesSetting isCanvas={true} />
      </section>
      <Divider style={{ margin: '0 0 16px 0' }} />
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
