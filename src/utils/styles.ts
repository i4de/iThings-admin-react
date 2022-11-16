import { EditCanvasConfigType } from '@/models/chartEditStore/chartEditStore';
import type { PickCreateComponentType } from '@/packages/index.d';

type StylesType = PickCreateComponentType<'styles'>;

// * 动画
export const animationsClass = (animations: string[]) => {
  if (animations.length) {
    return `animate__animated  animate__${animations[0]}`;
  }
  return '';
};

// * 滤镜
export const getFilterStyle = (styles?: StylesType | EditCanvasConfigType) => {
  if (!styles || !styles.filterShow) return {};
  const { opacity, saturate, contrast, hueRotate, brightness } = styles;
  return {
    opacity: opacity,
    filter: `saturate(${saturate}) contrast(${contrast}) hue-rotate(${hueRotate}deg) brightness(${brightness})`,
  };
};

// * 变换
export const getTransformStyle = (styles: StylesType) => {
  const { rotateZ, rotateX, rotateY, skewX, skewY } = styles;
  return {
    transform: `rotateZ(${rotateZ || 0}deg) rotateX(${rotateX || 0}deg) rotateY(${
      rotateY || 0
    }deg) skewX(${skewX || 0}deg) skewY(${skewY || 0}deg)`,
  };
};

// * 混合模式
export const getBlendModeStyle = (styles: StylesType) => {
  if (!styles || !styles.filterShow) return {};
  const { blendMode } = styles;
  return {
    'mix-blend-mode': blendMode,
  };
};
