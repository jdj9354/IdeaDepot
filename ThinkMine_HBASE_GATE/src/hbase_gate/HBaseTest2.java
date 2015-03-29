package hbase_gate;

import java.util.Map;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.HColumnDescriptor;
import org.apache.hadoop.hbase.HTableDescriptor;
import org.apache.hadoop.hbase.client.Get;
import org.apache.hadoop.hbase.client.HBaseAdmin;
import org.apache.hadoop.hbase.client.HTable;
import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.client.Result;
import org.apache.hadoop.hbase.client.ResultScanner;
import org.apache.hadoop.hbase.client.Scan;
import org.apache.hadoop.hbase.util.Bytes;
import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;




public class HBaseTest2 {




	public static void main(String[] args) {
		DataReceiver dr = DataReceiver.getInstance();
		
		/*String Test = "[1,\"computer\"]";
		JSONParser parser = new JSONParser();
		JSONArray test = null;
		try {
			test = (JSONArray)parser.parse(Test);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		for(int i=0; i<test.size();i++)
			System.out.println(test.get(i));*/
		/*Configuration config = HBaseConfiguration.create();

		config.set("hbase.master", "127.0.0.1"); 
		config.set("hbase.zookeeper.quorum", "127.0.0.1");
		config.set("hbase.zookeeper.property.clientPort","2181");


		try {

			HBaseAdmin hBaseAdmin = new HBaseAdmin(config);



			if (hBaseAdmin.isTableAvailable("key1") == false) {

				HTableDescriptor tableDs = new HTableDescriptor("key1");

				tableDs.addFamily(new HColumnDescriptor("cf"));

				hBaseAdmin.createTable(tableDs);

			} else {

				hBaseAdmin.disableTable("key1");

				hBaseAdmin.deleteTable("key1");




				HTableDescriptor tableDs = new HTableDescriptor("key1");

				tableDs.addFamily(new HColumnDescriptor("cf"));
				

				hBaseAdmin.createTable(tableDs);

			}

			

			HTable hTable = new HTable(config, "key1");

			

			Put p = new Put(Bytes.toBytes("row1"));

			p.add(Bytes.toBytes("cf"), Bytes.toBytes("a"), Bytes.toBytes("value1"));
		//	p.add(Bytes.toBytes("dcftest"), Bytes.toBytes("da"), Bytes.toBytes("dvalue1"));
			hTable.put(p);

			

			p = new Put(Bytes.toBytes("row2"));

			p.add(Bytes.toBytes("cf"), Bytes.toBytes("b"), Bytes.toBytes("value2"));

			hTable.put(p);

			

			p = new Put(Bytes.toBytes("row3"));

			p.add(Bytes.toBytes("cf"), Bytes.toBytes("c"), Bytes.toBytes("value3"));
			p.add(Bytes.toBytes("cf"), Bytes.toBytes("d"), Bytes.toBytes("value4"));

			hTable.put(p);

		

			Scan s = new Scan();
			
			Get get = new Get(Bytes.toBytes("row3"));
			Result result = hTable.get(get);
			
			Map<byte[],byte[]> family = result.getFamilyMap(Bytes.toBytes("cf"));
		
			
			for(Map.Entry<byte[],byte[]> entry : family.entrySet()) {
				   byte [] qualifier = entry.getKey();
				   byte [] value = entry.getValue();
				   System.out.println("qualifier: " + Bytes.toString(qualifier));
				   System.out.println("Value: " + Bytes.toString(value));
				}
			
			byte[] val = result.getValue(Bytes.toBytes("cf"), Bytes.toBytes("c"));
			//System.out.println("Value: " + Bytes.toString(val));
			
			ResultScanner scanner = hTable.getScanner(Bytes.toBytes("cf"),Bytes.toBytes("d"));

			

			try {

				for (Result rowResult = scanner.next(); rowResult != null; rowResult = scanner.next()) {

					System.out.println("row: " + rowResult);

				}

			} finally {

				scanner.close();

			}

			

			hTable.close();

			hBaseAdmin.close();

		} catch (Exception e) {

			e.printStackTrace();

		}*/

	}

	

}

