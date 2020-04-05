import React, { useState, useEffect } from 'react';
import { Row, Col, Menu, Input, Cascader, Button } from 'antd';
import styles from './index.less';
import ToastUi from '@/components/ToastUi';
import { DeleteOutlined, SaveOutlined, PlusOutlined, RetweetOutlined } from '@ant-design/icons';
import { fetchList, fetchArticle, createArticle } from '@/services/articles';
import classnames from 'classnames'
import { getCategories } from '@/utils/note';

interface Article {
    title?: string
    content?: string
    id?: number
    category?: number | string
    categories?: Array<string>
    status?: string
}

export default (props: any): React.ReactNode => {

    const [collapsed, setCollapsed] = useState(false)
    const [article, setArticle] = useState<Article>({})
    const [postList, setPostList] = useState<Array<any>>([])
    const { currentCat = -1 } = props.location && props.location.state || {}
    const { catgoryData, menuList } = props

    /**
     * 获取文章
     * @param postId 
     */
    const handleArticle = (postId: number): void => {
        if (!postId) return
        fetchArticle(postId).then(res => {
            const article = res.data
            const categories = getCategories(article.category, [], menuList || [])
            setArticle({
                ...article,
                categories
            })
        })
    }
    /**
     * 添加文章
     */
    const handleNew = () => {
        const categories = getCategories(currentCat, [], menuList || [])
        const newArticle = { categories }
        setArticle(newArticle)
        setPostList([
            newArticle,
            ...postList
        ])
    }
    /**
     * 更新文章内容
     * @param content 
     */
    const handleSetArticle = (keyName: string, val: string | Array<string>): void => {
        const newData = {
            ...article,
            [keyName]: val
        }
        if (keyName === 'categories') {
            newData.category = val[val.length - 1]
        }
        setArticle(newData)
    }
    /**
     * 获取文章列表
     * @param categoryId 
     */
    const fetchPostList = (categoryId: number) => {
        fetchList({ category: categoryId }).then(res => {
            const { total, list } = res.data
            setPostList(list)
        })

    }
    //  发布
    const handlePublish = () => {
        const { id = null, title, content, category } = article
        createArticle({
            id, title, content, category
        }).then(res => {
            setArticle({
                ...article,
                id: res.data.id
            })
        })
    }

    const toggleCollapsed = () => {
        setCollapsed(!collapsed)
    };

    useEffect(() => {
        // Update the document title using the browser API
        fetchPostList(currentCat)
    }, [currentCat]);

    return (
        <Row className={styles.articleWrap}>
            <Col>
                <Menu
                    className={classnames('articleMenu', styles.articleMenu)}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    inlineCollapsed={collapsed}
                >
                    <Menu.Item key="-1" >
                        <RetweetOutlined onClick={toggleCollapsed} className='collapsedBtn' />
                        <span onClick={handleNew}><PlusOutlined />添加页</span>
                    </Menu.Item>
                    {
                        postList.map(postDesc => {
                            return (
                                <Menu.Item key={postDesc.id || -1} onClick={() => { handleArticle(postDesc.id) }}>{postDesc.title}</Menu.Item>
                            )
                        })
                    }
                </Menu>
            </Col>
            <Col flex="auto">
                <div className={styles.articleInner}>
                    <div className={styles.formHeader}>
                        <Input value={article.title} className={styles.formHeaderInput} placeholder="标题"
                            onChange={(e: any) => handleSetArticle('title', e.target.value)} />
                        <Cascader options={catgoryData} expandTrigger="hover" placeholder="分类" changeOnSelect
                            value={article.categories}
                            onChange={val => handleSetArticle('categories', val)} />
                        <Button type="primary" icon={<SaveOutlined />} onClick={() => handlePublish()} />
                        <Button type="dashed" icon={<DeleteOutlined />} />
                    </div>
                    <div>
                        <ToastUi
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