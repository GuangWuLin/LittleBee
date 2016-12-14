import Vue from 'vue'
import Vuex from 'vuex'

// 告诉 vue “使用” vuex
Vue.use(Vuex)

// 创建一个对象来保存应用启动时的初始状态
const state = {
    // TODO: 放置初始状态
    userInfo: {},
    gardens: {},
    slectgardens:{},
    showLoading:false,
    showError:false,
    teacherUser:{},
    gardenInfo:[],
    mark:'',
    name:'',
    address:'',
    class_id:'',
    distance:{},
    sign:{}

}

// 创建一个对象存储一系列我们接下来要写的 mutation 函数
const mutations = {

    // TODO: 放置我们的状态变更函数
    OPEN_LOADING(state,info) {
        state.userInfo = info;
        // console.log(info)
    },
  
    SHOW_ERROR(state){
        state.showError = true;
    },
    TO_SIGN(state,sign){
        state.sign = sign;
        console.log(state.sign)
    },
    LOADING(state){
        state.showLoading = true;
    },
    LOADED(state){
        state.showLoading = false;
    },
    CLOSE_LOADING(state) {
        state.userInfo = {};

    },
    SET_INTEGRAL(state, num){
        state.userInfo.integral = parseInt(state.userInfo.integral*1+num);
    },
    OPEN_NEWS(state){
        state.userInfo.marknews = 0;
    },
    CLOSE_NEWS(state){
        state.userInfo.marknews = 1;
    },
    TEACHER_USER(state,info){
        state.teacherUser = info;
    },
    GARDEN_INFO(state,info,str){
        state.gardenInfo = info;
        state.mark = str;
    },
    NAME(state,info){
        state.name = info;
    },
    ADDRESS(state,info){
        state.address = info;
    },
    CLASS_ID(state,info){
        state.class_id = info;
    },
    DISTANCE(state,info){
        state.distance = info;
    },
      GARDENS(state,info) {
        state.gardens = info;
    },
    SELECTGARDENS(state,info) {
        state.slectgardens = info;
    }

}

// 整合初始状态和变更函数，我们就得到了我们所需的 store
// 至此，这个 store 就可以连接到我们的应用中
export default new Vuex.Store({
    state,
    mutations
});
