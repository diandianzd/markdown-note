import React, { useState, useEffect } from 'react';
import { Row, Col, Menu, Input, Cascader, Button, message, Pagination } from 'antd';
import ToastUi from '@/components/ToastUi';
import { DeleteOutlined, SaveOutlined, PlusOutlined, EllipsisOutlined, SwapOutlined } from '@ant-design/icons';
import { fetchList, fetchArticle, createArticle } from '@/services/articles';
import classnames from 'classnames'
import { getCategories } from '@/utils/note';
import styles from './index.less';

interface Article {
    title?: string
    content?: string
    initialContent?: string
    id?: number
    category?: number | string
    categories?: Array<string>
    status?: string
    changed?: boolean
}

export default (props: any): React.ReactNode => {

    const [collapsed, setCollapsed] = useState(false)
    const [article, setArticle] = useState<Article>({})
    const [postList, setPostList] = useState<Array<any>>([])
    const [postListCount, setPostListCount] = useState(0)
    const [postListCurrent, setPostListCurrent] = useState(1)
    const { pathname } = props.location
    const { currentCat = pathname === '/search' ? undefined : -1, content: searchContent = '' } = props.location && props.location.state || {}
    const { catgoryData, menuList } = props


    /**
     * 添加文章
     */
    const handleNew = (isNew: boolean = false): any => {

        const categories = getCategories(currentCat, [], menuList || [])
        const category = categories.length > 0 ? categories[categories.length - 1] : -1
        const newArticle = { categories, category, initialContent: '', content: '', changed: false, }

        if (isNew) {
            const hasUnSaved = postList.find(article => !article.id)
            if (hasUnSaved) {
                return message.error('有未保存的文章', 1)
            }
            setPostList([
                newArticle,
                ...postList
            ])
        }
        setArticle(newArticle)

    }
    /**
    * 获取文章
    * @param postId 
    */
    const handleArticle = (postId: number): void => {
        // 存在新创建的文章
        if (!postId) {
            handleNew(false)
            return
        }
        fetchArticle(postId).then(res => {
            const article = res.data
            const categories = getCategories(article.category, [], menuList || [])
            setArticle({
                ...article,
                categories,
                initialContent: article.content,
                changed: false,
            })
        })
    }
    /**
     * 更新文章内容
     * @param content 
     */
    const handleSetArticle = (keyName: string, val: string | Array<string>): void => {
        const newData = {
            ...article,
            [keyName]: val,
            changed: true,
        }
        if (keyName === 'categories') {
            newData.category = val[val.length - 1]
        }
        if (keyName === 'content' && newData.content === newData.initialContent) {
            newData.changed = false
        }
        setArticle(newData)
    }
    /**
     * 获取文章列表
     * @param categoryId 
     */
    const fetchPostList = (category: number | null, content: string = '', page = 1) => {

        setPostListCurrent(page)

        fetchList({ category, content, page }).then(res => {
            const { total, list } = res.data
            setPostListCount(total)
            setPostList(list)
        })

    }

    /**
     * 分页列表
     */
    const handlePagination = (page: number) => {
        fetchPostList(currentCat, searchContent, page)
    }
    //  发布
    const handlePublish = () => {
        const { id = null, title, content, category } = article
        createArticle({
            id, title, content, category
        }).then(res => {
            setArticle({
                ...article,
                id: res.data.id,
                initialContent: article.content,
                changed: false,
            })
        })
    }

    const toggleCollapsed = () => {
        setCollapsed(!collapsed)
    };

    useEffect(() => {
        // Update the document title using the browser API
        fetchPostList(currentCat, searchContent)
    }, [currentCat, searchContent]);

    return (
        <Row className={styles.articleWrap}>
            <Col>
                <Menu
                    className={classnames('articleMenu', styles.articleMenu)}
                    defaultSelectedKeys={['n']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    inlineCollapsed={collapsed}
                >
                    <Menu.Item key="-n" >
                        <SwapOutlined onClick={toggleCollapsed} className='collapsedBtn' />
                        <span onClick={() => handleNew(true)}><PlusOutlined />添加页</span>
                    </Menu.Item>

                    {
                        postList.map(postDesc => {
                            return (
                                <Menu.Item title={postDesc.title} key={postDesc.id || -1}
                                    onClick={() => { handleArticle(postDesc.id) }}>
                                    {postDesc.title || '未命名'}
                                </Menu.Item>
                            )
                        })
                    }

                    <Pagination className={styles.articlePagination}
                        simple hideOnSinglePage
                        defaultPageSize={15}
                        current={postListCurrent}
                        onChange={handlePagination}
                        defaultCurrent={1} total={postListCount} />


                </Menu>
            </Col>
            <Col flex="auto">
                <div className={styles.articleInner}>
                    <div className={styles.formHeader}>
                        <Input value={article.title} title={article.title} className={styles.formHeaderInput} placeholder="标题"
                            onChange={(e: any) => handleSetArticle('title', e.target.value)} />
                        <Cascader options={catgoryData} expandTrigger="hover" placeholder="分类" changeOnSelect
                            value={article.categories}
                            onChange={val => handleSetArticle('categories', val)} />
                        <Button type="primary" disabled={!article.changed} icon={<SaveOutlined />}
                            onClick={() => handlePublish()} />
                        <Button type="dashed" icon={<DeleteOutlined />} />
                    </div>
                    <div>
                        <ToastUi
                            initialValue={article.initialContent}
                            value={article.content}
                            onChange={(val: string) => handleSetArticle('content', val)}
                            height='calc(100vh - 80px)'
                        />
                    </div>
                </div>
            </Col>
        </Row>
    );
}