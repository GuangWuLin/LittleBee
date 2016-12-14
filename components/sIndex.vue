<template>
    <div class="pPage">
        <div class="home-top">
            <x-header :left-options="{showBack: false}" style="background:#f95377">
                <p class="sindex">{{sTitle}}</p>
                <div class="left" @click="back"></div>
                <div></div>
            </x-header>
        </div>
        <div class="aContainer">
            <div class="rout">
                <router-view ></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import {
    XHeader
} from 'vux/src/components';
export default {
    components: {
        XHeader
    },
    data(){
    	return{
    		sTitle:''
    	}
    },
    route:{
    	data(t){
    		switch (this.$route.name){
    			case 'userSetting':
    				this.sTitle = "设置";
    				break;
    			/*case 'picture':
    				this.gTitle = "更换头像";
    				break;*/
    		}
    	}
    },
    methods:{
    	back() {
            window.history.back(-1);
        }
    }
}
</script>
<style scoped>
.pPage {
    display: flex;
    flex-flow: column;
    height: 100%;
    width: 100%;
}
.sindex{
    font-size: 2rem;
    font-weight: bold;
}
.aContainer {
    display: flex;
    /*指定主轴的伸缩流方向是纵向的*/
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
}

.left {
    position: absolute;
    top: 1rem;
    left: 1.4rem;
    width: 1rem;
    height: 2rem;
    background: url('../assets/back@1x_0.png') no-repeat;
}
</style>
