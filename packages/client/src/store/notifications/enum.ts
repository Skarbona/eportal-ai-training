export enum NotificationsEnum {
  InitFetchNotifications = 'INIT_FETCH_NOTIFICATIONS',
  SuccessFetchNotifications = 'SUCCESS_FETCH_NOTIFICATIONS',
  FailFetchNotifications = 'FAIL_FETCH_NOTIFICATIONS',
  
  AddNotification = 'ADD_NOTIFICATION',
  MarkAsRead = 'MARK_AS_READ',
  MarkAllAsRead = 'MARK_ALL_AS_READ',
  DeleteNotification = 'DELETE_NOTIFICATION',
  
  UpdateUnreadCount = 'UPDATE_UNREAD_COUNT',
  CleanNotificationsAlerts = 'CLEAN_NOTIFICATIONS_ALERTS',
  
  // TODO: Add actions for batch operations
  // BatchMarkAsRead = 'BATCH_MARK_AS_READ',
  // BatchDelete = 'BATCH_DELETE',
}

