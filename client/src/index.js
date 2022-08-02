import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// 导入ant design样式文件
import 'antd/dist/antd.min.css';
// 导入全局样式文件index.scss
import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
