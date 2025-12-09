import React, { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  Avatar,
  Paper,
} from '@material-ui/core';
import { Send as SendIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { RootState } from '../../../store/store.interface';
import { useReduxDispatch } from '../../../store/helpers';
import { sendMessage, markAsRead } from '../../../store/chat/thunks/messages';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  messages: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  messageInput: {
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    gap: theme.spacing(1),
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(2),
    maxWidth: '70%',
    marginBottom: theme.spacing(1),
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(2),
    maxWidth: '70%',
    marginBottom: theme.spacing(1),
  },
  systemMessage: {
    alignSelf: 'center',
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    marginBottom: theme.spacing(1),
  },
}));

export const ChatWindow: FC = () => {
  const classes = useStyles();
  const dispatch = useReduxDispatch();
  const { activeRoom, messages } = useSelector((state: RootState) => state.chat);
  const { id: userId } = useSelector((state: RootState) => state.user.userData);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roomMessages = activeRoom ? messages[activeRoom.id] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages]);

  useEffect(() => {
    if (activeRoom) {
      dispatch(markAsRead(activeRoom.id));
    }
  }, [activeRoom, dispatch]);

  const handleSend = async () => {
    if (!messageText.trim() || !activeRoom) return;

    try {
      await dispatch(sendMessage({ roomId: activeRoom.id, content: messageText }));
      setMessageText('');
    } catch (e) {
      console.error('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeRoom) return null;

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h6">{activeRoom.name}</Typography>
        <Typography variant="caption" color="textSecondary">
          {activeRoom.participants.length} participants
        </Typography>
      </Box>

      <Box className={classes.messages}>
        {roomMessages.map((message) => {
          if (message.type === 'system') {
            return (
              <Typography key={message.id} className={classes.systemMessage}>
                {message.content}
              </Typography>
            );
          }

          const isMyMessage = message.senderId === userId;
          return (
            <Paper
              key={message.id}
              className={isMyMessage ? classes.myMessage : classes.otherMessage}
              elevation={1}
            >
              {!isMyMessage && (
                <Typography variant="caption" display="block">
                  {message.senderName}
                </Typography>
              )}
              <Typography variant="body2">{message.content}</Typography>
              <Typography variant="caption" display="block" style={{ fontSize: '0.7rem' }}>
                {new Date(message.createdAt).toLocaleTimeString()}
              </Typography>
            </Paper>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      <Box className={classes.messageInput}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={3}
        />
        <IconButton color="primary" onClick={handleSend} disabled={!messageText.trim()}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatWindow;

