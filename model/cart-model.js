import {Base} from './base.js'

class CartModel extends Base{
  constructor(){
    super()
    this._storageKeyName = 'cart'
  }

  // 添加到购物车的方法
  // 没有该商品时，新增商品；有该商品时，增加数量
  // goods->商品；count->数量
  add(goods, count, cb){
    let cartData = this.getCartDataFromLocal()
    let isExisted = this._isExistedThatOne(goods.id, cartData)

    if(isExisted.index == -1){
      goods.count = count
      goods.selected = true
      cartData.push(goods)
    }else{
      if ((cartData[isExisted.index].count + count) <= cartData[isExisted.index].quantity){
        cartData[isExisted.index].count += count
      }else{
        cb && cb()
      }      
    }

    wx.setStorageSync(this._storageKeyName, cartData)
  }

  // 增加购物车中商品的数量
  plusCount(id){
    this._updateCount(id, 1)
  }
  
  // 减少购物车中商品的数量
  minusCount(id){
    this._updateCount(id, -1)
  }

  // 删除购物车中的商品
  delete(ids){
    if(!(ids instanceof Array)){
      ids = [ids]
    }
    let cartData = this.getCartDataFromLocal();
    for(let i = 0; i < ids.length; i++){
      let isExisted = this._isExistedThatOne(ids[i], cartData)
      if(isExisted.index != -1){
        cartData.splice(isExisted.index, 1)
      }
    }
    wx.setStorageSync(this._storageKeyName, cartData)
  }

  // 从缓存中获取所有购物车商品
  // flag为true时，只获取选中的商品
  getCartDataFromLocal(flag){
    let res = wx.getStorageSync(this._storageKeyName)
    if(!res){
      res = [];
    }

    if(flag){
      let newRes = []
      for(let i = 0; i < res.length; i++){
        if(res[i].selected){
          newRes.push(res[i])
        }
      }
      res = newRes
    }

    return res;
  }

  // 获取购物车所有商品数量
  // flag为true时考虑商品的选中状态
  getCartTotalCount(flag = false){
    let cartData = this.getCartDataFromLocal()
    let count = 0
    for(let i = 0; i < cartData.length; i++){
      if(flag){
        if(cartData[i].selected == true){
          count += cartData[i].count
        }
      }else{
        count += cartData[i].count
      }      
    }
    return count
  }

  // 根据商品id判断此商品是否存在于缓存中
  // id->商品id；cartData->缓存中购物车商品
  _isExistedThatOne(id, cartData) {
    let item, result = { index: -1 }
    for (let i = 0; i < cartData.length; i++) {
      item = cartData[i]
      if (item.id == id) {
        result = {
          data: item,
          index: i
        }
        break
      }
    }
    return result
  }

  // 修改商品数量
  // id->商品id；count->数量
  _updateCount(id, count){
    let cartData = this.getCartDataFromLocal()
    let isExisted = this._isExistedThatOne(id, cartData)
    if(isExisted.index != -1){
      if (isExisted.data.count > 1){
        cartData[isExisted.index].count += count
      }
    }
    wx.setStorageSync(this._storageKeyName, cartData)
  }

  // 更新购物车中商品价格
  updatePrice(cb){
    let goods = this.getCartDataFromLocal()
    if (goods.length == 0){      
      cb && cb()
      return 0
    }
    let ids = []
    for(let item in goods){
      ids.push(goods[item].id)
    }
    let idsStr = ids.join('|')
    let that = this
    let params = {
      url: 'goods/check',
      data: {
        ids: idsStr
      },
      callBack(res){
        that.updateStoragePrice(res, goods)
        cb && cb()
      }
    }
    this.request(params)
  }

  updateStoragePrice(res, goods){
    let data = []
    for(let i in res){
      let id = res[i].id
      let goodsIndexObj = this._isExistedThatOne(id, goods)
      let index = goodsIndexObj.index
      let storageGoods = goodsIndexObj.data;    
      data[index] = res[i]  
      data[index].count = storageGoods.count 
      data[index].selected = storageGoods.selected
    }
    wx.setStorageSync(this._storageKeyName, data)
  }
}

export { CartModel }