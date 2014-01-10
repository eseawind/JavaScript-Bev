/**
 * 
 */
package com.bev.util;

import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author liuhong
 *
 */
public class Commen {

	/**
	 * 
	 */
	public Commen() {
		// TODO Auto-generated constructor stub
	}
	
	public static String join(ArrayList arr,String joinChar){
		String res = "";
		
		for(int i=0;i<arr.size();i++){
			if(i!=0){
				res += joinChar;
			}
			res+=arr.get(i);
		}
		
		return res;
	}
	
    public static String upFirstLetter(String str){
    	if(!str.isEmpty()){
    		String f = str.substring(0, 1);
    		String t1 = str.substring(1);
    		f = f.toUpperCase();
    		str = f+t1;
    	}
    	return str;
    }
    
    public static String getPath(Object c) {
		String path = c.getClass().getProtectionDomain().getCodeSource()
				.getLocation().getPath();// this.request.getRealPath("/");
		if (path.indexOf("WEB-INF") > 0) {
			path = path.substring(0, path.indexOf("/WEB-INF/") + 1);
		}
		return path;
	}

    public static String replaceBlank(String str) {
        String dest = "";
        if (str!=null) {
            Pattern p = Pattern.compile("\\s*|\t|\r|\n");
            Matcher m = p.matcher(str);
            dest = m.replaceAll("");
        }
        return dest;
    }


    /**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

}
