package RoomInterface;

import java.util.ArrayList;

import MessageItem.MessageItemTypeException;
import MessageItem.MessageItems;
import MessageItem.MessageItem;

public class RoomRealtedFunctions {
	
	private static final String SPACE_DELIMITER = " ";
	
	public static void clientMessageCallbackImplementation(String Message){
		MessageItems receivedMessage = new MessageItems(Message){

			@Override
			public void stringParser(String inputString,
					ArrayList<MessageItem> outputArray) {
				String[] inputStringArr = inputString.split(SPACE_DELIMITER);
				
				for(int i=0; i < inputStringArr.length; i++){
					MessageItem newItem = new MessageItem(inputStringArr[i]);
					outputArray.add(newItem);					
				}
				
			}
			
		};
		
		for(int i=0; i<receivedMessage.size(); i++){
			try {
				System.out.println(receivedMessage.get(i).getStringMessage());
			} catch (MessageItemTypeException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
}
