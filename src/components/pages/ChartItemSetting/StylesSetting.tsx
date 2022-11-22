import { EditCanvasConfigEnum } from '@/models/chartEditStore/chartEditStore';
import { BlendModeEnumList, FilterEnum } from '@/packages/index.d';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Divider, InputNumber, Select, Slider, Switch, Tag, Tooltip, Typography } from 'antd';
import { useDispatch, useSelector } from 'umi';
import CollapseItem from './CollapseItem';
import SettingItem from './SettingItem';
import SettingItemBox from './SettingItemBox';

const { Text } = Typography;
const StylesSetting: React.FC<{
  isGroup?: boolean;
  isCanvas: boolean;
}> = ({ isGroup, isCanvas }) => {
  const { editCanvasConfig } = useSelector((state) => state.chartEditStore);
  const setDispatch = useDispatch();

  const switchHandle = (checked: boolean) => {
    setDispatch({
      type: 'chartEditStore/setEditCanvasConfig',
      payload: {
        k: EditCanvasConfigEnum.FILTER_SHOW,
        v: checked,
      },
    });
  };

  const genExtra = () => <Switch onChange={switchHandle} checked={editCanvasConfig.filterShow} />;

  // 角度格式化
  const degFormatTooltip = (v: number) => `${v}deg`;

  // 百分比格式化 person
  const sliderFormatTooltip = (v: number) => `${(parseFloat(String(v)) * 100).toFixed(0)}%`;

  const changeHandle = (v: number, setConfig: FilterEnum) => {
    setDispatch({
      type: 'chartEditStore/setEditCanvasConfig',
      payload: {
        k: setConfig,
        v,
      },
    });
  };

  const selectHandle = (v: string) => {
    setDispatch({
      type: 'chartEditStore/setEditCanvasConfig',
      payload: {
        k: FilterEnum.BLEND_MODE,
        v,
      },
    });
  };

  return (
    <>
      {isGroup && (
        <>
          <Divider n-divider style={{ margin: '10px 0' }} />
          <Tag color="warning"> 解散分组「 {isCanvas ? '滤镜' : '滤镜 / 变换'} 」也将消失!</Tag>
        </>
      )}
      <CollapseItem name={isCanvas ? '滤镜' : '滤镜 / 变换'} extraNode={genExtra}>
        {/*页面基础配置*/}
        <SettingItemBox name="色相" alone={true}>
          <div slot="default">
            <SettingItem name={`值：${editCanvasConfig.hueRotate}deg`}>
              <Slider
                value={editCanvasConfig.hueRotate}
                min={0}
                max={360}
                step={3}
                tooltip={{ degFormatTooltip }}
                onChange={(v) => changeHandle(v, FilterEnum.HUE_ROTATE)}
              />
            </SettingItem>
          </div>
        </SettingItemBox>
        <SettingItemBox name="饱和度" alone={true}>
          <div slot="default">
            <SettingItem
              name={`值：${(parseFloat(String(editCanvasConfig.saturate)) * 100).toFixed(0)}%`}
            >
              <Slider
                value={editCanvasConfig.saturate}
                min={0}
                max={2}
                step={0.1}
                tooltip={{ sliderFormatTooltip }}
                onChange={(v) => changeHandle(v, FilterEnum.SATURATE)}
              />
            </SettingItem>
          </div>
        </SettingItemBox>
        <SettingItemBox name="对比度" alone={true}>
          <div slot="default">
            <SettingItem
              name={`值：${(parseFloat(String(editCanvasConfig.contrast)) * 100).toFixed(0)}%`}
            >
              <Slider
                value={editCanvasConfig.contrast}
                min={0}
                max={2}
                step={0.1}
                tooltip={{ sliderFormatTooltip }}
                onChange={(v) => changeHandle(v, FilterEnum.CONTRAST)}
              />
            </SettingItem>
          </div>
        </SettingItemBox>
        <SettingItemBox name="亮度" alone={true}>
          <div slot="default">
            <SettingItem
              name={`值：${(parseFloat(String(editCanvasConfig.brightness)) * 100).toFixed(0)}%`}
            >
              <Slider
                value={editCanvasConfig.brightness}
                min={0}
                max={2}
                step={0.1}
                tooltip={{ sliderFormatTooltip }}
                onChange={(v) => changeHandle(v, FilterEnum.BRIGHTNESS)}
              />
            </SettingItem>
          </div>
        </SettingItemBox>
        <SettingItemBox name="透明度" alone={true}>
          <div slot="default">
            <SettingItem
              name={`值：${(parseFloat(String(editCanvasConfig.opacity)) * 100).toFixed(0)}%`}
            >
              <Slider
                value={editCanvasConfig.opacity}
                min={0}
                max={2}
                step={0.1}
                tooltip={{ sliderFormatTooltip }}
                onChange={(v) => changeHandle(v, FilterEnum.OPACITY)}
              />
            </SettingItem>
          </div>
        </SettingItemBox>
        {!isCanvas && (
          <>
            {/*混合模式*/}
            <SettingItemBox alone={true}>
              <div slot="name">
                <Text>混合</Text>
                <Tooltip title="视频组件需要底色透明一般选中滤色">
                  <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
                </Tooltip>
              </div>
              <div slot="default">
                <SettingItem>
                  <Select
                    showSearch
                    className="color-select"
                    style={{ width: '100%' }}
                    value={editCanvasConfig.blendMode}
                    onChange={selectHandle}
                    options={BlendModeEnumList}
                  />
                </SettingItem>
              </div>
            </SettingItemBox>
            {/*变换*/}
            <SettingItemBox name="旋转°">
              <SettingItem name="Z轴(平面) - 旋转">
                <InputNumber
                  min={1}
                  max={360}
                  value={editCanvasConfig.rotateZ}
                  onChange={(v) => changeHandle(v, FilterEnum.ROTATE_Z)}
                  placeholder="角度"
                />
              </SettingItem>
              <SettingItem name="X轴 - 旋转">
                <InputNumber
                  min={1}
                  max={360}
                  value={editCanvasConfig.rotateX}
                  onChange={(v) => changeHandle(v, FilterEnum.ROTATE_X)}
                  placeholder="角度"
                />
              </SettingItem>
              <SettingItem name="Y轴 - 旋转">
                <InputNumber
                  min={1}
                  max={360}
                  value={editCanvasConfig.rotateY}
                  onChange={(v) => changeHandle(v, FilterEnum.ROTATE_Y)}
                  placeholder="角度"
                />
              </SettingItem>
            </SettingItemBox>
            {/*倾斜*/}
            <SettingItemBox name="倾斜°">
              <SettingItem name="X轴 - 倾斜">
                <InputNumber
                  min={1}
                  max={360}
                  value={editCanvasConfig.skewX}
                  onChange={(v) => changeHandle(v, FilterEnum.SKEW_X)}
                  placeholder="角度"
                />
              </SettingItem>
              <SettingItem name="Y轴 - 倾斜">
                <InputNumber
                  min={1}
                  max={360}
                  value={editCanvasConfig.skewY}
                  onChange={(v) => changeHandle(v, FilterEnum.SKEW_Y)}
                  placeholder="角度"
                />
              </SettingItem>
            </SettingItemBox>
          </>
        )}
        {/*提示*/}
        <Tag color="warning" style={{ marginLeft: '10px', fontSize: '14px' }}>
          若预览时大屏模糊，可以尝试关闭滤镜进行修复
        </Tag>
      </CollapseItem>
    </>
  );
};
export default StylesSetting;
