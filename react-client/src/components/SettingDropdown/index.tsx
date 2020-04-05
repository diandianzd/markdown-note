import { GlobalOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';

interface SettingDropdownProps {
  className?: string;
  dispatch?: any;
}

const SettingDropdown: React.FC<SettingDropdownProps> = (props) => {
  const { className } = props;
  const onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      console.log('s')
      const { dispatch } = props;
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }
      return;
    }
  };

  const settingMenu = (
    <Menu className={styles.menu} onClick={onMenuClick}>
      <Menu.Item key="logout">
        <LogoutOutlined />
          退出登录
        </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={settingMenu} placement="bottomRight">
      <span className={classNames(styles.dropDown, className)}>
        <SettingOutlined title="设置"/>
      </span>
    </HeaderDropdown>
  );
};
export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(SettingDropdown);
