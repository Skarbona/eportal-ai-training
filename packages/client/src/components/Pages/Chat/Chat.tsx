import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { RootState } from '../../../store/store.interface';
import { useReduxDispatch } from '../../../store/helpers';
import { fetchRooms } from '../../../store/chat/thunks/messages';
import ChatRoomsList from './ChatRoomsList';
import ChatWindow from './ChatWindow';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 'calc(100vh - 120px)',
    margin: theme.spacing(2),
  },
  roomsList: {
    height: '100%',
    overflow: 'hidden',
  },
  chatWindow: {
    height: '100%',
  },
}));

export const Chat: FC = () => {
  const classes = useStyles();
  const dispatch = useReduxDispatch();
  const { activeRoom } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item xs={12} md={4} className={classes.roomsList}>
        <Paper style={{ height: '100%' }}>
          <ChatRoomsList />
        </Paper>
      </Grid>
      <Grid item xs={12} md={8} className={classes.chatWindow}>
        <Paper style={{ height: '100%' }}>
          {activeRoom ? (
            <ChatWindow />
          ) : (
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Select a chat to start messaging
            </div>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Chat;

