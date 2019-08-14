<?php
namespace app\api\controller;
use think\Model;
class Collect extends Common
{
     public function add(){
        if(request()->isPost()){
    		$openid = input('openid');
    		$uid = $this->getUserId($openid);
     		//$goodsNum = input('goodsNum');
     		$goodsId = input('book_id');
     		if($uid){
     			$goodsInfo = db('goods')->find($goodsId);
     			if($goodsInfo['is_sale'] == '0'){
     				//先判断当前商品是否已经被加入购物车，如果没有，写入一条新的数据，如果已经存在，则只增加商品购买数量即可
     				$goodscollect = db('collect')->where(array('user_id'=>$uid, 'book_id'=>$goodsId))->find();
     				if($goodscollect){
     					//记录已经存在，只需增加商品数量即可
     					 //db('collect')->where(array('uid'=>$uid, 'goods_id'=>$goodsId))->setInc('goods_num', $goodsNum);
     					 return json(['code'=>200, 'msg'=>'购物车里已经有了']);
     				}else{
     					//未加入购物车则写入整条记录
						$data['user_id'] = $uid;
    					$data['book_id'] = $goodsId;
						$data['status'] = 1;
     					$res=db('collect')->insert($data);
						if($res){
							return json(['code'=>200, 'msg'=>'收藏成功']);
						}else{
						return json(['code'=>401, 'msg'=>'收藏失败']);
						}	
     				}
     			}else{
     				return json(['code'=>401, 'msg'=>'商品已被卖出']);
    			}
    		}else{
     			return json(['code'=>400, 'msg'=>'请重新登录']);
     		}
     	}else{
     		return json(['code'=>400, 'msg'=>'请重新登录']);
     	}
     }
	 
	  public function addToCollect(){
		if(request()->isPost()){
			$openid = input('openid');
			
			$data['user_id'] = $this->getUserId($openid);
			
			$data['book_id'] = input('book_id');
			$data['status'] =1;
			$res = db('collect')->insert($data);
			if($res){
				 return json(['status'=>200, 'msg'=>'加入收藏成功']);
			}else{
				 return json(['status'=>401, 'msg'=>'加入收藏失败']);
			}
			
		}
	  }
	 public function getOnestatus(){ //获取商品状态信息
        if(request()->isPost()){
            $book_id=input('book_id');
            $statusres = db('collect')->where('book_id',$book_id)->find();
            if ($statusres) {
                return json(['code'=>200, 'msg'=>'请重新登录','data'=>$statusres['status']]);
            } else {
                return json(['code'=>201, 'msg'=>'	','data'=>-1]);
            }
            
        }
        return json(['code'=>400, 'msg'=>'请重新登录']);
    }
    // //商品页面点击立即购买检测是否加入了购物车
    // public function checkCollect(){
    //     if($this->checkToken()){
    //         $openid = input('openid');
    //         $goodsId = input('goodsId');
    //         $uid = $this->getUserId($openid);
    //         if($uid){
    //             $count = db('cart')->where('uid',$uid)->where('goods_id',$goodsId)->count();
    //             if($count){
    //                 return json(['code'=>200, 'msg'=>'购物车中已经存在该商品']);
    //             }else{
    //                 $this->addToCart();
    //                 return json(['code'=>200, 'msg'=>'加入购物车成功']);
    //             }
    //         }else{
    //             return json(['code'=>400, 'msg'=>'请重新登录']);
    //         }
    //     }else{
    //         return json(['code'=>400, 'msg'=>'请重新登录']);
    //     }
    // }

    //获取数据列表
    public function collectList(){
    	if(request()->isPost()){
    		$openid = input('openid');
    		$uid = $this->getUserId($openid);
    		if($uid){
    			//$cartList = db('collect')->where('user_id',$uid)->order('user_id DESC')->select();
				$res= db('collect')->where('user_id',$uid)->select();
				foreach ($res as $k => $v) {
 				$goodres = db('goods')->where('post_id',$v['book_id'])->find();
				$picres = db('picture')->where('book_id',$v['book_id'])->find();
 				$res[$k] = array_merge($v,$picres,$goodres);
 			}
				
				
    			/*$cartList=\think\Db::field('es_picture.img_src,es_goods.book_author,es_goods.book_name,es_goods.pre_price,es_collect.*')//截取表s的name列 和表a的全部
                ->table(['es_goods'=>'a','es_collect'=>'s','es_picture'=>'b'])
                ->where('s.user_id',$uid)
                ->where('a.post_id=b.book_id')
                ->where('a.user_id=s.user_id')//查询条件语句
                ->select();*/
                
                if($res){
                    return json(['code'=>200,'data'=>$res, 'msg'=>'数据获取成功']);	
    			}else{
    				return json(['code'=>400, 'msg'=>'收藏为空']);
    			}
    		}else{
    			return json(['code'=>400, 'msg'=>'请重新登录']);
    		}
    	}else{
    		return json(['code'=>400, 'msg'=>'请重新登录']);
    	}
    }

    // //修改购物车商品选中状态
    // public function updateSelected(){
    //     $cartObj=db('cart');
    //     if($this->checkToken()){
    //         $openid = input('openid');
    //         $uid = $this->getUserId($openid);
    //         if($uid){
    //             $goodsId = input('goodsId');
    //             $selected = input('selected');
    //             $cartObj->update(['id'=>$goodsId,'selected'=>$selected]);
    //             //是否全选
    //             //查询当前用户所有购物车数据
    //             $cartGoodsNum = $cartObj->where('uid',$uid)->count();
    //             //当前用户选中的购物车中商品的数量
    //             $cartGoodsNumChecked = $cartObj->where('uid',$uid)->where('selected',1)->count();
    //             $selectAll = 1;
    //             if($cartGoodsNum != $cartGoodsNumChecked){
    //                 $selectAll = 0;
    //             }
    //             return json(['code'=>200, 'msg'=>'修改成功', 'selectAll'=>$selectAll]);
    //         }else{
    //             return json(['code'=>400, 'msg'=>'请重新登录']);
    //         }
    //     }else{
    //         return json(['code'=>400, 'msg'=>'请重新登录']);
    //     }
    // }

    // //处理全选和反选
    // public function updateCheckAll(){
    //     if($this->checkToken()){
    //         $openid = input('openid');
    //         $uid = $this->getUserId($openid);
    //         if($uid){
    //             $selected = input('selected',1);
    //             db('cart')->where('uid',$uid)->update(['selected'=>$selected]);
    //             return json(['code'=>200, 'msg'=>'修改成功']);
    //         }else{
    //             return json(['code'=>400, 'msg'=>'请重新登录']);
    //         }
    //     }else{
    //         return json(['code'=>400, 'msg'=>'请重新登录']);
    //     }

    // }

    // //初次打开购物车计算商品总价
    // public function firstGoodsTotalPrice(){
    //     if(request()->isPost()){
    //         $openid = input('openid');
    //         $uid = $this->getUserId($openid);
    //         if($uid){
    //             $cartGoods = db('collect')->where('user_id',$uid)->where('status',0)->select();
    //             $goodsTotalPrice = 0;
    //             foreach ($cartGoods as $k => $v) {
    //                 $goodsPrice = db('goods')->where('id',$v['goods_id'])->value('shop_price');
    //                 $goodsTotalPrice += $goodsPrice*$v['goods_num'];
    //             }
    //             return json(['code'=>200, 'msg'=>'修改成功', 'goodsTotalPrice'=>$goodsTotalPrice]);
    //         }else{
    //             return json(['code'=>400, 'msg'=>'请重新登录']);
    //         }
    //     }else{
    //         return json(['code'=>400, 'msg'=>'请重新登录']);
    //     }
    // }

    // //修改购物车商品数量
    // public function updateGoodsNum(){
    //     if($this->checkToken()){
    //         $openid = input('openid');
    //         $uid = $this->getUserId($openid);
    //         $goodsId = input('goodsId');
    //         $goodsNum = input('goodsNum');
    //         if($uid){
    //             db('cart')->where('uid',$uid)->where('goods_id',$goodsId)->update(['goods_num'=>$goodsNum]);
    //             return json(['code'=>200, 'msg'=>'修改商品数量成功']);
    //         }else{
    //             return json(['code'=>400, 'msg'=>'请重新登录']);
    //         }
    //     }else{
    //         return json(['code'=>400, 'msg'=>'请重新登录']);
    //     }
    // }

    public function delCollectGoods(){
        if(request()->isPost()){
            $openid = input('openid');
            $uid = $this->getUserId($openid);
            $goodsId = input('goodsId');
            if($uid){
                $res = db('collect')->where('user_id',$uid)->where('book_id',$goodsId)->delete();
                if($res){
                    return json(['code'=>200, 'msg'=>'已取消']);
                }else{
                    return json(['code'=>201, 'msg'=>'取消失败','res'=>$goodsId]);
                }
            }else{
                return json(['code'=>400, 'msg'=>'请重新登录']);
            }
        }else{
            return json(['code'=>400, 'msg'=>'请重新登录']);
        }
    }

    // //获取商品
    // public function getCarts(){
    //     if($this->checkToken()){
    //         $openid = input('openid');
    //         $uid = $this->getUserId($openid);
    //         $cartIds = input('cartIds');
    //         if($uid){
    //             $cartRes = db('cart')->where('id','in',$cartIds)->select();
    //             $goods = model('goods');
    //             if($cartRes){
    //                 foreach ($cartRes as $k => $v) {
    //                     $goodsObj = $goods->field('goods_name,thumb')->find($v['goods_id']);
    //                     $goodsArr = $goodsObj->toarray();
    //                     $cartRes[$k] = array_merge($cartRes[$k],$goodsArr);
    //                 }
    //                 $address = db('address')->where('uid',$uid)->where('deafult',1)->find();
    //                 return json(['code'=>200, 'msg'=>'获取成功','data'=>['cartList'=>$cartRes,'address'=>$address]]);
    //             }else{
    //                 return json(['code'=>201, 'msg'=>'获取失败']);
    //             }
    //         }else{
    //             return json(['code'=>400, 'msg'=>'请重新登录']);
    //         }
    //     }else{
    //         return json(['code'=>400, 'msg'=>'请重新登录']);
    //     }
    // }



}
