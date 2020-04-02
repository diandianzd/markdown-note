import React, { useState, useEffect } from 'react';
import { Row, Col, Menu, Input, Cascader, Button, notification } from 'antd';
import styles from './index.less';
import ToastUi from '@/components/ToastUi';
import { DeleteOutlined, SaveOutlined, PlusOutlined } from '@ant-design/icons';
import { fetchList, fetchArticle, createArticle } from '@/services/articles';
const options = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
            {
                value: 'hangzhou',
                label: 'Hanzhou',
                children: [
                    {
                        value: 'xihu',
                        label: 'West Lake',
                    },
                ],
            },
        ],
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                    {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua Men',
                    },
                ],
            },
        ],
    },
];

interface Article {
    title?: string
    content?: string
    id?: number
    category?: number
    status?: string
}

export default (props: any): React.ReactNode => {

    const [article, setArticle] = useState<Article>({})
    const [postList, setPostList] = useState<Array<any>>([])
    const { currentCat } = props.location.state

    /**
     * 获取文章
     * @param postId 
     */
    const handleArticle = (postId: number): void => {
        fetchArticle(postId).then(res => {
            setArticle(res.data)
        })
    }
    /**
     * 更新文章内容
     * @param content 
     */
    const handleSetArticle = (keyName: string, val: string): void => {
        setArticle({
            ...article,
            [keyName]: val
        })
    }
    /**
     * 获取文章列表
     * @param categoryId 
     */
    const fetchPostList = (categoryId: number) => {
        fetchList({ categories: [categoryId] }).then(res => {
            const { total, list } = res.data
            setPostList(list)
        })
    }
    const handlePublish = () => {
        const { id = null, title, content, category } = article
        createArticle({
            id, title, content, category
        }).then(res => {
            notification.success({
                message: '更新成功',
            });
        })
    }

    useEffect(() => {
        // Update the document title using the browser API
        fetchPostList(currentCat)
    }, [currentCat]);

    return (
        <Row>
            <Col flex="240px">
                <Menu
                    className={styles.articleTab}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                >
                    <Menu.Item key="-1"><PlusOutlined />添加页</Menu.Item>
                    {
                        postList.map(postDesc => {
                            return (
                                <Menu.Item key={postDesc.id} onClick={() => { handleArticle(postDesc.id) }}>{postDesc.title}</Menu.Item>
                            )
                        })
                    }
                </Menu>
            </Col>
            <Col flex="auto">
                <div className={styles.article}>
                    <div className={styles.formHeader}>
                        <Input value={article.title} className={styles.formHeaderInput} placeholder="标题"
                            onChange={(e: any) => handleSetArticle('title', e.target.value)} />
                        <Cascader options={options} expandTrigger="hover" placeholder="分类" changeOnSelect />
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
