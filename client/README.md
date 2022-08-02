#### 预先设置
# 1 删除多余的文件和代码
# 2 安装依赖：sass样式，ant design组件，react-router-dom路由
yarn add sass -D
yarn add antd
yarn add react-router-dom
# 3 创建目录
# 4 配置一级路由
## a 生成Layout, Login目录
## b 写好各个页面中的index.js骨架：
function Layout() {
    return (
        <div>
            Layout
        </div>
    )
}

export default Layout
## c 在App.js中进行路由配置
### c1 导入组件
import {BrowserRouter, Routes, Route} from 'react-router-dom'
### c2
用BrowserRouter将根组件包起来，整个路由才能生效。
Routes是路由出口，在里面创建路由path和组件的对应关系。
使用Route配置一级路由如下：
<Route path='/' element={<Layout />}></Route>
<Route path='/login' element={<Login />}></Route>

# 5 ant design的使用
## a 先导入antd样式文件
import 'antd/dist/antd.min.css'; 导入至index.js
## b 再导入全局样式文件，防止样式覆盖
import './index.scss';
## c 测试：
在根组件中import { Button } from 'antd';
在div中粘贴Button组件进行测试
<Button type="primary">Primary Button</Button>

# 6 配置别名路径
a 安装修改CRA配置的包 yarn add -D @craco/craco
b 在根目录中创建craco的配置文件：craco.config.js，并在配置文件中配置路径别名
c 修改 package.json 中的脚本命令
d 在代码中，就可以通过 @ 来表示 src 目录的绝对路径
e 重启项目，让配置生效
代码实现

craco.config.js

const path = require('path')

module.exports = {
  // webpack 配置
  webpack: {
    // 配置别名
    alias: {
      // 约定：使用 @ 表示 src 文件所在路径
      '@': path.resolve(__dirname, 'src')
    }
  }
}
package.json

// 将 start/build/test 三个命令修改为 craco 方式
"scripts": {
  "start": "craco start",
  "build": "craco build",
  "test": "craco test",
  "eject": "react-scripts eject"
}

# 7 @别名路径提示:能够让vscode识别@路径并给出路径提示
## a 在项目根目录创建 jsconfig.json 配置文件
## b 在配置文件中添加以下配置
代码实现

{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
vscode会自动读取jsconfig.json 中的配置，让vscode知道@就是src目录

# 8 安装dev-tools调试工具
在浏览器extention中搜索React Developer Tools并安装

#### Layout模块
# 1 结构搭建
# 2 配置二级路由
Home Category Trending Article Message
## a 新建各个二级路由的目录、index.js和index.scss文件
## b 在App.js的Layout一级目录中配置二级路由：
  <Route path='/' element={<MyLayout />}>
    <Route index element={<Home />}></Route>
    <Route path='category' element={<Category />}></Route>
    <Route path='trending' element={<Trending />}></Route>
    <Route path='article' element={<Article />}></Route>
    <Route path='message' element={<Message />}></Route>
  </Route>

## c 在Layout的index.js中配置出口
### i 导入Outlet： import { Outlet } from "react-router-dom"
### ii 
<Content>
                {/* 二级路由出口 */}
                <Outlet />
            </Content>

# 3 axios统一封装管理
## a 安装axios： yarn add axios
## b 在utils中封装axios
1.导入依赖：import axios from 'axios'
2.获得一个http实例对象
3.配置请求拦截器（这里将来会配置token注入）
4.配置相应拦截器
5.导出http方法
## ## 注意：utils目录下会包含很多工具方法，这些方法由utils/index.js统一管理
1.先将所有工具函数导出的模块在这里导入
import { http } from "./http"
2.再统一导出
export {
    http
}
这样做的好处是，之后在其他目录下导入utils内的方法函数，直接import {http} from '@/utils'即可，不需要继续往下写。
# 4 使用Link组件，路由跳转配置
## a import { Link } from "react-router-dom"
## b 用<Link></Link>包裹文本
# 5 配置个人信息查看页
## a import {Drawer} from 'antd'
## b 配置Drawer组件
## c 为avatar和username添加onclick={showDrawer}
# 6 展示用户信息
## a 在store下船舰user.Store.js
## b 写框架
import {makeAutoObservable} from 'mobx'
import {http} from '@/utils'

class UserStore {
    userInfo = {}
    constructor() {
        makeAutoObservable(this)
    }
    getUserInfo = () => {
        // 调用接口获取数据
    }
}

export default UserStore
## c 在index.js里导出
## d 通过接口调用信息
useEffect(() => {
        userStore.getUserInfo()
    }, [userStore])
## e 检查是否成功调用
1.在network里查看是否接收到数据
2.在ReactComponent里看MyLayout-store-userStore里是否存储了数据
## f 在对应地方使用数据
{userStore.userInfo.nickname}
## g 刷新后数据回来，但是没有显示。因为第一次渲染是空的，没有对数据进行渲染，所以需要重新连接
import {observer} from 'mobx-react-lite'
export default observer(MyLayout)
# h 退出
使用对话框确认是否退出
# i 处理token实效

#### Login模块
# 1 搭建静态结构
# 2 搭建Form结构
# 3 实现表单校验
# 4 基于mobx封装管理用户的store
## a 安装核心包mobx和用于连接mobx和react的中间件mobx-react-lite
yarn add mobx mobx-react-lite
## b 写LoginStore组件
## c 通过store/index.js对所有模块进行统一处理，然后导出统一的方法——useStore
## d 去业务组件中调用setToken函数
1 导入useStore：import {useStore} from '@/store'
2 从useStore中结构出loginStore：const {loginStore}= useStore
3 调用getToken方法，拿到token登录
4 导入import {useNavigate} from 'react-router-dom'
const navigate = useNavigate()
使用navigate('/')完成跳转逻辑
5 登陆成功的全局提示
# 5 Token持久化
1 在utils下新增token.js
2 编写存取删方法
3 在index.js导出
4 在login.Store中使用
setToken(this.token)
token = getToken() || ''
# 6 路由鉴权：判断本地是否有token。有，返回子组件，没有则重定向到登录页面
## a 在components目录下创建AuthRoute/index.js
## b 判断token是否存在
## c 如果不存在 直接正常渲染
## d 不存在 不渲染

### 文章详情页 Article
方法：
1 点赞 触发toggleLike
2 点踩 触发toggleDisLike
3 评论
4 收藏
5 关注
6 发私信

## publish article

富文本编辑器
yarn add react-quill