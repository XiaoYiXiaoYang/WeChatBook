<?php
namespace app\api\controller;

class Address extends Common
{

    public function getAddress(){
        if(request()->isPost()){
            $openid = input('openid'); 
            $uid = $this->getUserId($openid);
            if($uid){
                $addressRes = db('address')->where('user_id',$uid)->select();
                if($addressRes){
                   return json(['code'=>200, 'msg'=>'获取到收货地址', 'data'=>$addressRes]); 
               }else{
                    return json(['code'=>200, 'msg'=>'该用户尚无收货地址', 'data'=>[]]);
               }
            }else{
                return json(['code'=>400, 'msg'=>'重新登录']);
            }
        }else{
            return json(['code'=>400, 'msg'=>'重新登录']);
        }
    }

    public function addAddress(){
        if(request()->isPost()){
            $openid = input('openid'); 
            $userid = $this->getUserId($openid);
            if($userid){
                db('address')->where('user_id',$userid)->setField('defaults', 0);
                $data['user_id'] = $userid;
                $data['user_name'] = input('name');
                $data['phone'] = input('phone');
                $data['address'] = input('address');
                $data['defaults'] = 1;
                $address = db('address')->insert($data);
                if($address){
                   return json(['code'=>200, 'msg'=>'添加成功']); 
               }else{
                    return json(['code'=>400, 'msg'=>'添加失败']);
               }
            }else{
                return json(['code'=>400, 'msg'=>'重新登录']);
            }
        }else{
            return json(['code'=>400, 'msg'=>'重新登录']);
        }
    }

    public function delAddress(){
        if(request()->isPost()){
            $openid = input('openid'); 
            $uid = $this->getUserId($openid);
            if($uid){
                db('address')->where('user_id',$uid)->where('address_id',input('addressId'))->delete();
                $count = db('address')->where('user_id',$uid)->where('defaults', 1)->count();
                if(!$count){
                    db('address')->where('user_id',$uid)->order('address_id DESC')->limit(1)->setField('defaults', 1);
                }
                return json(['code'=>200, 'msg'=>'删除成功']);
            }else{
                return json(['code'=>400, 'msg'=>'重新登录']);
            }
        }else{
            return json(['code'=>400, 'msg'=>'重新登录']);
        }
    }

    public function setDeafult(){
        if(request()->isPost()){
            $openid = input('openid'); 
            $uid = $this->getUserId($openid);
            $addressId = input('addressId');
            if($uid){
                db('address')->where('user_id',$uid)->setField('defaults', 0);//全设为0
                db('address')->where('user_id',$uid)->where('address_id',$addressId)->setField('defaults', 1);  //其中一个设为1
                return json(['code'=>200, 'msg'=>'设置成功']);
            }else{
                return json(['code'=>400, 'msg'=>'重新登录']);
            }
        }else{
            return json(['code'=>400, 'msg'=>'重新登录']);
        }
    }

    //获取当前地址信息
    public function getOneAddress(){
        if(request()->isPost()){
            $openid = input('openid');
            $id = input('id'); 
            $uid = $this->getUserId($openid);
            if($uid){
                $address = db('address')->find($id);
                return json(['code'=>200, 'msg'=>'获取成功', 'data'=>$address]);
            }else{
                return json(['code'=>400, 'msg'=>'重新登录']);
            }
        }else{
            return json(['code'=>400, 'msg'=>'重新登录']);
        }
    }

    //修改地址
    public function updateAddress(){
        if(request()->isPost()){
            $openid = input('openid'); 
            $uid = $this->getUserId($openid);
            if($uid){
                $data['user_name'] = input('name');
                $data['phone'] = input('phone');
                $data['address'] = input('address');
                $save = db('address')->where('address_id',input('id'))->update($data);
                if($save !== false){
                    return json(['code'=>200, 'msg'=>'修改成功']);
                }else{
                    return json(['code'=>400, 'msg'=>'修改失败']);
                }
                
            }else{
                return json(['code'=>400, 'msg'=>'重新登录']);
            }
        }else{
            return json(['code'=>400, 'msg'=>'重新登录']);
        }
    }

    //判断用户有么有默认收货地址
    public function deafultAddress(){
        if($this->checkToken()){
            $openid = input('openid'); 
            $uid = $this->getUserId($openid);
            if($uid){
                $count = db('address')->where('uid',$uid)->where('deafult', 1)->count();
                if($count){
                    return json(['code'=>200, 'msg'=>'跳转到订单提交']);
                }else{
                    return json(['code'=>401, 'msg'=>'跳转到地址添加']);
                }
                
            }else{
                return json(['code'=>400, 'msg'=>'重新登录']);
            }
        }else{
            return json(['code'=>400, 'msg'=>'重新登录']);
        }
    }

}
