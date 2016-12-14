<template>
    <div id="container">
        <cell title="更换头像" id="pickfiles">
            <img style="height:40px;width:40px;" :src="downImg.url" v-el:img @error='prePic'></img>
        </cell>
    </div>
</template>
<script>
import {
    Cell
} from 'vux/src/components';
import {
    bucket,
    downLoadUrl,
    getUpLoadTokenUrl,
} from './api.js';
export default {
	components:{
		Cell
	},
	data() {
		return{
			 downImg: {
                'url': ''
            },
            key: 'u/'+this.userInfo.id,
            imgList: {},
		}
	},
	route:{
		
	}
}
</script>
