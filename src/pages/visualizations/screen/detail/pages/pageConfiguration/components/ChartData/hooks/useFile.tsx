import { FileTypeEnum } from '@/enums/fileTypeEnum';
import { useTargetData } from '@/pages/visualizations/screen/detail/pages/pageConfiguration/hooks/useTargetData';
import { downloadTextFile, readFile } from '@/utils/file';
import { message } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import { useRef } from 'react';
import { useDispatch } from 'umi';

export const useFile = () => {
  const setDispatch = useDispatch();
  const { selectTarget } = useTargetData();

  const uploadFileListRef = useRef([]);

  //@ts-ignore
  const beforeUpload = (file: RcFile) => {
    uploadFileListRef.current = [];
    const type = file.type;
    if (type !== FileTypeEnum.JSON && type !== FileTypeEnum.TXT) {
      message.warning('仅支持上传 【JSON】 格式文件，请重新上传！');
      return false;
    }
    return true;
  };

  // 自定义上传操作
  const customRequest: UploadProps['customRequest'] = (options) => {
    const { file } = options;
    if (file) {
      readFile(file).then((fileData: any) => {
        setDispatch({
          type: 'chartEditStore/setChartOption',
          payload: {
            k: 'dataset',
            v: JSON.parse(fileData),
          },
        });
      });
    } else {
      message.error('导入数据失败，请稍后重试或联系管理员！');
    }
  };

  // 下载文件
  const download = () => {
    try {
      message.success('下载中，请耐心等待...');
      downloadTextFile(JSON.stringify(selectTarget.option.dataset), undefined, 'json');
    } catch (error) {
      message.error('下载失败，数据错误！');
    }
  };
  return {
    uploadFileListRef,
    beforeUpload,
    customRequest,
    download,
  };
};
