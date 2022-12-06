import { Scrollbars } from 'react-custom-scrollbars';

const ScollBar = (prop) => {
  const { height } = prop || {};

  const styles = { height: height || '100%' };
  //设置滚动条的样式
  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      width: '6px',
      backgroundColor: '#404043',
      borderRadius: '6px',
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} className="scroll-bar" />;
  };
  return (
    <Scrollbars renderThumbVertical={renderThumb} style={styles}>
      {prop.children}
    </Scrollbars>
  );
};

export default ScollBar;
