import { getMenuData } from '@/services/menu'; // 通过后台返回特定的数组json或者mock模拟数据

import { Reducer, Effect } from 'umi';
import { getCatRoutes, deepClone, getCatChildren } from '@/utils/note';


export interface MenuModelState {
    [x: string]: any;
    menuData: any[]
    categoryData: any[]
}

export interface MenuModelType {
    namespace: 'menu';
    state: MenuModelState;
    effects: {
        getMenuData: Effect;
    };
    reducers: {
        save: Reducer<MenuModelState>;
    };
}

const MenuModel: MenuModelType = {
    namespace: 'menu',
    state: {
        menuData: [],
        categoryData: [],
    },
    effects: {
        *getMenuData(_, { call, put }) {
            const response = yield call(getMenuData);
            const menuList = deepClone(response.data || []);
            const menuData = getCatRoutes(deepClone(response.data || []), 0);
            const categoryData = getCatChildren(deepClone(response.data || []), 0);
            yield put({
                type: 'save',
                payload: [menuList, menuData, categoryData],
            });
        },
    },

    reducers: {
        save(state, action) {
            const [menuList, menuData, categoryData] = action.payload
            return {
                ...state,
                menuList: menuList || [],
                menuData: menuData || [],
                categoryData: categoryData || [],
            };
        },
    },
};
export default MenuModel;
