import { Skeleton } from 'antd';
import './styles.less';

const IthingsSkeleton: React.FC<{ repeat: number; load: boolean }> = ({ repeat, load }) => {
  return (
    <>
      {load && (
        <div className="ithings-skeleton">
          {repeat == 1 && (
            <>
              <Skeleton className="item" />
            </>
          )}
          {repeat == 2 && (
            <>
              <Skeleton className="item" />
              <Skeleton className="item" />
            </>
          )}
          {repeat == 3 && (
            <>
              <Skeleton className="item" />
              <Skeleton className="item" />
              <Skeleton className="item" />
            </>
          )}
        </div>
      )}
    </>
  );
};
export default IthingsSkeleton;
