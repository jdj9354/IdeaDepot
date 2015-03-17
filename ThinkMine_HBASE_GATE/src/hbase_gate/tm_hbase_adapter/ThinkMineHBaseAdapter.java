package hbase_gate.tm_hbase_adapter;

import hbase_gate.Constants;
import hbase_gate.JavaScriptIDL;

import java.io.IOException;
import java.io.InterruptedIOException;
import java.util.ArrayList;
import java.util.Map;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.HColumnDescriptor;
import org.apache.hadoop.hbase.HTableDescriptor;
import org.apache.hadoop.hbase.MasterNotRunningException;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.ZooKeeperConnectionException;
import org.apache.hadoop.hbase.client.Get;
import org.apache.hadoop.hbase.client.HBaseAdmin;
import org.apache.hadoop.hbase.client.HTable;
import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.client.Result;
import org.apache.hadoop.hbase.client.ResultScanner;
import org.apache.hadoop.hbase.client.RetriesExhaustedWithDetailsException;
import org.apache.hadoop.hbase.client.Scan;
import org.apache.hadoop.hbase.util.Bytes;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class ThinkMineHBaseAdapter {

	private static ThinkMineHBaseAdapter obj;

	private HBaseAdmin mHBaseAdmin;
	private Configuration mHBaseConfig;
	private ThinkMineHbaseConfigContainer mConfigContainer;

	private HTable mMindMapHTable;
	private HTable mMindObjectHTable;
	private HTable mEdgeHTable;
	private HTable mShapeHTable;
	private HTable mContentsHTable;

	private static final String TBL_MIND_MAP = "mindmap";
	private static final byte[] TBL_MIND_MAP_BYTE = Bytes.toBytes(TBL_MIND_MAP);

	private static final String[] CF_MIND_MAP = { "mind_map_id"	 , "title"			  , "parent_mind_object_id", 
												  "mind_objects" , "max_rel_distance" , "max_mind_object_count", 
												  "limit_x"		 , "limit_y"		  , "limit_z" 				};
	private static final byte[][] CF_MIND_MAP_BYTE = {
														Bytes.toBytes(CF_MIND_MAP[0]), Bytes.toBytes(CF_MIND_MAP[1]), Bytes.toBytes(CF_MIND_MAP[2]),
														Bytes.toBytes(CF_MIND_MAP[3]), Bytes.toBytes(CF_MIND_MAP[4]), Bytes.toBytes(CF_MIND_MAP[5]),
														Bytes.toBytes(CF_MIND_MAP[6]), Bytes.toBytes(CF_MIND_MAP[7]), Bytes.toBytes(CF_MIND_MAP[8]) };

	
	
	private static final String TBL_MIND_OBJECT = "mindobject";
	private static final byte[] TBL_MIND_OBJECT_BYTE = Bytes.toBytes(TBL_MIND_OBJECT);
	
	private static final String[] CF_MIND_OBJECT = { "mind_object_id"  , "child_mind_map_id", "parent_mind_map_id"	, 
													 "shape"		   , "contents"			, "x"				 	, 
													 "y"			   , "z"				, "related_mind_objects", 
													 "connected_edges" };
	private static final byte[][] CF_MIND_OBJECT_BYTE = { 
														   Bytes.toBytes(CF_MIND_OBJECT[0]), Bytes.toBytes(CF_MIND_OBJECT[1]), Bytes.toBytes(CF_MIND_OBJECT[2]), 
														   Bytes.toBytes(CF_MIND_OBJECT[3]), Bytes.toBytes(CF_MIND_OBJECT[4]), Bytes.toBytes(CF_MIND_OBJECT[5]), 
														   Bytes.toBytes(CF_MIND_OBJECT[6]), Bytes.toBytes(CF_MIND_OBJECT[7]), Bytes.toBytes(CF_MIND_OBJECT[8]), 
														   Bytes.toBytes(CF_MIND_OBJECT[9]) };

	
	
	private static final String TBL_EDGE = "edge";
	private static final byte[] TBL_EDGE_BYTE = Bytes.toBytes(TBL_EDGE);

	private static final String[] CF_EDGE = { "first_mind_object"		 , "second_mind_object", "edge_type", 
											  "edge_type_dependent_info" };
	private static final byte[][] CF_EDGE_BYTE = {  Bytes.toBytes(CF_EDGE[0]), Bytes.toBytes(CF_EDGE[1]),  Bytes.toBytes(CF_EDGE[2]),  
													Bytes.toBytes(CF_EDGE[3])};
	
	
	private static final String TBL_SHAPE = "shape";
	private static final byte[] TBL_SHAPE_BYTE = Bytes.toBytes(TBL_SHAPE);
	
	private static final String[] CF_SHAPE = { "shape_type", "shape_type_dependent_info" };
	private static final byte[][] CF_SHAPE_BYTE = { Bytes.toBytes(CF_SHAPE[0]), Bytes.toBytes(CF_SHAPE[1])};	
	

	private static final String TBL_CONTENTS = "contents";
	private static final byte[] TBL_CONTENTS_BYTE = Bytes.toBytes(TBL_CONTENTS);
	
	private static final String[] CF_CONTENTS = { "contents_type", "contents_type_dependent_info", "value" };
	private static final byte[][] CF_CONTENTS_BYTE = {  Bytes.toBytes(CF_CONTENTS[0]), Bytes.toBytes(CF_CONTENTS[1]), Bytes.toBytes(CF_CONTENTS[2]) };
	
	
	public ThinkMineHBaseAdapter getInstance(ThinkMineHbaseConfigContainer aConfigContainer) {

		if (obj == null) {
			obj = new ThinkMineHBaseAdapter(aConfigContainer);
		}
		return obj;
	}

	public void initTMTables() throws IOException {

		if (!mHBaseAdmin.isTableAvailable(TBL_MIND_MAP)) {
			HTableDescriptor tableDs = new HTableDescriptor(TBL_MIND_MAP);
			for (int i = 0; i < CF_MIND_MAP.length; i++)
				tableDs.addFamily(new HColumnDescriptor(CF_MIND_MAP[i]));
			mHBaseAdmin.createTable(tableDs);
		}

		if (!mHBaseAdmin.isTableAvailable(TBL_MIND_OBJECT)) {
			HTableDescriptor tableDs = new HTableDescriptor(TBL_MIND_OBJECT);
			for (int i = 0; i < CF_MIND_OBJECT.length; i++)
				tableDs.addFamily(new HColumnDescriptor(CF_MIND_OBJECT[i]));
			mHBaseAdmin.createTable(tableDs);
		}

		if (!mHBaseAdmin.isTableAvailable(TBL_EDGE)) {
			HTableDescriptor tableDs = new HTableDescriptor(TBL_EDGE);
			for (int i = 0; i < CF_EDGE.length; i++)
				tableDs.addFamily(new HColumnDescriptor(CF_EDGE[i]));
			mHBaseAdmin.createTable(tableDs);
		}

		if (!mHBaseAdmin.isTableAvailable(TBL_SHAPE)) {
			HTableDescriptor tableDs = new HTableDescriptor(TBL_SHAPE);
			for (int i = 0; i < CF_SHAPE.length; i++)
				tableDs.addFamily(new HColumnDescriptor(CF_SHAPE[i]));
			mHBaseAdmin.createTable(tableDs);
		}

		if (!mHBaseAdmin.isTableAvailable(TBL_CONTENTS)) {
			HTableDescriptor tableDs = new HTableDescriptor(TBL_CONTENTS);
			for (int i = 0; i < CF_CONTENTS.length; i++)
				tableDs.addFamily(new HColumnDescriptor(CF_CONTENTS[i]));
			mHBaseAdmin.createTable(tableDs);
		}

		mMindMapHTable = new HTable(mHBaseConfig, TBL_MIND_MAP);
		mMindObjectHTable = new HTable(mHBaseConfig, TBL_MIND_OBJECT);
		mEdgeHTable = new HTable(mHBaseConfig, TBL_EDGE);
		mShapeHTable = new HTable(mHBaseConfig, TBL_SHAPE);
		mContentsHTable = new HTable(mHBaseConfig, TBL_CONTENTS);
	}

	public void insertNewMindMapInfo(JSONObject aMindMapInfo) throws RetriesExhaustedWithDetailsException, InterruptedIOException {
		String mindMapId = (String) aMindMapInfo.get("MMID");
		String title = "No Title";
		String parentMindObjectId = "";
		JSONArray mindObjects = new JSONArray();
		float maxRelDistance = 300;
		int maxMindObjectCount = 100;
		float LX = 1000;
		float LY = 600;
		float LZ = 1000;

		/*
		 * Temporary Code String mindMapId = (String)aMindMapInfo.get("MMID");
		 * String title = (String)aMindMapInfo.get("TT"); String
		 * parentMindObjectId = (String)aMindMapInfo.get("PMOID"); JSONArray
		 * mindObjects = new JSONArray(); float maxRelDistance =
		 * (float)aMindMapInfo.get("MAXRD"); int maxMindObjectCount =
		 * (int)aMindMapInfo.get("MAXOC"); float LX =
		 * (float)aMindMapInfo.get("LX"); float LY =
		 * (float)aMindMapInfo.get("LY"); float LZ =
		 * (float)aMindMapInfo.get("LZ"); Temporary Code
		 */

		Put p = new Put(Bytes.toBytes(mindMapId));

		p.add(CF_MIND_MAP_BYTE[0], CF_MIND_MAP_BYTE[0], Bytes.toBytes(mindMapId));
		p.add(CF_MIND_MAP_BYTE[1], CF_MIND_MAP_BYTE[1], Bytes.toBytes(title));
		p.add(CF_MIND_MAP_BYTE[2], CF_MIND_MAP_BYTE[2], Bytes.toBytes(parentMindObjectId));
		for(int i=0; i< mindObjects.size(); i++)
			p.add(CF_MIND_MAP_BYTE[3], Bytes.toBytes((String)mindObjects.get(i)), Bytes.toBytes((String)mindObjects.get(i)));
		p.add(CF_MIND_MAP_BYTE[4], CF_MIND_MAP_BYTE[4], Bytes.toBytes(maxRelDistance));
		p.add(CF_MIND_MAP_BYTE[5], CF_MIND_MAP_BYTE[5], Bytes.toBytes(maxMindObjectCount));
		p.add(CF_MIND_MAP_BYTE[6], CF_MIND_MAP_BYTE[6], Bytes.toBytes(LX));
		p.add(CF_MIND_MAP_BYTE[7], CF_MIND_MAP_BYTE[7], Bytes.toBytes(LY));
		p.add(CF_MIND_MAP_BYTE[8], CF_MIND_MAP_BYTE[8], Bytes.toBytes(LZ));
	
		mMindMapHTable.put(p);

	}
	
	public void insertNewMindObjectInfo(JSONObject aMindObjectInfo) throws RetriesExhaustedWithDetailsException, InterruptedIOException {
		String mindObjectId = (String) aMindObjectInfo.get("MOID");
		String childMindMapId = mindObjectId;
		String parentMindMapId = (String) aMindObjectInfo.get("MMID");
		String shape = mindObjectId;
		String contents = mindObjectId;
		float x = ((Number) aMindObjectInfo.get("X")).floatValue();
		float y = ((Number) aMindObjectInfo.get("Y")).floatValue();
		float z = ((Number) aMindObjectInfo.get("Z")).floatValue();
		JSONArray relatedMindObjects = new JSONArray();
		JSONArray connectedEdges = new JSONArray();
		
		Put p = new Put(Bytes.toBytes(mindObjectId));
		
		
		p.add(CF_MIND_OBJECT_BYTE[0], CF_MIND_OBJECT_BYTE[0], Bytes.toBytes(mindObjectId));
		p.add(CF_MIND_OBJECT_BYTE[1], CF_MIND_OBJECT_BYTE[1], Bytes.toBytes(childMindMapId));
		p.add(CF_MIND_OBJECT_BYTE[2], CF_MIND_OBJECT_BYTE[2], Bytes.toBytes(parentMindMapId));
		p.add(CF_MIND_OBJECT_BYTE[3], CF_MIND_OBJECT_BYTE[3], Bytes.toBytes(shape));
		p.add(CF_MIND_OBJECT_BYTE[4], CF_MIND_OBJECT_BYTE[4], Bytes.toBytes(contents));
		p.add(CF_MIND_OBJECT_BYTE[5], CF_MIND_OBJECT_BYTE[5], Bytes.toBytes(x));
		p.add(CF_MIND_OBJECT_BYTE[6], CF_MIND_OBJECT_BYTE[6], Bytes.toBytes(y));
		p.add(CF_MIND_OBJECT_BYTE[7], CF_MIND_OBJECT_BYTE[7], Bytes.toBytes(z));
		for(int i=0; i< relatedMindObjects.size(); i++)
			p.add(CF_MIND_OBJECT_BYTE[8], Bytes.toBytes((String)relatedMindObjects.get(i)), Bytes.toBytes((String)relatedMindObjects.get(i)));
		for(int i=0; i< connectedEdges.size(); i++)
			p.add(CF_MIND_OBJECT_BYTE[9], Bytes.toBytes((String)connectedEdges.get(i)), Bytes.toBytes((String)connectedEdges.get(i)));
		
		mMindObjectHTable.put(p);
		
		
		int shapeType = ((Number) aMindObjectInfo.get("ST")).intValue();
		String shapeTypeDependentInfo = ((JSONArray) aMindObjectInfo.get("STDI")).toJSONString();
		
		p = new Put(Bytes.toBytes(mindObjectId));
		p.add(CF_EDGE_BYTE[0], CF_EDGE_BYTE[0], Bytes.toBytes(shapeType));
		p.add(CF_EDGE_BYTE[1], CF_EDGE_BYTE[1], Bytes.toBytes(shapeTypeDependentInfo));
		mShapeHTable.put(p);
		
		int contentsType = ((Number) aMindObjectInfo.get("CT")).intValue();
		String contentsTypeDependentInfo = ((JSONArray) aMindObjectInfo.get("CTDI")).toJSONString();
		String contentesValue = (String)aMindObjectInfo.get("CV");
		
		p = new Put(Bytes.toBytes(mindObjectId));
		p.add(CF_CONTENTS_BYTE[0], CF_CONTENTS_BYTE[0], Bytes.toBytes(contentsType));
		p.add(CF_CONTENTS_BYTE[1], CF_CONTENTS_BYTE[1], Bytes.toBytes(contentsTypeDependentInfo));
		p.add(CF_CONTENTS_BYTE[2], CF_CONTENTS_BYTE[2], Bytes.toBytes(contentesValue));
		mContentsHTable.put(p);
		

	}
	
	public void mindObjectCoordUpdate(JSONObject moveInfo) throws RetriesExhaustedWithDetailsException, InterruptedIOException{
		String mindMapId = (String)moveInfo.get("MMID");
		String mindObjectId = (String)moveInfo.get("MOID");
		
		int newX = ((Number) moveInfo.get("X")).intValue();
		int newY = ((Number) moveInfo.get("Y")).intValue();
		int newZ = ((Number) moveInfo.get("Z")).intValue();
		
		
		Put p = new Put(Bytes.toBytes(mindObjectId));		
		
		p.add(CF_MIND_OBJECT_BYTE[5], CF_MIND_OBJECT_BYTE[5], Bytes.toBytes(newX));
		p.add(CF_MIND_OBJECT_BYTE[6], CF_MIND_OBJECT_BYTE[6], Bytes.toBytes(newY));
		p.add(CF_MIND_OBJECT_BYTE[7], CF_MIND_OBJECT_BYTE[7], Bytes.toBytes(newZ));
		
		mMindObjectHTable.put(p);
	}

	public JSONObject fetchMindMapInfo(String aMindMapId) throws IOException, ParseException {
		JSONObject retObj = null;
		JSONParser parser = new JSONParser();

		Get get = new Get(aMindMapId.getBytes());
		Result result = mMindMapHTable.get(get);

		String retMMID = aMindMapId;

		byte[] tempQuali = Bytes.toBytes(CF_MIND_MAP[1]);
		String retTT = Bytes.toString(result.getValue(tempQuali, tempQuali));

		tempQuali = Bytes.toBytes(CF_MIND_MAP[2]);
		String retPMOID = Bytes.toString(result.getValue(tempQuali, tempQuali));

		JSONArray retCMOS = new JSONArray();

		Map<byte[], byte[]> mindObjectsFamiliy = result.getFamilyMap(Bytes.toBytes(CF_MIND_MAP[3]));

		for (Map.Entry<byte[], byte[]> entry : mindObjectsFamiliy.entrySet()) {
			JSONArray curMO = new JSONArray();

			byte[] value = entry.getValue();

			Get moGet = new Get(value);
			Result childMindObjectInfo = mMindObjectHTable.get(moGet);

			Get shapeGet = new Get(value);
			Result shapeInfo = mShapeHTable.get(shapeGet);

			Get contentsGet = new Get(value);
			Result contentsInfo = mContentsHTable.get(contentsGet);

			// mind object id
			tempQuali = Bytes.toBytes(CF_MIND_OBJECT[0]);
			value = childMindObjectInfo.getValue(tempQuali, tempQuali);
			String curObjId = Bytes.toString(value);
			curMO.add(curObjId);

			// child mind map id
			tempQuali = Bytes.toBytes(CF_MIND_OBJECT[1]);
			value = childMindObjectInfo.getValue(tempQuali, tempQuali);
			curMO.add(Bytes.toString(value));

			// x coordinate
			tempQuali = Bytes.toBytes(CF_MIND_OBJECT[5]);
			value = childMindObjectInfo.getValue(tempQuali, tempQuali);
			curMO.add(Bytes.toFloat(value));

			// y coordinate
			tempQuali = Bytes.toBytes(CF_MIND_OBJECT[6]);
			value = childMindObjectInfo.getValue(tempQuali, tempQuali);
			curMO.add(Bytes.toFloat(value));

			// z coordinate
			tempQuali = Bytes.toBytes(CF_MIND_OBJECT[7]);
			value = childMindObjectInfo.getValue(tempQuali, tempQuali);
			curMO.add(Bytes.toFloat(value));

			// shapeType
			tempQuali = Bytes.toBytes(CF_SHAPE[0]);
			value = shapeInfo.getValue(tempQuali, tempQuali);
			curMO.add(Bytes.toInt(value));

			// shapeTypeDependentInfo
			tempQuali = Bytes.toBytes(CF_SHAPE[1]);
			value = shapeInfo.getValue(tempQuali, tempQuali);			
			curMO.add((JSONArray)parser.parse(Bytes.toString(value)));

			// contentsType
			tempQuali = Bytes.toBytes(CF_CONTENTS[0]);
			value = contentsInfo.getValue(tempQuali, tempQuali);
			curMO.add(Bytes.toInt(value));

			// contentsTypeDependentInfo
			tempQuali = Bytes.toBytes(CF_CONTENTS[1]);
			value = contentsInfo.getValue(tempQuali, tempQuali);
			curMO.add((JSONArray)parser.parse(Bytes.toString(value)));

			// contentsValue
			tempQuali = Bytes.toBytes(CF_CONTENTS[2]);
			value = contentsInfo.getValue(tempQuali, tempQuali);
			curMO.add(Bytes.toString(value));

			// RelObjects
			JSONArray curMORelInfo = new JSONArray();

			tempQuali = Bytes.toBytes(CF_MIND_OBJECT[8]);
			Map<byte[], byte[]> relMindObjectsFamiliy = childMindObjectInfo.getFamilyMap(tempQuali);

			for (Map.Entry<byte[], byte[]> innerEntry : relMindObjectsFamiliy
					.entrySet()) {
				String relMOId = Bytes.toString(innerEntry.getValue());
				curMORelInfo.add(relMOId);

				StringBuilder sb = new StringBuilder();

				String edgeId = curObjId.compareTo(relMOId) > 0 ? 
								(sb.append(curObjId).append(relMOId)).toString() : 
								(sb.append(relMOId).append(curObjId)).toString();

				Get EDGEGet = new Get(Bytes.toBytes(edgeId));
				Result edgeInfo = mContentsHTable.get(EDGEGet);

				// EdgeType
				tempQuali = Bytes.toBytes(CF_EDGE[2]);
				value = edgeInfo.getValue(tempQuali, tempQuali);

				curMORelInfo.add(Bytes.toInt(value));

				// EdgeTypeDependentInfo
				tempQuali = Bytes.toBytes(CF_EDGE[3]);
				value = edgeInfo.getValue(tempQuali, tempQuali);

				curMORelInfo.add((JSONArray)parser.parse(Bytes.toString(value)));
			}

			curMO.add(curMORelInfo);

			retCMOS.add(curMO);

		}
		tempQuali = Bytes.toBytes(CF_MIND_MAP[4]);
		float retMAXRD = Bytes.toFloat(result.getValue(tempQuali, tempQuali));

		tempQuali = Bytes.toBytes(CF_MIND_MAP[5]);
		int retMAXOC = Bytes.toInt(result.getValue(tempQuali, tempQuali));

		tempQuali = Bytes.toBytes(CF_MIND_MAP[6]);
		float retLX = Bytes.toFloat(result.getValue(tempQuali, tempQuali));

		tempQuali = Bytes.toBytes(CF_MIND_MAP[7]);
		float retLY = Bytes.toFloat(result.getValue(tempQuali, tempQuali));

		tempQuali = Bytes.toBytes(CF_MIND_MAP[8]);
		float retLZ = Bytes.toFloat(result.getValue(tempQuali, tempQuali));

		retObj.put("Code", Constants.CODE_MIND_MAP_REQUEST_MIND_INFO);
		retObj.put("MMID", retMMID);
		retObj.put("TT", retTT);
		retObj.put("PMOID", retPMOID);
		retObj.put("CMOS", retCMOS);
		retObj.put("MAXRD", retMAXRD);
		retObj.put("MAXOC", retMAXOC);
		retObj.put("LX", retLX);
		retObj.put("LY", retLY);
		retObj.put("LZ", retLZ);

		return retObj;
	}

	private ThinkMineHBaseAdapter(ThinkMineHbaseConfigContainer aConfigContainer) {
		mConfigContainer = aConfigContainer;

		mHBaseConfig = HBaseConfiguration.create();

		StringBuilder sb = new StringBuilder("");
		for (int i = 0; i < mConfigContainer.mHBaseZKQuorumAddrs.length; i++) {
			sb.append(mConfigContainer.mHBaseZKQuorumAddrs[i]);
			if (i != mConfigContainer.mHBaseZKQuorumAddrs.length - 1)
				sb.append(",");
		}

		mHBaseConfig.set("hbase.master", mConfigContainer.mHBaseMasterAddr);
		mHBaseConfig.set("hbase.zookeeper.quorum", sb.toString());
		mHBaseConfig.set("hbase.zookeeper.property.clientPort",
				mConfigContainer.mHBaseZKClientPort);

		try {
			mHBaseAdmin = new HBaseAdmin(mHBaseConfig);
		} catch (MasterNotRunningException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			System.exit(1);
		} catch (ZooKeeperConnectionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			System.exit(1);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			System.exit(1);
		}

	}
}
