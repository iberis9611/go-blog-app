import {BrowserRouter, Routes, Route} from 'react-router-dom'
import MyLayout from '@/pages/Layout'
import Trending from '@/pages/Trending'
import Message from '@/pages/Message'
import Register from '@/pages/Register'
import Setting from '@/pages/Setting'
import Article from '@/pages/Article'
import ModifyProfile from '@/pages/ModifyProfile'
import Profile from '@/pages/Profile'
import Publish from '@/pages/Publish'
import Published from '@/pages/Published'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import { AuthComponent } from '@/components'
import './App.scss'

function App() {

  return (
    // 路由配置
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* 创建路由path和组件的对应关系 */}
          {/* MyLayout这里要根据是否登录进行鉴权 */}
          <Route path='/' element={
            <AuthComponent>
                <MyLayout />
            </AuthComponent>
          }>
            <Route index element={<Home />}></Route>
            <Route path='trending' element={<Trending />}></Route>
            <Route path='article/:aid' element={<Article />}></Route>
            <Route path='publish' element={<Publish />}></Route>
            <Route path='published' element={<Published />}></Route>
            <Route path='setting' element={<Setting />}></Route>
            <Route path='profile/:uuid' element={<Profile />}></Route>
            <Route path='modify' element={<ModifyProfile />}></Route>
            <Route path='message' element={<Message />}></Route>
          </Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='register' element={<Register />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
