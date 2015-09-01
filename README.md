thinkmine
=========

Idea creation tool.

How to use

-------------------- Real Time Communication --------------------------------

1. Set up HBASE Environment on Ubuntu 
2. Create new Java project by importing ThinkMine_HBASE_GATE.
3. Run ThinkMine HBASE GATE
4. Set Address, Port of each servers
   1) Room Framework Parent Server IP Address and Port
   2) Media Server IP Address
   3) Web Preview Server Port Address (Share IP Address with Media Server)
5. Run ThinkMine Server by executing 'NodeJS_Server_Related/Run_ThinkMineServer.bat'



-------------------- Web Contents -------------------------------------------

1. Set up APM (Apache,PHP,MySQL) environment
2. Set WebContent\ThinkMine directory as root path and Common directory as Common alias on the Apache2 set up
   (/etc/apache2/sites-available/default)

   
-------------------- WordPress Settings -------------------------------------
1. Set basic mysql database environment for WordPress
2. Set OneCommunity as main theme
3. Activate wordpress Plugins
   (bbpress, BuddyPress, CKEditor for WordPress, MaxButtons, NextGen Gallery, WooCommerce,WPtouch Mobile Plugin)
4. Enable all of options of the BuddyPress except for 'Site Tracking'
5. Set permalink as Post name
   