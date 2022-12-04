import ChartDataMatchingAndShow from '../ChartDataMatchingAndShow';

const ChartDataStatic: React.FC = () => {
  return (
    <div className="ithings-chart-configurations-data-static">
      <ChartDataMatchingAndShow show={false} ajax={false} />
    </div>
  );
};
export default ChartDataStatic;
