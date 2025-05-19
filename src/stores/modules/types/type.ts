import type { RouteRecordRaw } from 'vue-router'
import type { CategoryObj } from '@/api/project/attr/type';

export interface UserState {
  token: string;
  menuRoutes: MenuItem[];
  username: string;
  avatar: string;
}

export interface MenuItem {
  path: string;
  component?: () => Promise<any> | any;
  name?: string;
  meta: {
    title: string;
    hidden?: boolean;
    icon?: string;
    // 其他可能的 meta 属性
  };
  children?: MenuItem[];
}

export interface CategoryState {
  c1Id: string | number;
  c2Id: string | number;
  c3Id: string | number;
  c1List: CategoryObj[];
  c2List: CategoryObj[];
  c3List: CategoryObj[];
}