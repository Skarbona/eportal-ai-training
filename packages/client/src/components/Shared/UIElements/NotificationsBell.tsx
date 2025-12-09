import React, { FC } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
} from '@material-ui/core';
import { Notifications as NotificationsIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { RootState } from '../../../store/store.interface';
import { useReduxDispatch } from '../../../store/helpers';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../../store/notifications/thunks/notifications';

const useStyles = makeStyles((theme) => ({
  menu: {
    maxWidth: 400,
    minWidth: 320,
  },
  menuItem: {
    whiteSpace: 'normal',
    padding: theme.spacing(2),
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  unread: {
    backgroundColor: theme.palette.action.selected,
  },
  header: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyState: {
    padding: theme.spacing(4),
    textAlign: 'center',
  },
}));

// TODO: Move to separate component file
export const NotificationsBell: FC = () => {
  const classes = useStyles();
  const dispatch = useReduxDispatch();
  const { notifications, unreadCount } = useSelector((state: RootState) => state.notifications);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    dispatch(fetchNotifications(10, 0, false));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notificationId: string, read: boolean) => {
    if (!read) {
      dispatch(markNotificationAsRead(notificationId));
    }
    // TODO: Handle navigation based on notification type
    // const notification = notifications.find(n => n.id === notificationId);
    // if (notification.type === 'new_message') {
    //   history.push(`/chat?room=${notification.data.roomId}`);
    // }
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  // TODO: Add time formatting helper (e.g., "2 hours ago")
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        classes={{ paper: classes.menu }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box className={classes.header}>
          <Typography variant="h6">Notifications</Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={handleMarkAllAsRead}>
              Mark all read
            </Button>
          )}
        </Box>
        <Divider />

        {notifications.length === 0 ? (
          <Box className={classes.emptyState}>
            <Typography variant="body2" color="textSecondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          notifications.slice(0, 10).map((notification) => (
            <MenuItem
              key={notification.id}
              className={`${classes.menuItem} ${!notification.read ? classes.unread : ''}`}
              onClick={() => handleNotificationClick(notification.id, notification.read)}
            >
              <Box>
                <Typography variant="subtitle2">{notification.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {formatTime(notification.createdAt)}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}

        {/* TODO: Add "View All" button that navigates to notifications page */}
        {/* <Divider />
        <Box style={{ padding: '8px', textAlign: 'center' }}>
          <Button fullWidth onClick={() => history.push('/notifications')}>
            View All Notifications
          </Button>
        </Box> */}
      </Menu>
    </>
  );
};

export default NotificationsBell;

