export enum ChatEnum {
  InitFetchRooms = 'INIT_FETCH_ROOMS',
  SuccessFetchRooms = 'SUCCESS_FETCH_ROOMS',
  FailFetchRooms = 'FAIL_FETCH_ROOMS',
  
  InitFetchMessages = 'INIT_FETCH_MESSAGES',
  SuccessFetchMessages = 'SUCCESS_FETCH_MESSAGES',
  FailFetchMessages = 'FAIL_FETCH_MESSAGES',
  
  SetActiveRoom = 'SET_ACTIVE_ROOM',
  AddMessage = 'ADD_MESSAGE',
  UpdateMessage = 'UPDATE_MESSAGE',
  DeleteMessage = 'DELETE_MESSAGE',
  
  CreateRoom = 'CREATE_ROOM',
  AddRoom = 'ADD_ROOM',
  
  UpdateUnreadCount = 'UPDATE_UNREAD_COUNT',
  ClearUnreadCount = 'CLEAR_UNREAD_COUNT',
  
  CleanChatAlerts = 'CLEAN_CHAT_ALERTS',
}

