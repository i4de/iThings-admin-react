import AsyncLoading from '@/components/AsyncLoading';
import type { ReactNode } from 'react';
import { dynamic } from 'umi';

/**
 * * 异步加载组件
 * @param loader
 * @returns
 */
export const loadAsyncComponent = (loader: ReactNode) =>
  dynamic({
    loader,
    loading: () => AsyncLoading,
    delay: 20,
  });
