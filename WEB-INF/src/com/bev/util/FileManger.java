package com.bev.util;

import java.io.*;
import java.util.ArrayList;

public class FileManger {
	public static String readTxt1(String fileName) throws IOException {
		BufferedReader br = new BufferedReader(new FileReader(fileName));
		String str = "";
		String r = br.readLine();
		while (r != null) {
			str += r+"\n";
			r = br.readLine();
		}
		return str;
	}
    public static String readTxt(String fileName) throws IOException {
        String str = "";
        try {
            File f1 = new File(fileName);// 打开文件
            FileInputStream in = new FileInputStream(f1);
            // 指定读取文件时以UTF-8的格式读取
            BufferedReader br = new BufferedReader(new InputStreamReader(in,
                    "UTF-8")); // 读取文件
            String r = br.readLine();
            while (r != null) {
                str += r+"\n";
                r = br.readLine();
            }
            in.close();// 关闭读取
        } catch (Exception e1) {// 如果有错误，这里进行处理
            e1.printStackTrace();// 打印错误信息
        }
        return str;
    }

	public static void writeTxt(String path,String content) {
		try {
			content.replaceAll("\n", "\\n");
			File file = new File(path);
            if (!file.getParentFile().exists()) {
                file.getParentFile().mkdirs();
            }

            if (!file.isFile()) {
                file.createNewFile();
            }

			FileWriter fw = null;

			OutputStreamWriter outputStream = new OutputStreamWriter(new FileOutputStream(file),"UTF-8");
			outputStream.write(content);
			outputStream.flush();
			outputStream.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static ArrayList getFileList(String path){
		ArrayList files = new ArrayList();
		File[] fileList = null;
		File directory = new File(path);
		if(directory.exists()){
			fileList = directory.listFiles();
			for(int i=0;i<fileList.length;i++){
				files.add(fileList[i].getName());
			}
		}
		
		return files;
	}
}
