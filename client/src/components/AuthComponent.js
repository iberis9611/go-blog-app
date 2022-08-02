// 1.判断token是否存在
// 2.如果不存在 直接正常渲染
// 3.不存在 不渲染

// 高阶组件：将一个组件作为另一个组件的参数传入，而后通过一定的判断，返回新的组件
import { Navigate } from 'react-router-dom'
import { message } from "antd"
import { getToken } from "@/utils"

// children是一个默认组件，只要是组件内部的任何东西都是chidren
// 校验用户是否已登录，已登录则显示子组件
function AuthComponent ({children}) {
    const hasToken = getToken()

    // 有token返回子组件，没有重定向组件
    if (hasToken) {
        return <>{children}</>
    } else {
        return (
            message.warning('请先登录！'),
            <Navigate to={'/login'} replace />
        )
    }

}

export {
    AuthComponent
}