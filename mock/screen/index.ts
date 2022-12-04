import { RequestHttpEnum } from '@/enums/httpEnum';

// 单个X数据
export const chartDataUrl = '/mock/chartData';
export const chartSingleDataUrl = '/mock/chartSingleData';
export const numberFloatUrl = '/mock/number/float';
export const numberIntUrl = '/mock/number/int';
export const textUrl = '/mock/text';
export const imageUrl = '/mock/image';
export const rankListUrl = '/mock/rankList';
export const scrollBoardUrl = '/mock/scrollBoard';
export const radarUrl = '/mock/radarData';
export const heatMapUrl = '/mock/heatMapData';
export const scatterBasicUrl = '/mock/scatterBasic';
export const mapUrl = '/mock/map';
export const capsuleUrl = '/mock/capsule';
export const wordCloudUrl = '/mock/wordCloud';
export const treemapUrl = '/mock/treemap';
export const threeEarth01Url = '/mock/threeEarth01Data';

const mockObject = [
  {
    // 正则
    // url: /\/mock\/mockData(|\?\S*)$/,
    url: chartDataUrl,
    method: RequestHttpEnum.GET,
  },
  {
    url: chartSingleDataUrl,
    method: RequestHttpEnum.GET,
  },
  {
    url: numberFloatUrl,
    method: RequestHttpEnum.GET,
  },
  {
    url: numberIntUrl,
    method: RequestHttpEnum.GET,
  },
  {
    url: textUrl,
    method: RequestHttpEnum.GET,
  },
  {
    url: imageUrl,
    method: RequestHttpEnum.GET,
  },
  {
    url: rankListUrl,
    method: RequestHttpEnum.GET,
  },
  {
    url: scrollBoardUrl,
    method: RequestHttpEnum.GET,
  },
  {
    url: radarUrl,
    method: RequestHttpEnum.GET,
  },
  {
    url: heatMapUrl,
    method: RequestHttpEnum.GET,
  },
  {
    url: scatterBasicUrl,
    method: RequestHttpEnum.GET,
  },
  {
    url: mapUrl,
    method: RequestHttpEnum.GET,
  },
  {
    url: capsuleUrl,
    method: RequestHttpEnum.GET,
  },
  {
    url: wordCloudUrl,
    method: RequestHttpEnum.GET,
  },
  {
    url: treemapUrl,
    method: RequestHttpEnum.GET,
  },
  {
    url: threeEarth01Url,
    method: RequestHttpEnum.GET,
  },
];

export default mockObject;
