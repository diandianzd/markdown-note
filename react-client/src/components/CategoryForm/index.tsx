import React, { useState, useEffect } from 'react';
import { Form, Button, Input, Modal, Cascader, Popconfirm } from 'antd';
import { PlusOutlined, MinusOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import './index.less'
import { ConnectState } from '@/models/connect';
import { connect } from 'umi';
import { getCategories } from '@/utils/note';
import { saveCategory, deleteCategory } from '@/services/categories';

export interface CategoryFormProps {
  onClose: (flag?: boolean) => void;
  categoryModalVisible: boolean;
  categoryData: Array<any>;
  menuList: Array<any>;
  dispatch: any;
  initcialCat?: number | string | any
}
interface Category {
  name?: string
  icon?: string
  id?: number | null
  parent_id?: number | string | null
  categories?: Array<string>
  status?: string
  parentCategories?: Array<string>
}
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};

const FormItem = Form.Item;

const CategoryForm: React.FC<CategoryFormProps> = (props) => {

  const [categoryDetail, setCategoryDetail] = useState<Category>({})
  const [form] = Form.useForm();

  const {
    onClose: handleUpdateModalVisible,
    categoryModalVisible,
    categoryData,
    menuList,
    dispatch,
    initcialCat,
  } = props;

  const fetchCategory = (categoryId: number | string | any) => {
    return menuList.find(item => item.id === categoryId) || {}
  }



  const handleSubmit = () => {
    saveCategory(categoryDetail).then(() => {
      dispatch({
        type: 'menu/getMenuData',
      });
      handleUpdateModalVisible()
    })
  }
  const handleDelete = () => {
    if (!categoryDetail.id) {
      return handleUpdateModalVisible()
    }
    deleteCategory(categoryDetail.id).then(() => {
      dispatch({
        type: 'menu/getMenuData',
      });
      handleUpdateModalVisible()
    })
    return null
  }

  /**
   * 设置分类内容
   * @param content
   */
  const handleSetCategory = (keyName: string, val: string | Array<string>): void => {
    let newData = {
      ...categoryDetail,
      [keyName]: val
    }
    if (keyName === 'category') {
      const categoryItem = fetchCategory(val)
      const categories = getCategories(val, [], menuList || [])
      const parentCategories = getCategories(categoryItem.parent_id, [], menuList || [])
      newData = {
        ...categoryItem,
        categories,
        parentCategories,
      }
    }

    if (keyName === 'categories') {
      const category = val[val.length - 1]
      const categoryItem = fetchCategory(category)
      const categories = val
      const parentCategories = getCategories(categoryItem.parent_id, [], menuList || [])
      newData = {
        ...categoryItem,
        categories,
        parentCategories,
      }
    }
    if (keyName === 'parentCategories') {
      const parent_id = val[val.length - 1]
      newData = {
        ...newData,
        parent_id,
      }
    }
    setCategoryDetail(newData)
  }

  const handleNew = () => {
    const { id, categories } = categoryDetail
    const newData = {
      name: '',
      parent_id: id || 0,
      icon: '',
      id: null,
      parentCategories: categories?.slice()
    }
    setCategoryDetail(newData)
  };

  useEffect(() => {
    // 加载分类信息
    handleSetCategory('category',initcialCat)
  }, [initcialCat]);


  const renderContent = () => {
    return (
      <>
        <FormItem name="icon" label="图标">
          <div>
            <Input placeholder="图标组件名称" value={categoryDetail.icon}
              onChange={(e: any) => handleSetCategory('icon', e.target.value)} />
          </div>
        </FormItem>
        <FormItem name="name" label="名称">
          <div style={{ display: 'flex' }}>
            <Input placeholder="请输入" value={categoryDetail.name}
              onChange={(e: any) => handleSetCategory('name', e.target.value)} />
            <Cascader options={categoryData} expandTrigger="hover" placeholder="选择" changeOnSelect
              value={categoryDetail.categories}
              onChange={val => handleSetCategory('categories', val)} />
          </div>
        </FormItem>
        <FormItem name="template" label="分类" >
          <div>
            <Cascader options={categoryData} expandTrigger="hover" placeholder="选择" changeOnSelect
              value={categoryDetail.parentCategories}
              onChange={val => handleSetCategory('parentCategories', val)} />
          </div>
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
    return (
      <>
        <Button shape="circle" icon={<CloseOutlined />}
          onClick={() => handleUpdateModalVisible(false)} />
        {!categoryDetail.id ? <Button disabled shape="circle" icon={<MinusOutlined />} /> :
          <Popconfirm
            className='button'
            placement="topRight"
            title="删除分类吗"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
            disabled={!categoryDetail.id}
          >
            <Button disabled={!categoryDetail.id} shape="circle" icon={<MinusOutlined />} />
          </Popconfirm>
        }


        <Button type="primary" shape="circle" icon={<PlusOutlined />}
          disabled={!categoryDetail.id}
          onClick={() => handleNew()} />
        <Button type="primary" shape="circle" icon={<CheckOutlined />}
          onClick={() => handleSubmit()} />
      </>
    );
  };

  return (
    <Modal
      width={460}
      bodyStyle={{ padding: '18px 10px 18px' }}
      destroyOnClose
      title="更新分类"
      visible={categoryModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Form {...formLayout} form={form}>
        {renderContent()}
      </Form>
    </Modal>
  );
};
export default connect(({ menu }: ConnectState) => ({
  categoryData: menu.categoryData,
  menuList: menu.menuList,
}))(CategoryForm);
