package hbase_gate;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.EOFException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;
import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.json.simple.JSONObject;
import org.json.simple.JSONValue;



public class DataReceiver {
	protected static DataReceiver obj = null;
	private ExecutorService mEs;
	
	
	private DataReceiver (){
		try {
			initiateNonBlockingSocket();
			
			
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			System.out.println("Failed to initiate data incoming server socket");
			System.exit(1);
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			System.out.println("Failed to initiate data incoming server socket");
			System.exit(1);
		}
	}
	
	
	public DataReceiver getInstance(DataCommCallBack aCrudDelegate){
		if(obj == null)
			obj = new DataReceiver();
		return obj;
	}
	
	
	private void initiateNonBlockingSocket() throws InterruptedException,ExecutionException{	
		
		mEs =  new ThreadPoolExecutor(10, Constants.SOCKET_THREAD_POOL_MAXIMUM_SIZE, 1, TimeUnit.MINUTES, (BlockingQueue<Runnable>) new ArrayBlockingQueue<Runnable>(10, true));
		mEs.execute(new DataReceiverInitRunnable());		
	}
	
	
	private class DataReceiverInitRunnable implements Runnable {		
		
		private ServerSocket mDataIncomeLSocket = null;	
		private ArrayList<Socket> mDataIncomeSocketArr = null;


		@Override
		public void run() {
			try {
				mDataIncomeLSocket = new ServerSocket(Constants.DATA_INCOME_PORT);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				System.exit(1);
			}
			
			
			while(true){
				
				Socket curSocket;
				
				
				try {
					curSocket = mDataIncomeLSocket.accept();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					continue;
				}
				
				
				DataReceiverCommRunnable curRunnable = new DataReceiverCommRunnable(curSocket);
				
				try {
					mEs.execute(curRunnable);
				} catch (RejectedExecutionException re) {
					// TODO: handle exception
					handleRejectException(re,curRunnable);
					continue;
				} finally{
					;
				}
				curRunnable.sendConnectionSuccessMessage();
				
			}
			
		}
		
		
		private void handleRejectException(RejectedExecutionException re, DataReceiverCommRunnable rejectedRunnable){
			
			re.printStackTrace();			

			rejectedRunnable.sendConnectionFaileMessage();
			rejectedRunnable.closeSocketAndAllStreams();
			
		}


	}
	
	
	private class DataReceiverCommRunnable implements Runnable{
		private Socket mSocketRef = null;
		
		private InputStream iin = null;
		private DataInputStream idis = null;
		private InputStreamReader iisr = null;
		private OutputStream iout = null;
		private DataOutputStream idos = null;
		
		public DataReceiverCommRunnable(Socket aSocketRef) {
			super();
			
			mSocketRef = aSocketRef;
			
			try {
				iin = mSocketRef.getInputStream();	
				idis = new DataInputStream(iin);
				iisr = new InputStreamReader(iin,"UTF-8");
				iout = mSocketRef.getOutputStream();
				idos = new DataOutputStream(iout);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		

		@Override
		public void run() {
			while(true){
				char[] readChar = new char[1];
				String stringOfAddrPortRet;
				String[] infoOfAddrPortRet;
				
				StringBuilder sb = new StringBuilder("");
				
				while(true){
					try {
						iisr.read(readChar);
						//System.out.println(rdis.readUTF());
						//readByte = rdis.readByte();
					} catch (EOFException e){
						break;
					} catch (IOException e) {
						System.out.println("Error occured....");
						
						e.printStackTrace();
						return;
					}				
					sb = sb.append(readChar);			
				}
				JSONObject jObj = (JSONObject) JSONValue.parse(sb.toString());
				int opCode = Integer.parseInt((String)jObj.get("Code"));
				
	
				
				switch(opCode){
				case Constants.CODE_MIND_ADD :
					break;
				case Constants.CODE_MIND_DEL :
					break;
				case Constants.CODE_MIND_MOVE :
					break;
				case Constants.CODE_MIND_PUT_INTO :
					break;
				case Constants.CODE_MIND_CONNECT_TO :
					break;
				case Constants.CODE_MIND_DISCONNECT_FROM :
					break;
				case Constants.CODE_MIND_CHANGE_COLOR_OF_CONTENTS :
					break;
				case Constants.CODE_MIND_CHANGE_COLOR_OF_SHAPE :
					break;
				case Constants.CODE_MIND_RESIZE_SHAPE :
					break;
				case Constants.CODE_MIND_MAP_REQUEST_MIND_INFO :
					break;
				}
				
			}
			
		}
		
		public void sendConnectionSuccessMessage(){
			;
		}
		
		public void sendConnectionFaileMessage(){
			;
		}
		public void closeSocketAndAllStreams(){
			try {
				iin.close();
				iin = null;
				idis.close();
				idis = null;
				iisr.close();
				iisr = null;
				iout.close();
				iout = null;
				idos.close();
				idos = null;
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
	}
	
	
	
}
