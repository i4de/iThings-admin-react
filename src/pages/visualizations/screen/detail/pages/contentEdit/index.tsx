// import SketchBoard from 'mb-sketch-ruler';
import SketchBoard from 'ray-sketch-board';

const ContentEdit: React.FC = () => {
  return (
    <div style={{ position: 'relative' }}>
      {/* <EditRule>
        <div id="chart-edit-content" style={{ width: '800px', height: '600px' }}></div>
      </EditRule> */}

      <div style={{ backgroundColor: '#18181c' }}>
        <div
          style={{
            borderRadius: '10px',
            margin: '0 25px',
            overflow: 'hidden',
            boxShadow: ' 0 8px 10px rgb(30 30 30 / 12%)',
          }}
        >
          <div
            style={{
              margin: '25px 0',
              width: '1920px',
              height: '1080px',
              transform: 'scale(0.7)',
              backgroundColor: '#232324',
              borderColor: '#373739',
              transition: ' all 0.4s',
              position: 'relative',
              transformOrigin: 'left top',
              backgroundSize: 'cover',
            }}
          >
            123
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: '0' }}>
        <SketchBoard
          thick={20}
          scale={0.5}
          width={1000}
          height={700}
          startX={-10}
          startY={-10}
          rulerOption={{
            bgColor: '#18181c',
            longfgColor: '#7f7f81',
            fontColor: '#7f7f81',
            shortfgColor: '#7f7f81',
          }}
        />
      </div>
    </div>
  );
};
export default ContentEdit;
