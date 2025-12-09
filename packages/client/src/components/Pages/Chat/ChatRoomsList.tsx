import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  IconButton,
  Badge,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { RootState } from '../../../store/store.interface';
import { useReduxDispatch } from '../../../store/helpers';
import { setActiveRoom } from '../../../store/chat/action';
import { fetchMessages } from '../../../store/chat/thunks/messages';
import NewChatDialog from './NewChatDialog';

const useStyles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomsList: {
    height: 'calc(100% - 70px)',
    overflow: 'auto',
  },
  activeRoom: {
    backgroundColor: theme.palette.action.selected,
  },
}));

export const ChatRoomsList: FC = () => {
  const classes = useStyles();
  const dispatch = useReduxDispatch();
  const { rooms, activeRoom, unreadCounts } = useSelector((state: RootState) => state.chat);
  const [newChatOpen, setNewChatOpen] = useState(false);

  const handleRoomClick = (room: typeof rooms[0]) => {
    dispatch(setActiveRoom(room));
    dispatch(fetchMessages(room.id));
  };

  const formatLastMessage = (message?: string) => {
    if (!message) return 'No messages yet';
    return message.length > 50 ? `${message.substring(0, 50)}...` : message;
  };

  return (
    <>
      <Box className={classes.header}>
        <Typography variant="h6">Chats</Typography>
        <IconButton size="small" onClick={() => setNewChatOpen(true)}>
          <AddIcon />
        </IconButton>
      </Box>
      <List className={classes.roomsList}>
        {rooms.map((room) => (
          <ListItem
            key={room.id}
            button
            onClick={() => handleRoomClick(room)}
            className={activeRoom?.id === room.id ? classes.activeRoom : ''}
          >
            <ListItemAvatar>
              <Avatar>{room.name.charAt(0).toUpperCase()}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Badge badgeContent={unreadCounts[room.id] || 0} color="secondary">
                  {room.name}
                </Badge>
              }
              secondary={formatLastMessage(room.lastMessage)}
            />
          </ListItem>
        ))}
      </List>
      <NewChatDialog open={newChatOpen} onClose={() => setNewChatOpen(false)} />
    </>
  );
};

export default ChatRoomsList;

