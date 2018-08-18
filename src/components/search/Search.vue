<template>
    <div class="search_mg">
        <div class="search_box style2 bgk">
            <div class="search">
                <table>
                    <tr>
                        <td>
                            <td class="search_btn">
                                <v-touch v-on:tap="search">
                                    <a id="searchbtn" class="search_img middleicon"></a>
                                </v-touch>
                            </td>
                            <div>
                                <input placeholder="搜索儿歌、故事等" v-model="searchText" @keypress.enter="search" @input="checkInput" @keyup="checkInput" onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\a-zA-Z0-9\u4E00-\u9FA5]/g,''))" maxlength=20/ ref="search_box">
                                <v-touch v-on:tap="clearInput"><span></span></v-touch>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="search_btn_txt" @click.stop="search">
               <span>搜索</span>
            </div>
        </div>
    </div>
</template>

<script>
 
export default {
    name: 'search',
    data() {
        return {
            searchText: '',
            hasText: false,
            focus:false
        }
    },
    created() {
        if(this.$store.state.keyword){
            this.searchText = this.$store.state.keyword
        }
    },
    activated(){
        console.log('this.focus:' + this.focus)
        if(this.focus){
            this.$refs.search_box.focus()
        }
        if(this.$store.state.keyword){
            this.searchText = this.$store.state.keyword
        }else{
            this.searchText = ''
        }
    },
    deactivated(){
        this.focus = false
    },
    methods: {
        //清空输入框
        clearInput:function(){
            this.searchText = ''
            this.hasText = false
        },
        search: function() {
            let kw = this.searchText
            if(kw.replace(/\s+/g,'') === ''){
                return
            }
            this.$store.state.keyword = this.searchText
            this.$router.push({path:'/searchresult',query:{'openid':this.$route.query.openid}});
        },
        checkInput(e) {
            this.$store.state.keyword = this.searchText
            this.hasText = true
            this.focus = true
            this.$emit("search",this.searchText)
        }
    }
}
</script>
<style scoped>
.search_box {
    padding: .5rem 1rem .5rem 1.3rem;
    /* height: 4.2rem; */
    z-index: 200;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    background-color: transparent;
}

.search {
    width: 81%;
    display: inline-block;
    border-color: #e5e5e5;
    background: #f0f0f0;
    border: 1px solid;
    border-radius: .8rem;
    position: relative;
    overflow: hidden;
    height: 4rem;
}

input {
    font-family: "Microsoft YaHei", Verdana, "sans-serif";
    font-size: 1.3rem;
    line-height: 1.5;
    color: #333;
    margin: 0;
    padding: 0;
    word-wrap: break-word;
    vertical-align: middle;
    outline: none
}

.search input {
    border: 0;
    -webkit-appearance: none;
    height: 3.5rem;
    float: left;
    font-size: 1.6rem;
    width: 100%;
    background-color: #f0f0f0;
    color: #333;
}

.search .click {
    background-color: #fd83b6;
}

.search .search_btn {
    width: 4rem;
}

.search .search_btn a {
    /* display: block;
    height: 3.6rem;
    width: 3.6rem;
    position: absolute;
    top: 0.2rem;
    right: 0.2rem;
    z-index: 1;
    border-radius: 1.9rem; */


    display: block;
    height: 4rem;
    width: 4.5rem;
    top: -.2rem;
    z-index: 1;
    border-radius: 1.9rem;
    margin-left: .6rem;
}

.search .search_btn a.normalClick {
    background-color: #22d4e4;
}

.search table {
    width: 100%;
}

.search {
    border-color: #e5e5e5;
    background: #f0f0f0;
}

.search a {
    background-color: transparent;
    border: none;
}

.search input::-webkit-input-placeholder {
    color: #999 !important;
}

.search input:-moz-placeholder {
    color: #999 !important;
}

.search input::-moz-placeholder {
    color: #999 !important;
}

.search input:-ms-input-placeholder {
    color: #999 !important;
}

.clear_input {
    height: 4rem;
    overflow: hidden;
}

.clear_input span {
    width: 3rem;
    height: 3rem;
    position: relative;
    top: -3.5rem;
    float: right;
    border-radius: 0.5rem;
}

.clear_input span.normalClick {
    background-color: rgba(255, 255, 255, 0.3);
}

.clear_input span:after {
    content: "";
    display: block;
    width: 2rem;
    height: 2rem;
    margin: 0.5rem;
    background: url('search_clear.png') center center no-repeat;
    background-size: 75%;
}

.clear_input input {
    padding-right: 3rem;
}

.search_img {
    background: url('search_btn.png') center center no-repeat;
}

.middleicon {
    background-size: 50%;
}

.search_btn_txt {
    display: inline-block;
    float: right;
    /* width: 5%; */
    line-height: 4rem;
    width: 17%;
    border-radius: .8rem;
    /* float: left; */
    margin-left: 0;
    text-align: center;
    background: rgb(68,110,246);
    color: white;
    font-size: 1.6rem;
    font-weight: bold;
}
</style>
