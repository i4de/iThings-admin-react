import { Scrollbars } from 'react-custom-scrollbars';

const ScollBar = (prop) => {
  //设置滚动条的样式
  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      width: '6px',
      backgroundColor: '#404043',
      borderRadius: '6px',
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} className="scroll-bar" />;
  };
  return <Scrollbars renderThumbVertical={renderThumb}>{prop.children}</Scrollbars>;
};

export default ScollBar;
