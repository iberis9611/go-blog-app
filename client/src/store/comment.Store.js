// 获取所有评论的点赞状态
import { makeAutoObservable, runInAction } from 'mobx'
import { http } from '@/utils'

// 查询同一个aid下所有的评论
// SELECT * FROM likes WHERE item_id IN(SELECT cid FROM comments 
// WHERE delete_at = 0 AND article_aid = 'art-f027a570-6084-40d9-8412-aa860aae6faa');
class CommentStore {
    // 1 定义数据
    commentlist = []

    constructor() {
        // 2 数据响应式处理
        makeAutoObservable(this)
    }

    // 3 定义action函数
    
    // a 获取评论列表
    getComment = async ({aid}) => { // 这里是从前端解构过来的aid
        // 调接口，GET里面的参数名称要和后端保持一致
        const res = await http.get(`/comments?aid=${aid}`)

        runInAction(() => {
            // 存数据
            this.commentlist = res.data
        })
    }

    // b 添加评论
    postComment = async ({comment_content, sent_from, sent_to,article_aid}) => {
        await http.post('/comments/add',{
            comment_content,
            sent_from,
            sent_to,
            article_aid,
        })
    }

    // c 删除评论
    deleteComment = async ({cid}) => {
        await http.post(`/comments/del?cid=${cid}`)

    }

    // d 给评论点赞
    likeComment = async ({item_id}) => {
        await http.post(`/like/thumbUp?item_id=${item_id}`)
    }

    // e 给评论点踩
    dislikeComment = async ({item_id}) => {
        await http.post(`/like/thumbDown?item_id=${item_id}`)
    }
    
}

export default CommentStore