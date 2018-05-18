import { Base } from './base.js';

class DetailModel extends Base{
  constructor() {
    super()
  }

  // 获取首页旧物漂流
  getIndexOldGoods(cb) {
    let params = {
      url: 'oldGoods/index',
      callBack(res) {
        cb && cb(res)
      },
    }
    this.request(params)
  }

  // 获取首页发现鲜货
  getIndexNewGoods(cb) {
    let params = {
      url: 'newGoods/index',
      callBack(res) {
        cb && cb(res)
      },
    }
    this.request(params)
  }

  // 获取所有二手 / 自营商品
  getGoods(url, page, cb, ecb){
    let params = {
      url: url,
      data: {
        page: page,
        size: 14
      },
      callBack(res) {
        cb && cb(res)
      },
      eCallBack(res){
        ecb && ecb(res)
      }
    }
    this.request(params)
  }

  // 获取自营商品详情
  getGoodsDetail(id, cb){
    let params = {
      url: 'newGoods/' + id,
      callBack: function (data) {
        cb && cb(data);
      }
    }
    this.request(params)
  }

  // 获取二手商品详情
  getOldGoodsDetail(id, cb) {
    let params = {
      url: 'oldGoods/' + id,
      callBack: function (data) {
        cb && cb(data);
      }
    }
    this.request(params)
  }

  // 根据商家id获取所有商品
  getGoodsByShopId(page, id, cb, ecb) {
    let params = {
      url: 'newGoods/shop/' + id,
      data: {
        page: page,
        size: 10
      },
      callBack: function (data) {
        cb && cb(data)
      },
      eCallBack(data){
        ecb && ecb(data)
      }
    }

    this.request(params)
  }

  // 获取自营商店最近新品
  getRecentGoodsByShopId(id, cb) {
    let params = {
      url: 'newGoods/recent/shop/' + id,
      callBack: function (data) {
        cb && cb(data)
      }
    }

    this.request(params)
  }

  // 根据分类获取商品
  getGoodsByCategoryID(page, id, cb, ecb) {
    let params = {
      url: 'goods/category/' + id,
      data:{
        page: page,
        size: 12
      },
      callBack(res){
        cb && cb(res)
      },
      eCallBack(res){
        ecb && ecb(res)
      }
    }
    this.request(params)
  }

  // 获取商店页面三个商品图片
  getRecommend(id, cb){
    let params = {
      url: 'newGoods/recommend/shop/' + id,
      callBack(res){
        cb && cb(res)
      }
    }
    this.request(params)
  }
}

export { DetailModel }