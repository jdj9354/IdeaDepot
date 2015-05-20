<?php


class maxButtonsAdmin
{
	
	protected $wpdb; 
	protected static $instance = null; 
	
	function __construct()
	{
		global $wpdb; 
		$this->wpdb = $wpdb;
	}
	
	public static function getInstance()
	{
		if (is_null(self::$instance)) 
			self::$instance = new maxButtonsAdmin(); 
		
		return self::$instance; 
	
	}


	/* Get multiple buttons 
	
		Used for overview pages, retrieve buttons on basis of passed arguments. 
		
		@return array Array of found buttons with argument
	*/	
	
	function getButtons($args = array())
	{
		
		$defaults = array(
			"status" => "publish", 
			"orderby" => "", 
			"order" => "asc",
			"limit" => 20, 
			"paged" => 1, 
		);
		$args = wp_parse_args($args, $defaults); 
		
		$limit = intval($args["limit"]); 
		$page = intval($args["paged"]);
		
		$sql = "SELECT id FROM " . maxButtonsUtils::get_buttons_table_name() . " WHERE status = '%s'"; 
		if ($args["orderby"] != '')
			$sql .=  " ORDER BY "  . $args["orderby"] . " " . $args["order"]; 
	 
	 	if ($limit > 0) 
	 	{
	 		//$total = $this->getButtonCount(array("status" => $args["status"])); 
	 		if ($page == 1 ) 
	 			$offset = 0; 
	 		else 
	 			$offset = ($page-1) * $limit;
	 		
	 		$sql .= " LIMIT $offset, $limit "; 
		}
		
		$sql = $this->wpdb->prepare($sql, $args["status"], ARRAY_A); 
	//echo $sql;
		$buttons = $this->wpdb->get_results($sql, ARRAY_A);
		return $buttons;
		
	}
	
	function getButtonCount($args)
	{
		$defaults = array(
			"status" => "publish", 
 
		);
		$args = wp_parse_args($args, $defaults); 
		
		$sql = "SELECT count(id) FROM " . maxButtonsUtils::get_buttons_table_name() . " WHERE status = '%s'"; 
		$sql = $this->wpdb->prepare($sql, $args["status"] ); 
		$result = $this->wpdb->get_var($sql);
		return $result;
		
	}
	
	function getButtonPages($args)
	{
		$defaults = array(
			"limit" => 20, 
			"paged" => 1, 
			"status" => "publish", 
			"output" => "list", 			// not used, future arg. 
			"view" => "all",

		);

		$args = wp_parse_args($args, $defaults); 
 		
 
		$limit = intval($args["limit"]); 
		$page = intval($args["paged"]); 
		$view = $args["view"];

		$total = $this->getButtonCount(array("status" => $args["status"])); 
		
		$num_pages = ceil($total / $limit); 
		if ($num_pages == 1) 
			return ''; 
		
		$output = ''; 
		$url = $_SERVER['REQUEST_URI'];
		$url = remove_query_arg("view", $url); 
		$url = add_query_arg("view",$view, $url);

		for ($i = 1; $i <= $num_pages; $i++)
		{
			//$active =? "class='active'" : ''; 
			if  ($i == $page) 
			{
				$output .= "<li class='active'><span>" . $i . "</span></li>"; 
			}
			else
			{
				$link = add_query_arg('paged',$i, $url);
				$output .= "<li><a href='$link'>" . $i . "</a></li>"; 
			}
		}
		return $output;
	}
	



}
