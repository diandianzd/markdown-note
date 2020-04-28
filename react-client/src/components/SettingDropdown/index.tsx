import { LogoutOutlined, SettingOutlined, BlockOutlined, DeleteOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React, { useState } from 'react';
import classNames from 'classnames';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { history } from '@@/core/history';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import CategoryForm from '../CategoryForm';


interface SettingDropdownProps {
  className?: string;
  dispatch?: any;
}

const SettingDropdown: React.FC<SettingDropdownProps> = (props) => {
  const { className } = props;
  const [categoryModalVisible, handleCategoryModalVisible] = useState<boolean>(false);

  const onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = props;
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }
      return;
    }
    if (key === 'category') {
      handleCategoryModalVisible(true);
    }
    if (key === 'recycle-bin') {
      history.push({
        pathname: '/recycle-bin',
      });
    }
  };

  const settingMenu = (
    <Menu className={styles.menu} onClick={onMenuClick}>
      <Menu.Item key="logout">
        <LogoutOutlined/>
        退出登录
      </Menu.Item>
      <Menu.Item key="category">
        <BlockOutlined/>
        配置分类
      </Menu.Item>
      <Menu.Item key="recycle-bin">
        <DeleteOutlined/>
        回收站
      </Menu.Item>

    </Menu>
  );
  return (
    <>
      <HeaderDropdown overlay={settingMenu} placement="bottomRight">
        <span className={classNames(styles.dropDown, className)}>
          <SettingOutlined title="设置"/>
        </span>
      </HeaderDropdown>
      {categoryModalVisible ? (
        <CategoryForm
          onClose={() => {
            handleCategoryModalVisible(false);
          }}
          categoryModalVisible={categoryModalVisible}
        />
      ) : null}
    </>
  );
};
export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(SettingDropdown);
