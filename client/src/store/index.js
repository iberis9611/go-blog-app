// 通过store/index.js对所有模块进行统一处理，然后导出统一的方法——useStore
import React from "react"
import LoginStore from "./login.Store"
import UserStore from "./user.Store"
import CommentStore from "./comment.Store"
import ArticleStore from "./article.Store"
import RegisterStore
 from "./register.Store"
class RootStore {
    constructor() {
        this.loginStore = new LoginStore()
        this.userStore = new UserStore()
        this.commentStore = new CommentStore()
        this.articleStore = new ArticleStore()
        this.registerStore = new RegisterStore()
    }
}

const rootStore = new RootStore()   // 实例化根
const context = React.createContext(rootStore)  // 注入context
const useStore = () => React.useContext(context) // 导出通用方法

// 导出useStore
export {useStore}