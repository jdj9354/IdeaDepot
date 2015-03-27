//Client Constants
const CODE_MIND_ADD = 32;
const CODE_MIND_DEL = 33;
const CODE_MIND_MOVE = 34;
const CODE_MIND_PUT_INTO = 35;
const CODE_MIND_PULL_OUT = "MPO";
const CODE_MIND_CONNECT_TO = 37;
const CODE_MIND_DISCONNECT_FROM = 38;
const CODE_MIND_CHANGE_COLOR_OF_CONTENTS = 39;
const CODE_MIND_CHANGE_VALUE_OF_CONTENTS = 40;
const CODE_MIND_CHANGE_CONTENTS = "MCC";
const CODE_MIND_CHANGE_COLOR_OF_SHAPE = 42;
const CODE_MIND_CHANGE_SHAPE = "MCS";
const CODE_MIND_CHANGE_PARENT_MIND_MAP = "MCPMM";
const CODE_MIND_RESIZE_SHAPE = 45;
const CODE_MIND_MAP_REQUEST_MIND_INFO = 65;
const CODE_MIND_MAP_REQUEST_NEW_MIND_MAP = 66;

const SocketCommuDelimiter = "\\";
const Nested_SocketCommuDelimiter_1 = ",";
const Nested_SocketCommuDelimiter_2 = "/";
const Nested_SocketCommuDelimiter_3 = ".";


const DB_HELPER_JS_NAME = "ThinkMineDBHelper.js";
const THINK_MINE_MAIN_PAGE_NAME = "ThinkMine_MainPage_DEV.html";
const THINK_MINE_MIND_MAP_PAGE_NAME = "ThinkMine_MindMapPage_DEV.html";

const THINK_MINE_RDWRAPPER_PARENT_SERVER_ADDR = "127.0.0.1";
const THINK_MINE_RDWRAPPER_PARENT_SOCKET_IO_SERVER_PORT = 52274;


//Server Constants
if(typeof module != "undefined"){
	if(module != null){
		module.exports.CODE_MIND_ADD = CODE_MIND_ADD;
		module.exports.CODE_MIND_DEL = CODE_MIND_DEL;
		module.exports.CODE_MIND_MOVE = CODE_MIND_MOVE;
		module.exports.CODE_MIND_PUT_INTO = CODE_MIND_PUT_INTO;
		module.exports.CODE_MIND_PULL_OUT = CODE_MIND_PULL_OUT;
		module.exports.CODE_MIND_CONNECT_TO = CODE_MIND_CONNECT_TO;
		module.exports.CODE_MIND_DISCONNECT_FROM = CODE_MIND_DISCONNECT_FROM;
		module.exports.CODE_MIND_CHANGE_COLOR_OF_CONTENTS = CODE_MIND_CHANGE_COLOR_OF_CONTENTS;
		module.exports.CODE_MIND_CHANGE_VALUE_OF_CONTENTS = CODE_MIND_CHANGE_VALUE_OF_CONTENTS;
		module.exports.CODE_MIND_CHANGE_CONTENTS = CODE_MIND_CHANGE_CONTENTS;
		module.exports.CODE_MIND_CHANGE_COLOR_OF_SHAPE = CODE_MIND_CHANGE_COLOR_OF_SHAPE;
		module.exports.CODE_MIND_CHANGE_SHAPE = CODE_MIND_CHANGE_SHAPE;
		module.exports.CODE_MIND_CHANGE_PARENT_MIND_MAP = CODE_MIND_CHANGE_PARENT_MIND_MAP;
		module.exports.CODE_MIND_RESIZE_SHAPE = CODE_MIND_RESIZE_SHAPE;
		module.exports.CODE_MIND_MAP_REQUEST_MIND_INFO = CODE_MIND_MAP_REQUEST_MIND_INFO;
		module.exports.CODE_MIND_MAP_REQUEST_NEW_MIND_MAP = CODE_MIND_MAP_REQUEST_NEW_MIND_MAP;

		module.exports.SocketCommuDelimiter = SocketCommuDelimiter;
		module.exports.Nested_SocketCommuDelimiter_1 = Nested_SocketCommuDelimiter_1;
		module.exports.Nested_SocketCommuDelimiter_2 = Nested_SocketCommuDelimiter_2;
		module.exports.Nested_SocketCommuDelimiter_3 = Nested_SocketCommuDelimiter_3;


		module.exports.DB_HELPER_JS_NAME = DB_HELPER_JS_NAME;
		module.exports.THINK_MINE_MAIN_PAGE_NAME = THINK_MINE_MAIN_PAGE_NAME;
		module.exports.THINK_MINE_MIND_MAP_PAGE_NAME = THINK_MINE_MIND_MAP_PAGE_NAME;

		module.exports.THINK_MINE_RDWRAPPER_PARENT_SERVER_ADDR = THINK_MINE_RDWRAPPER_PARENT_SERVER_ADDR;
		module.exports.THINK_MINE_RDWRAPPER_PARENT_SOCKET_IO_SERVER_PORT = THINK_MINE_RDWRAPPER_PARENT_SOCKET_IO_SERVER_PORT;
		
		module.exports.THINK_MINE_HBASE_GATE_SERVER_ADDR = "192.168.56.1";
		module.exports.THINK_MINE_HBASE_GATE_SERVER_PORT = 5000;		
		module.exports.THINK_MINE_HBASE_GATE_SYNC_INTERVAL = 50;		
	}
}
