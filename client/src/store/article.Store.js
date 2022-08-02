import { http } from "@/utils"
import { makeAutoObservable, runInAction } from "mobx"

class ArticleStore {
    // 1 定义数据
    article = {}
    articleList = []

    constructor() {
        // 2 响应式处理
        makeAutoObservable(this)
    }

    // 3 定义action函数
    // 获取文章
    getArticle = async ({aid}) => {
        const res = await http.get(`/article/${aid}`)

        runInAction(() => {
            this.article = res.data
        })
    }

    // 赞文章
    likeArticle = async ({item_id}) => {
        await http.post(`/like/thumbUp?item_id=${item_id}`)
    }

    // 踩文章
    dislikeArticle = async ({item_id}) => {
        await http.post(`/like/thumbDown?item_id=${item_id}`)
    }

    // 收藏文章
    saveArticle = async({aid}) => {
        await http.post(`/article/clickSave?aid=${aid}`)
    }

    // 发布文章
    publishArticle = async ({title, content, cover}) => {
        await http.post('/publish',{title, content, cover})
    }

    // 获取文章列表
    getMyArticleList = async ({uuid}) => {
        const res = await http.get(`/userArticleList/${uuid}`)
        runInAction(()=>{
            this.articleList = res.data
            console.log(res.data)
        })
    } 

    // 修改文章
    modifyArticle = async ({aid, title, content, cover}) => {
        await http.post(`/publish?aid=${aid}`, {
            title, content, cover
        })
    }

    // 删除文章
    delArticle = async ({aids}) => {
        await http.post(`/deleteArticle?aids=${aids}`)
    }

    // 获取某人发布的文章
    getPublishedArticles = async({uuid}) => {
        const res = await http.get(`/articlePublished?uuid=${uuid}`)
        runInAction(()=>{
            this.articleList = res.data
        })
    }

    // 获取某人点赞的文章
    getLikedArticles = async({uuid}) => {
        const res = await http.get(`/articleLiked?uuid=${uuid}`)
        runInAction(()=>{
            this.articleList = res.data
        })
    }

    // 获取某人收藏的文章
    getSavedArticles = async({uuid}) => {
        const res = await http.get(`/articleSaved?uuid=${uuid}`)
        runInAction(()=>{
            this.articleList = res.data
        })
    }

}

export default ArticleStore