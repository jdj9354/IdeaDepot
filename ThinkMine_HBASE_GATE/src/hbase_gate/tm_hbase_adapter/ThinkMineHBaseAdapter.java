package hbase_gate.tm_hbase_adapter;

import java.io.IOException;

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
import org.apache.hadoop.hbase.client.Result;
import org.apache.hadoop.hbase.client.ResultScanner;
import org.apache.hadoop.hbase.client.Scan;
import org.apache.hadoop.hbase.util.Bytes;
import org.json.simple.JSONObject;

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
	private static final String[] CF_MIND_MAP = {
																							"mind_map_id",
																							"title",
																							"parent_mind_object_id",
																							"mind_objects",
																							"max_rel_distance",
																							"max_mind_object_count",
																							"limit_x",
																							"limit_y",
																							"limit_z"
																							};
	
	private static final String TBL_MIND_OBJECT = "mindobject";
	private static final byte[] TBL_MIND_OBJECT_BYTE = Bytes.toBytes(TBL_MIND_OBJECT);
	private static final String[] CF_MIND_OBJECT = {
																									"mind_object_id",
																									"child_mind_map_id",
																									"parent_mind_map_id",
																									"shape",
																									"contents",																									
																									"x",
																									"y",
																									"z"
																									};
	
	
	private static final String TBL_EDGE = "edge";	
	private static final byte[] TBL_EDGE_BYTE = Bytes.toBytes(TBL_EDGE);
	private static final String[] CF_EDGE = {
																						"first_mind_object",
																						"second_mind_object",
																						"edge_type",
																						"edge_type_dependent_info"
																					};
	
	private static final String TBL_SHAPE = "shape";
	private static final byte[] TBL_SHAPE_BYTE = Bytes.toBytes(TBL_SHAPE);
	private static final String[] CF_SHAPE = {
																							"shape_type",
																							"shape_type_dependent_info"
																						};
	
	private static final String TBL_CONTENTS = "contents";
	private static final byte[] TBL_CONTENTS_BYTE = Bytes.toBytes(TBL_CONTENTS);
	private static final String[] CF_CONTENTS = {
																								"contents_type",
																								"contents_type_dependent_info"
																							};
	
	public ThinkMineHBaseAdapter getInstance(ThinkMineHbaseConfigContainer aConfigContainer){
		
		if(obj == null){
			obj = new ThinkMineHBaseAdapter(aConfigContainer);
		}
		return obj;
	}
	
	public void initTMTables() throws IOException{

		if(!mHBaseAdmin.isTableAvailable(TBL_MIND_MAP)){
			HTableDescriptor tableDs = new HTableDescriptor(TBL_MIND_MAP);
			for(int i=0; i<CF_MIND_MAP.length; i++)
				tableDs.addFamily(new HColumnDescriptor(CF_MIND_MAP[i]));
			mHBaseAdmin.createTable(tableDs);
		}
		
		if(!mHBaseAdmin.isTableAvailable(TBL_MIND_OBJECT)){
			HTableDescriptor tableDs = new HTableDescriptor(TBL_MIND_OBJECT);
			for(int i=0; i<CF_MIND_OBJECT.length; i++)
				tableDs.addFamily(new HColumnDescriptor(CF_MIND_OBJECT[i]));
			mHBaseAdmin.createTable(tableDs);
		}
		
		if(!mHBaseAdmin.isTableAvailable(TBL_EDGE)){
			HTableDescriptor tableDs = new HTableDescriptor(TBL_EDGE);
			for(int i=0; i<CF_EDGE.length; i++)
				tableDs.addFamily(new HColumnDescriptor(CF_EDGE[i]));
			mHBaseAdmin.createTable(tableDs);
		}
		
		if(!mHBaseAdmin.isTableAvailable(TBL_SHAPE)){
			HTableDescriptor tableDs = new HTableDescriptor(TBL_SHAPE);
			for(int i=0; i<CF_SHAPE.length; i++)
				tableDs.addFamily(new HColumnDescriptor(CF_SHAPE[i]));
			mHBaseAdmin.createTable(tableDs);
		}
		
		if(!mHBaseAdmin.isTableAvailable(TBL_CONTENTS)){
			HTableDescriptor tableDs = new HTableDescriptor(TBL_CONTENTS);
			for(int i=0; i<CF_CONTENTS.length; i++)
				tableDs.addFamily(new HColumnDescriptor(CF_CONTENTS[i]));
			mHBaseAdmin.createTable(tableDs);
		}
		
		mMindMapHTable = new HTable(mHBaseConfig, TBL_MIND_MAP);
		mMindObjectHTable = new HTable(mHBaseConfig, TBL_MIND_OBJECT);
		mEdgeHTable = new HTable(mHBaseConfig, TBL_EDGE);
		mShapeHTable = new HTable(mHBaseConfig, TBL_SHAPE);
		mContentsHTable = new HTable(mHBaseConfig, TBL_CONTENTS);
	}
	
	
	public JSONObject patchMindMapInfo(String aMindMapId) throws IOException{
		JSONObject retObj = null;
		

		Get get = new Get(aMindMapId.getBytes());
		Result result = mMindMapHTable.get(get);
		
		return retObj;
	}
	
	
	private ThinkMineHBaseAdapter(ThinkMineHbaseConfigContainer aConfigContainer){
		mConfigContainer = aConfigContainer;
		
		mHBaseConfig = HBaseConfiguration.create();	
		
		
		StringBuilder sb = new StringBuilder("");	
		for(int i=0; i< mConfigContainer.mHBaseZKQuorumAddrs.length; i++){
			sb.append(mConfigContainer.mHBaseZKQuorumAddrs[i]);
			if(i != mConfigContainer.mHBaseZKQuorumAddrs.length -1)
				sb.append(",");
		}		
		
		mHBaseConfig.set("hbase.master", mConfigContainer.mHBaseMasterAddr);		
		mHBaseConfig.set("hbase.zookeeper.quorum", sb.toString());
		mHBaseConfig.set("hbase.zookeeper.property.clientPort",mConfigContainer.mHBaseZKClientPort);
		
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
