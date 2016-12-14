import Vue from 'vue' //引入vue
import App from './App' //引入根组件
import resource from 'vue-resource'
import Router from 'vue-router' //引入vue-router
// import Vuex from 'vuex'
import '../static/v-scroll.js'
//import routerMap from './router' //引入路由表
// import VueKeepScroll from 'vue-keep-scroll'

Vue.use(resource);
Vue.use(Router); //声明使用vue-router
// Vue.use(VueKeepScroll);
Vue.http.options.emulateJSON = true;
Vue.http.options.emulateHTTP = true;

Vue.http.interceptors.push((request, next) => {
    App.store.dispatch('LOADING')
    // console.log('Loading~~!');
    next((response) => {
        App.store.dispatch('LOADED')
        // console.log('Loaded~!');
        return false;
    });
});


/*router.start(App,'#root') //开启应用
 */
/* eslint-disable no-new */

const router = new Router() //创建 路由

router.map({
    '/register': {
        component(r) {
            require(['./components/register.vue'], r);
        },
        subRoutes: {
            '/login': {
                name: 'login',
                component(r) {
                    require(['./components/login.vue'], r);
                }
            },
            '/registerComponent': {
                name: 'registerComponent',
                component(r) {
                    require(['./components/registerComponent.vue'], r);
                }
            },
            '/pswBack': {
                name: 'pswBack',
                component(r) {
                    require(['./components/pswBack.vue'], r);
                }
            }

        }
    },
     '/sIndex': {
        name: 'sIndex',
        component(r) {
            require(['./components/sIndex.vue'], r);
        },
        subRoutes: {
            '/userSetting': {
                name: 'userSetting',
                component(r) {
                    require(['./components/userSetting.vue'], r);
                }
            },
           /* '/picture': {
                name: 'picture',
                component(r) {
                    require(['./components/picture.vue'], r);
                }
            }*/
        }
    },
    '/gIndex': {
        name: 'gIndex',
        component(r) {
            require(['./components/gIndex.vue'], r);
        },
        subRoutes: {
            '/examine/:id': {
                name: 'examine',
                component(r) {
                    require(['./components/examine.vue'], r);
                }
            },
            '/gAction': {
                name: 'gAction',
                component(r) {
                    require(['./components/gAction.vue'], r);
                }
            },
            '/photo': {
                name: 'photo',
                component(r) {
                    require(['./components/photo.vue'], r);
                }
            },
            '/photos': {
                name: 'photos',
                component(r) {
                    require(['./components/photos.vue'], r);
                }
            },
            '/classMessage': {
                name: 'classMessage',
                component(r) {
                    require(['./components/classMessage.vue'], r);
                }
            },
            '/classAction': {
                name: 'classAction',
                component(r) {
                    require(['./components/classAction.vue'], r);
                }
            },
        }
    },
    '/': {
        component(r) {
            require(['./components/index.vue'], r);
        },
        subRoutes: {
            '/home': {
                name: 'home',
                component(r) {
                    require(['./components/home.vue'], r);
                }
            },
            /*'/calendar': {
                name: 'calendar',
                component(r) {
                    require(['./components/calendar.vue'], r);
                }
            },*/
            '/action': {
                name: 'action',
                component(r) {
                    require(['./components/action.vue'], r);
                }
            },
            '/around': {
                name: 'around',
                component(r) {
                    require(['./components/around.vue'], r);
                }
            },
            /*'/serchGarends': {
                name: 'serchGarends',
                component(r) {
                    require(['./components/serchGarends.vue'], r);
                }
            },*/
            'mybb': {
                name: 'mybb',
                component(r) {
                    require(['./components/mybb.vue'], r);
                }
            },
            'garden': {
                name: 'garden',
                component(r) {
                    require(['./components/garden.vue'], r);
                }
            },
            '/detail/:id': {
                name: 'detail',
                component(r) {
                    require(['./components/detail.vue'], r)
                }
            },
            '/commentDetails/:id': {
                name: 'commentDetails',
                component(r) {
                    require(['./components/commentDetails.vue'], r);
                }
            },
            '/actionDetail/:id': {
                name: 'actionDetail',
                component(r) {
                    require(['./components/actionDetail.vue'], r);
                }
            }

        }

    }
});

router.start(App, 'app');
