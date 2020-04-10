import { Tooltip } from 'antd';
import { BlockOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { connect, ConnectProps, history } from 'umi';
import { ConnectState } from '@/models/connect';
import HeaderSearch from '../HeaderSearch';
import SettingDropdown from '../SettingDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  theme?: SiderTheme;
  layout: 'sidemenu' | 'topmenu';
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = (props) => {

  const { theme, layout } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="搜索文章"
        defaultValue=""
        options={[

        ]}
        onSearch={value => {
          history.replace({
            pathname: '/search',
            state: {
              currentCat: null,
              content: value
            },
          });
        }}
      />
      <Tooltip title="">
        <BlockOutlined className={styles.action} onClick={() => {
          history.replace({
            pathname: '/welcome',
          })
        }} />
      </Tooltip>
      <SettingDropdown className={styles.action} />

    </div>
  );
};

export default connect(({ settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
