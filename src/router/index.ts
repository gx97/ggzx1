import { createRouter, createWebHashHistory } from 'vue-router';
import { constantRoute } from './routes';

let router = createRouter({
    history: createWebHashHistory(),
    routes: constantRoute,

    scrollBehavior() {
        return { top: 0, left: 0 }
    }
});

export default router;