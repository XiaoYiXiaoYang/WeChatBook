import java.util.Scanner;

/**
 * 
 * @功能	将给定的钱数兑换成零钱
 * @作者
 * @时间 1.27
 *
 */
public class Hello6 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
	Scanner input = new Scanner(System.in);
	System.out.println("请输入钱数");
	double money = input.nextDouble();
	
	//圆
	int yuan = (int)money;
	int numOfshiyuan = yuan / 10; //10元纸币的数量
	int numOfwuyuan = yuan % 10 / 5; //5元纸币的数量
	int numOfyiyuan = yuan % 10 -5;  //一元纸币的数量
	
	//角
	int jiao = ((int)(money * 10)) % 10;
	int numOfwujiao = jiao / 5;	//	五角纸币的数量
	int numOfyijiao = jiao - 5;	//一角纸币的数量
	System.out.println("十元纸币的数量" + numOfshiyuan);
	System.out.println("五元纸币的数量" + numOfwuyuan);
	System.out.println("一元纸币的数量" + numOfyiyuan);
	System.out.println("五角纸币的数量" + numOfwujiao);
	System.out.println("一角纸币的数量" + numOfyijiao);
	}

}
