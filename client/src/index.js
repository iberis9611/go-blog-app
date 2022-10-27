import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// 导入ant design样式文件
import 'antd/dist/antd.min.css';
// 导入全局样式文件index.scss
import './index.scss';
import { ConfigProvider } from 'antd'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  // <React.StrictMode>
    <ConfigProvider locale={locale}>
      <App />
    </ConfigProvider>
  // </React.StrictMode>
)
