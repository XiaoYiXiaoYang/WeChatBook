<?php

namespace app\api\controller;
use think\Controller;
use think\Request;
class Login extends Controller
{

public function login(){
		$url = "https://api.weixin.qq.com/sns/jscode2session";
		// 参数
		$params['appid']= 'wx5d90dbff3d46b7d5';
		$params['secret']= '907e5e3b35239d6ccf869818829ecf59';
		$params['js_code']= input('code');
		$params['grant_type']= 'authorization_code';

		// 微信API返回的session_key 和 openid
		$arr = httpRequest($url, 'POST',$params );

		$arr = json_decode($arr,true);

		// 判断是否成功
		if(isset($arr['errcode']) && !empty($arr['errcode'])){
		    return json(['code'=>'2','message'=>$arr['errmsg'],"result"=>null]);
		}

		$openid = $arr['openid'];
		$session_key = $arr['session_key'];

		return json(['code'=>'1','openid'=>$openid,'session_key'=>$session_key]);
}

}
