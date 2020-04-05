import { Tooltip, Tag } from 'antd';
import { QuestionCircleOutlined, BlockOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { connect, ConnectProps } from 'umi';
import { ConnectState } from '@/models/connect';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
import styles from './index.less';
import CategoryForm from '../CategoryForm';

export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  theme?: SiderTheme;
  layout: 'sidemenu' | 'topmenu';
}

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = (props) => {
  const [categoryModalVisible, handleCategoryModalVisible] = useState<boolean>(false);
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
      // onSearch={value => {
      //   //console.log('input', value);
      // }}
      />
      <Tooltip title="更新分类">
        <BlockOutlined className={styles.action}
          onClick={() => handleCategoryModalVisible(true)} />
      </Tooltip>
      <Avatar />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
      <SelectLang className={styles.action} />
      {categoryModalVisible ? (
        <CategoryForm
          onClose={() => {
            handleCategoryModalVisible(false);
          }}
          categoryModalVisible={categoryModalVisible}
        />
      ) : null}
    </div>
  );
};

export default connect(({ settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
