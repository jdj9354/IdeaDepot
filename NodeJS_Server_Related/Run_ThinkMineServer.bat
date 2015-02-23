start node NodeJS_ThinkMineServer.js

set CRUDPATH=%cd%\ThinkMineRoomCRUD.js

cd RoomFramework_Server
start node RDWrapper_ParentServer.js
start node RDWrapper_ChildServer.js 10001 10002 %CRUDPATH%
start node RDWrapper_ChildServer.js 10003 10004 %CRUDPATH%
start node RDWrapper_ChildServer.js 10005 10006 %CRUDPATH%
start node RDWrapper_ChildServer.js 10007 10008 %CRUDPATH%
start node RDWrapper_ChildServer.js 10009 10010 %CRUDPATH%
cd..
