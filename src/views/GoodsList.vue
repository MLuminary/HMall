<!--  -->
<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span slot="bread">Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" @click="sortGoods" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" @click="setPriceLevel('all')">All</a></dd>
              <dd>
                <a href="javascript:void(0)" v-for="(item,index) in priceArea" :key="index" @click="setPriceLevel(index)">
                  {{item.leftprice + '-' + item.rightprice}}
                </a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodsList" :key="index">
                  <div class="pic">
                    <a href="#"><img v-bind:src="'/static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
  import './../assets/css/base.css'
  import './../assets/css/product.css'
  import NavHeader from './../components/NavHeader.vue'
  import NavFooter from './../components/NavFooter.vue'
  import NavBread from './../components/NavBread.vue'
  import axios from 'axios'
  export default {
    data() {
      return {
        goodsList : [],
        sortFlag: true, //升序
        page: 1,
        pageSize: 8,
        busy: true,
        loading:false,
        priceArea : [
          {
            leftprice:0,
            rightprice:100
          },
          {
            leftprice:100,
            rightprice:500
          },
          {
            leftprice:500,
            rightprice:1000
          },
          {
            leftprice:1000,
            rightprice:5000
          }
        ],
        priceLevel : 'all'
      };
    },
    components:{
      NavHeader,
      NavFooter,
      NavBread
    },
    mounted() {
      this.getGoodsList();
    },
    methods: {
      //传入  flag 来判断是否是滚动加载
      getGoodsList(flag){
        var param = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortFlag?1:-1,
          priceLevel: this.priceLevel
        }
        this.loading = true;
        axios.get("/goods",{params:param}).then((response)=>{
          //加载完成 loading 图标隐藏
          this.loading = false;
          if(response.data.status == "0") {
            let result = response.data.result;
            if(flag) {
              this.goodsList = this.goodsList.concat(result.list);
              //再加载一次后 busy 会自动变成true 因此需要手动将其设置为 false
              this.busy = false;
              if(result.count<this.pageSize) {
                this.busy = true;
              }
            }else{
              this.goodsList = result.list;
              //在 monted 调用阶段使插件可以动态加载
              this.busy = false;
            }
          }else{
            this.goodsList = [];
          }

        })
      },
      //按价格升序降序排序
      sortGoods() {
        this.sortFlag = !this.sortFlag;
        this.page = 1;
        this.getGoodsList();
      },
      // 价格过滤
      setPriceLevel(index) {
        this.priceLevel = index;
        this.page = 1;
        this.getGoodsList();
      },
      //滑动加载更多
      loadMore() {
        this.busy = true;
        setTimeout(()=>{
          this.page++;
          this.getGoodsList(true);
        },500)
      },
      addCart(productId) {
        axios.post('/goods/addCart',{
          productId:productId
        }).then((res)=>{
          let data = res.data;
          if(data.status == 0){
            alert("加入成功");
          }else{
            alert("msg:" + data.msg);
          }
        })
      }
    }
  };
</script>

