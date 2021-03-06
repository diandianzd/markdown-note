import { DefaultFooter, MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, ConnectProps, connect } from 'umi';
import React from 'react';
import { ConnectState } from '@/models/connect';
import styles from './UserLayout.less';

export interface UserLayoutProps extends Partial<ConnectProps> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const UserLayout: React.FC<UserLayoutProps> = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container} style={{backgroundImage:`url('${process.env.PLATFORM === 'github'?'.':''}/svg/user-layout-bg.svg')`}}>
        <div className={styles.lang} />
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                {/* <img alt="logo" className={styles.logo} src={logo} /> */}
                <span className={styles.title}>Markdown note</span>
              </Link>
            </div>
            <div className={styles.desc}>记录精彩</div>
          </div>
          {children}
        </div>
        <DefaultFooter
          links={[]}
          copyright="2020 diandianzd"
        />
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
