<template>
    <router-view></router-view>
    <!-- keep-alive -->
    <loading :show="show1"></loading>
</template>



<script type="text/javascript">
import store from './components/store.js';
import {
    Loading
} from 'vux/src/components';
export default {
    store,
    vuex: {
        getters: {
            show1: state => state.showLoading,
        }
    },
    components: {
        Loading
    }
}
</script>

<style>
@import '~vux/dist/vux.css';
</style>
