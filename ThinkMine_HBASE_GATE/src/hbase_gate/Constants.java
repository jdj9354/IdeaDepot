package hbase_gate;

public class Constants {
	public static enum OPERATION_TYPE {CREATE,READ,UPDATE,DELETE};
	public static final int DATA_INCOME_PORT = 5000;
	public static final int SOCKET_THREAD_POOL_MAXIMUM_SIZE = 100;
	public static final String SPACE_DELIMITER = " ";

	public static final String NULL_CHARACTER_DELIMITER = "\0";
	public static final byte NULL_CHARACTER_DELIMITTER_BYTE 
									= NULL_CHARACTER_DELIMITER.getBytes()[0];
	
	public static final String IDL_TYPE_DELIMITER = "?";
	
	public static final int CODE_MIND_ADD = 32;
	public static final int CODE_MIND_DEL = 33;
	public static final int CODE_MIND_MOVE = 34;
	public static final int CODE_MIND_PUT_INTO = 35;
	//public static final int CODE_MIND_PULL_OUT = "MPO";
	public static final int CODE_MIND_CONNECT_TO = 37;
	public static final int CODE_MIND_DISCONNECT_FROM = 38;
	public static final int CODE_MIND_CHANGE_FILLING_OF_CONTENTS = 39;
	public static final int CODE_MIND_CHANGE_VALUE_OF_CONTENTS = 40;
	//public static final int CODE_MIND_CHANGE_CONTENTS = "MCC";
	public static final int CODE_MIND_CHANGE_FILLING_OF_SHAPE = 42;
	//public static final int CODE_MIND_CHANGE_SHAPE = "MCS";
	//public static final int CODE_MIND_CHANGE_PARENT_MIND_MAP = "MCPMM";
	public static final int CODE_MIND_RESIZE_SHAPE = 45;
	public static final int CODE_MIND_MAP_REQUEST_MIND_INFO = 65;
	public static final int CODE_MIND_MAP_REQUEST_NEW_MIND_MAP = 66;
	
	public static final String HBASE_MASTER_ADDR = "127.0.0.1";
	public static final String[] HBASE_ZK_QUORUM_ADDRS = {"127.0.0.1"};
	public static final String HBASE_ZK_CLIENT_PORT = "2181";	

}
