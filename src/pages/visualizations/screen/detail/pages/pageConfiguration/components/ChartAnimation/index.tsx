import { CollapseItem } from '@/components/pages/ChartItemSetting';
import { animations } from '@/settings/animations';
import { Button, Col, Row } from 'antd';
import { useState } from 'react';
import { useTargetData } from '../../hooks/useTargetData';

import classNames from 'classnames';
import './styles.less';

const ChartAnimation: React.FC = () => {
  const { selectTarget } = useTargetData();

  const [hoverPreviewAnimate, sethoverPreviewAnimate] = useState('');

  const clearAnimation = () => {};

  // * 新增动画，现只支持一种
  const addAnimation = () => {};

  // * 选中的动画样式
  const activeIndex = (value: string) => {
    const selectValue = selectTarget?.styles.animations;
    if (!selectValue.length) return false;
    return selectValue[0] === value;
  };

  return (
    <>
      {selectTarget && (
        <div className="ithings-chart-configurations-animations">
          <Button
            className="clear-btn ithings-my-2"
            disabled={!selectTarget.styles.animations.length}
            onClick={clearAnimation}
          >
            清除动画
          </Button>
          {animations.map((item) => (
            <CollapseItem name={item.label} key={item.label} expanded={true}>
              <Row gutter={[4, 8]}>
                {item.children.map((childrenItem) => (
                  <Col
                    span={8}
                    key={childrenItem.label}
                    className={classNames(
                      [
                        activeIndex(childrenItem.value) ? 'active' : '',
                        hoverPreviewAnimate === childrenItem.value
                          ? `animate__animated animate__${childrenItem.value}`
                          : '',
                      ],
                      'animation-item',
                      'ithings-transition-quick',
                    )}
                    onMouseOver={() => sethoverPreviewAnimate(childrenItem.value)}
                    onClick={() => addAnimation(childrenItem)}
                  >
                    {childrenItem.label}
                  </Col>
                ))}
              </Row>
            </CollapseItem>
          ))}
        </div>
      )}
    </>
  );
};
export default ChartAnimation;
