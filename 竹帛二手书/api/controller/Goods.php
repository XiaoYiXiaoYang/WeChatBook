<?php

namespace app\api\controller;
use think\Controller;
class Goods extends Common
{

public function getType(){ //暂时没用
    if(request()->isPost()){
		$openid=input('openid');
		$types=db('type')->select();
		if($types){
            return json(['status'=>200,'msg'=>'成功','data'=>$types]);
		}else{
			return json(['status'=>400,'msg'=>'失败']);
		}
	}else{
		return json(['status'=>401,'msg'=>'登录失败，请重新授权']);
	}
}
public function ask_book(){
	if(request()->isPost()){
		$openid=input('openid');
		$uid = $this->getUserId($openid);
		if($uid){//ask表
			$data['user_id']=$uid;
			$data['ask_title'] = input('ask_title');
			$data['ask_desc'] = input('ask_desc');
			$data['ask_date'] = date('Y-m-d H:i:s');
			
			$res = db('ask')->insert($data);
			if($res){
				$ask_id=db('ask')->where('ask_title','like',$data['ask_title'])->where('user_id',$uid)->where('ask_date',$data['ask_date'])->value('ask_id');
				$imgs=input('post.imgs/a');  //取数组，get方法  imgs变量名  a数组
				$nums=0;  //插入成功的总数
				//如果要调试，可制造错误 $imgs = input('imgs');  小程序端看网页输出的东西
				if(is_array($imgs)){
					foreach ($imgs as $value) {
						$data2=['ask_id'=>$ask_id,'img'=>$value];
						$result=db('ask_pic')->insert($data2);
						if($result){
							$nums=$nums+1;
						}
					}
			}
			if($nums == count($imgs)){
						return json(['status'=>200,'msg'=>'发布成功']);
			}else{
				return json(['status'=>400,'msg'=>'插入图片失败']);
			}
			}else{
					return json(['status'=>400,'msg'=>'插入ask表失败']);
			}
		}else{
			return json(['status'=>400,'msg'=>'获取uid失败']);
		}
	}else{
		return json(['status'=>401,'msg'=>'登录失败，请重新授权']);
	}
}
public function post_book(){
	if(request()->isPost()){
		$openid=input('openid');
		$uid = $this->getUserId($openid);
		if($uid){//goods表
			$data['user_id']=$uid;
			$data['book_name'] = input('name');
			$data['book_author'] = input('author');
			$data['ori_price'] = input('ori_price');
			$data['pre_price'] = input('pre_price');
			$data['book_desc'] = input('description');
			$data['view_eyes'] = 0;
			$data['post_date'] = date('Y-m-d H:i:s');
			$data['is_sale'] = 0;
			$data['means'] = input('means');
			$res = db('goods')->insert($data);
			
			if($res){
				
				$book_id=db('goods')->where('book_name','like',$data['book_name'])->where('user_id',$uid)->where('post_date',$data['post_date'])->value('post_id');
				$type1=input('type1');
				$type2=input('type2');
				 $type= [['type_id'=> $type1,'book_id'=> $book_id],
				 		['type_id'=>$type2,'book_id'=> $book_id]];

				 $res2 = db('book_type')->insertAll($type);
				if($res2){//图片
					$imgs=input('post.imgs/a');  //取数组，get方法  imgs变量名  a数组
					$nums=0;  //插入成功的总数
					//如果要调试，可制造错误 $imgs = input('imgs');  小程序端看网页输出的东西
					if(is_array($imgs)){
						foreach ($imgs as $value) {
							$data2=['book_id'=>$book_id,'img_src'=>$value];
							$result=db('picture')->insert($data2);
							if($result){
								$nums=$nums+1;
							}
						}
					}
					if($nums == count($imgs)){
						return json(['status'=>200,'msg'=>'发布成功']);
					}else{
						return json(['status'=>400,'msg'=>'插入图片失败']);
					}
				}else{
					return json(['status'=>400,'msg'=>'插入type失败']);
				}
			}else{
				return json(['status'=>400,'msg'=>'插入goods表失败']);
			}
		}else{
			return json(['status'=>400,'msg'=>'获取uid失败']);
		}
	}else{
		return json(['status'=>401,'msg'=>'登录失败，请重新授权']);
	}
 }
 public function upload(){
 	$file = request()->file('pic');
    if($file){
        // 移动到框架应用根目录/public/uploads/ 目录下
        $info = $file->move(ROOT_PATH.'public'.'/'.'/static/wechat');
        if($info){ 
            //拼接文件路径
            //使用date()方法计算出八位时间，上传到uploads的文件所在的文件名就是这八位时间
            //使用$info->getFilename()方法获取文件名
            $data= $info->getSaveName();           
            return $data;
            //return json(['status'=>'200','msg'=>'上传成功','res'=>$data]);
        }else{
            // 上传失败返回错误信息
            return json(['status'=>201,'msg'=>'上传失败','res'=>$this->error($file->getError())]);
        }
    };
    
 	return json(['status'=>401,'msg'=>'登录失败，请重新授权']);
 }
public function getAll(){  //查询所有书籍
 	if(request()->isPost()){
 		$openid = input('openid');
 		$page = input('page',1);
 		$config=['page'=>$page,'list_rows'=>4];

 		$uid = $this->getUserId($openid);
 		if($uid){
 			$res = db('goods')->order('post_id DESC')->paginate(null,false,$config);  //返回goods表的全部商品，然后对每个商品
 			foreach ($res as $k => $v) {
 				$typeres = db('book_type')->where('book_id',$v['post_id'])->find();
 				$picres = db('picture')->where('book_id',$v['post_id'])->find();
 				$res[$k] = array_merge((array)$typeres,$v,(array)$picres);
 			}
 			
             if($res){
             	return json(['status'=>200,'msg'=>'查询成功','data'=>$res]);
             }else{
             	return json(['status'=>201,'msg'=>'获取数据失败']);
             }
 		}else{
 			return json(['status'=>201,'msg'=>'获取uid失败']);
 		}
 	}
 	return json(['status'=>401,'msg'=>'登录失败，请重新授权']);
 }
  public function getBookById(){ //根据id查询书的详情
 	if (request()->isPost()) {
 		$id=input('book_id');
 		//浏览量加一
 		$res = db('goods')->where('post_id', $id)->setInc('view_eyes',1);
    	$goodres=db('goods')->find($id);//商品基本信息
    
    	if ($goodres) {
    		$typeres = db('book_type')->where('book_id',$id)->select();
    		if ($typeres) {
    			$picres = db('picture')->where('book_id',$id)->select();
    			if ($picres) {
    				return json(['status'=>200,'msg'=>'查询成功','book_info'=>$goodres,'type_info'=>$typeres,'pic_info'=>$picres]);
    			} else {
    				return json(['status'=>201,'msg'=>'获取pictureinfo失败']);
    			}
    		} else {
    			return json(['status'=>201,'msg'=>'获取typeinfo失败','data'=>$typeres,'book'=>$goodres]);
    		}
    	}else{
    		return json(['status'=>201,'msg'=>'获取goodsinfo失败']);
    	   }	
	 	} 
	 	return json(['status'=>401,'msg'=>'登录失败，请重新授权']);
	 		
 	}

 public function getLatestPost(){  //最新发布
 		if (request()->isPost()) {
 			$openid = input('openid');
 			$uid = $this->getUserId($openid);
 			$config=['page'=>1,'list_rows'=>4];
 			$newres = db('goods')
 								->where('is_sale','0')
 								->order('post_date DESC')
 								->paginate(null,false,$config);
 			foreach ($newres as $k => $v) {
 				$picres = db('picture')->where('book_id',$v['post_id'])->find();
 				$newres[$k] = array_merge($v,(array)$picres);
 			}

 			if ($newres) {
 				return json(['status'=>200,'msg'=>'查询成功','data'=>$newres]);
 			} else {
 				return json(['status'=>201,'msg'=>'获取最新发布失败']);
 			}
 			
 		} 
 		return json(['status'=>401,'msg'=>'登录失败，请重新授权']);
 	
 		
 	}

 	public function getAllAskFor(){ //查询所有求购信息
 		if(request()->isPost()){
 		$openid = input('openid');
 		$page = input('pageask',1);
 		$config=['page'=>$page,'list_rows'=>4];

 		$uid = $this->getUserId($openid);
 		if($uid){
 			$res = db('ask')->order('ask_id DESC')->paginate(null,false,$config);  

 			foreach ($res as $k => $v) {
 				$typeres = db('ask_type')->where('ask_id',$v['ask_id'])->find();
				$picres = db('ask_pic')->where('ask_id',$v['ask_id'])->find();
 				$res[$k] = array_merge((array)$typeres,(array)$picres,$v);
 			}
 			
             if($res){		 
             	return json(['status'=>200,'msg'=>'查询成功','data'=>$res]);
             }else{
             	return json(['status'=>201,'msg'=>'获取数据失败']);
             }
 		}else{
 			return json(['status'=>201,'msg'=>'获取uid失败']);
 		}
 	}
 	return json(['status'=>401,'msg'=>'登录失败，请重新授权']);
 	}

	public function getAskByuserid(){ //查询所有求购信息
			if(request()->isPost()){
			$openid = input('openid');
			$page = input('pageask',1);
			$config=['page'=>$page,'list_rows'=>4];

			$uid = $this->getUserId($openid);
			if($uid){
				$res = db('ask')->where('user_id',$uid)->order('ask_id DESC')->paginate(null,false,$config);  

				foreach ($res as $k => $v) {
					$typeres = db('ask_type')->where('ask_id',$v['ask_id'])->find();
					$picres = db('ask_pic')->where('ask_id',$v['ask_id'])->find();
					$res[$k] = array_merge((array)$typeres,(array)$picres,$v);
				}
				
				 if($res){		 
					return json(['status'=>200,'msg'=>'查询成功','data'=>$res]);
				 }else{
					return json(['status'=>201,'msg'=>'获取数据失败']);
				 }
			}else{
				return json(['status'=>201,'msg'=>'获取uid失败']);
			}
		}
		return json(['status'=>401,'msg'=>'登录失败，请重新授权']);
	}
	public function getBookByKey(){ //根据关键字查询
	 		if(request()->isPost()){
	 		$openid = input('openid');
	 		$uid = $this->getUserId($openid);

	 		$page = input('page',1);
	 		$config=['page'=>$page,'list_rows'=>4];

	 		$keywords = input('keywords');
	 		$uid = $this->getUserId($openid);
	 		if($uid){
	 			$res = db('goods')
	 			->where('book_name','like','%'.$keywords.'%')
	 			->whereOr('book_author','like','%'.$keywords.'%')
	 			->whereOr('book_desc','like','%'.$keywords.'%')
	 			->order('post_id DESC')
	 			->paginate(null,false,$config);  

	 			foreach ($res as $k => $v) {
	 				$picres = db('picture')->where('book_id',$v['post_id'])->find();
	 				$res[$k] = array_merge($picres,$v);
	 			}
	 			
	             if($res){
	             	return json(['status'=>200,'msg'=>'查询成功','data'=>$res]);
	             }else{
	             	return json(['status'=>201,'msg'=>'获取数据失败']);
	             }
	 		}else{
	 			return json(['status'=>201,'msg'=>'获取uid失败']);
	 		}
	 	}
	 	return json(['status'=>401,'msg'=>'登录失败，请重新授权']);
	}

 	public function AddCollect(){  //加入收藏
 		if(request()->isPost){
            $collectObj = db('collect');
            $openid = input('openid'); 
            $goodId = input('book_id');
            $uid = $this->getUserId($openid);
            $collect = $collectObj->where(array('goods_id'=>$goodId, 'uid'=>$uid))->find();
            if($collect){
                $collectObj->where(array('goods_id'=>$goodId, 'uid'=>$uid))->delete();
                return json(['code'=>200, 'status'=>-1, 'msg'=>'已取消']);
            }else{
                $collectObj->insert(['goods_id'=>$goodId, 'uid'=>$uid]);
                return json(['code'=>200, 'status'=>1, 'msg'=>'已收藏']);
            }
        }else{
            return json(['code'=>400, 'msg'=>'重新登录']);
        }
 	}
 	public function getAllCommenter(){ //查询所有求购信息
 		if(request()->isPost()){
 		$id = input('ask_id');
 		$res = db('comment')->where('ask_id',$id)->select();
 		if ($res) {
 			foreach ($res as $k => $v) {
	 				$userres = db('user')->where('user_id',$v['user_id'])->find();
	 				$res[$k] = array_merge($userres,$v);
	 		}
	 		return json(['status'=>200, 'data'=>$res]);
 		}else{
 			return json(['status'=>201,'msg'=>'查询评论信息错误']);
 		}
 	}
 	return json(['status'=>401,'msg'=>'登录失败，请重新授权']);
 	}
	public function getAskById(){
	if(request()->isPost()){
		$id = input('ask_id');
		$res = db('ask')->where('ask_id',$id)->find();
		if ($res) {
			$picres = db('ask_pic')->where('ask_id',$id)->select();
			if($picres){
				return json(['status'=>200, 'data'=>$res,'picres'=>$picres]);
			}else{
				return json(['status'=>201,'status'=>1, 'msg'=>'查询图片错误']);
			}
		}else{
			return json(['status'=>401, 'msg'=>'查询求购信息错误']);
		}
	}
	}
  	public function addcomment(){ //添加评论  传入参数openid，评论内容，求购id
 		if(request()->isPost()){
 			$openid = input('openid');
 			$uid = $this->getUserId($openid);
 			$data['ask_id'] =input('ask_id');
 			$data['user_id'] =$uid;
 			$data['content'] =input('content');
			$data['comment_time'] = date('Y-m-d H:i:s');

 			$res = db('comment')->insert($data);
 			if ($res) {
 				return json(['status'=>200, 'msg'=>'评论成功']);
 			}else{
 				return json(['status'=>201, 'msg'=>'评论失败']);
 			}
 		}
 	}
	
	public function getReviewByuserid(){
		if(request()->isPost()){
			$openid = input('openid');
		$uid = $this->getUserId($openid);
		
		$res = db('comment')->where('user_id',$uid)->select();
		
		foreach ($res as $k => $v) {
 				$userres = db('user')->where('user_id',$v['user_id'])->find();
 				$res[$k] = array_merge($v,$userres);
		}
		if ($res) {
 				return json(['status'=>200, 'msg'=>'查询成功','data'=>$res]);
 			}else{
 				return json(['status'=>201, 'msg'=>'查询失败']);
 			}
		}
	}
}