import { getMenuData } from '@/services/menu'; // 通过后台返回特定的数组json或者mock模拟数据

import { Reducer, Effect } from 'umi';
import { getCatRoutes } from '@/utils/note';


export interface MenuModelState {
    menuData: any[];
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
    },
    effects: {
        *getMenuData(_, { call, put }) {
            const response = yield call(getMenuData);
            const menuData = getCatRoutes(response.data, 0);

            yield put({
                type: 'save',
                payload: menuData,
            });
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                menuData: action.payload || [],
            };
        },
    },
};
export default MenuModel;