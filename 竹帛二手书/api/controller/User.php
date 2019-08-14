<?php

namespace app\api\controller;
use think\Controller;
class User extends Common
{

public function getuser(){
    if(request()->isPost()){
		$openid=input('openid');
		$user=db('user')->where('open_id',$openid)->find();
		if($user){
            return json(['status'=>200,'msg'=>'验证成功','data'=>$user]);
		}else{
			return json(['status'=>400,'msg'=>'用户不存在']);
		}
	}else{
		return json(['status'=>401,'msg'=>'登录失败，请重新授权']);
	}
}

public function register(){
	if(request()->isPost()){
		$data['open_id']=  input('openid');
		$data['nick_name']=input('nick_name');
		$data['head_src']= input('head_src');
    	$data['reg_time']= date('Y-m-d H:i:s');

	    $user=db('user')->insert($data);
	    if($user){
	        return json(['status'=>200,'msg'=>'注册成功','data'=>$user]);
	    }else{
	        return json(['status'=>400,'msg'=>'注册失败']);
	    }
	}
}
}