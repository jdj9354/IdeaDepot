package hbase_gate;

import org.json.simple.JSONObject;

public class DataCommCallBack {
	
	public static boolean queryMindObjectAdd(JSONObject info){
		return true;
	}
	public static byte[] executeRead(byte[] info){
		byte[] ret = null;
		
		return ret;
	}
	public static boolean executeUpdate(byte[] info){
		return true;
	}
	public static boolean executeDelete(byte[] info){
		return true;
	}
}
