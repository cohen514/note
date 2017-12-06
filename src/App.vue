<template>
  <div id="vue-memo">
    <h1>123</h1>
  </div>
</template>

<script>
  import helpers from './helpers';
  import storeUtil from './storage';
  import memoItem from './components/memoItem.vue';
  import memoEditor from './components/memoEditor.vue';

  let store = storeUtil.store;
  let Memo = storeUtil.Memo;

  export default {
    data(){
      return {
        memos:store.memos,
        memosFiltered:[],
        currentSortBy:'',
        currentCategoryId:'',
        queryString:'',
        categories:{
          0:'全部',
          1:'工作',
          2:'生活',
          3:'学习'
        },
        helpers
      }
    },
    components: {
      memoItem,
      memoEditor
    },
    methods:{
      filterBy(categoryId,queryString){
        let result = [];
        switch (categoryId) {
          case 0:
                result = this.memos;
                this.currentCategoryId = 0;
                break;
          case 1:
                result = this.memosInWorkCate;
                this.currentCategoryId = 1;
                break;
          case 2:
                result = this.memosInLivingCate;
                this.currentCategoryId = 2;
                break;
          case 3:
                result = this.memosInStudyCate;
                this.currentCategoryId = 3;
                break;
        }
        if (queryString !== '') {
          result = result.filter((item) => {
              let matchesQuery = false;
          if (item.title.indexOf(queryString) !== -1 || item.timeStamp.indexOf(queryString) !== -1) {
            matchesQuery = true;
          }
          if (item.type === 0 && item.content.indexOf(queryString) !== -1) {
            matchesQuery = true;
          }
          // 则过滤之
          return matchesQuery;
        });
        }
        this.memosFiltered = result;
        this.sortByTimeOrTitle('title');
      },

      sortByTimeOrTitle(option){
        this.memosFiltered.sort((m1,m2) =>{
          if(m1[option]<m2[option]){
          return -1
        } else {
          return 1
        }
        });
        this.currentSortBy = option === 'timeStamp' ? '按创建时间排序' : '按标题排序';
      },

      createMarkdown(){
        this.$broadcast('createMarkdown');
      },
      createDoodle(){
        this.$broadcast('createDoodle');
      }
    },
    computer:{
      memosInWorkCate () {
        return this.memos.filter((item)=>{
            return item.categoryId === 1
          })
      },
      memosInLivingCate(){
        return this.memos.filter((item)=>{
            return item.categoryId === 2
          })
      },
      memosInStudyCate(){
        return this.memos.filter((item)=>{
            return item.categoryId === 3
          })
      }
    },
    events:{
      editMarkdown(memo){
        this.$broadcast('editMarkdown',memo);
      },
      editDoodle(memo){
        this.$broadcast('editDoodle',memo);
      }
    },
    ready(){
      this.filterBy(0,this.queryString);
      this.sortByTimeOrTitle('title');
    },
    watch: {
      memosFiltered () {
        helpers.resizeMemos();
      }
    }
  }
</script>

<style lang="stylus">
  @import './style/main'
</style>
