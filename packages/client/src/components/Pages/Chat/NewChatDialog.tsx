import React, { FC, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Checkbox,
  Typography,
} from '@material-ui/core';

import { useReduxDispatch } from '../../../store/helpers';
import { createRoom } from '../../../store/chat/thunks/rooms';
import { searchUsers } from '../../../store/chat/thunks/rooms';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const NewChatDialog: FC<Props> = ({ open, onClose }) => {
  const dispatch = useReduxDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [roomName, setRoomName] = useState('');

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      const users = await dispatch(searchUsers(query));
      setSearchResults(users || []);
    } else {
      setSearchResults([]);
    }
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  };

  const handleCreate = async () => {
    if (selectedUsers.length === 0) return;

    const type = selectedUsers.length === 1 ? 'private' : 'group';
    const name = roomName || `Chat ${Date.now()}`;

    try {
      await dispatch(createRoom({ name, type, participants: selectedUsers }));
      onClose();
      // Reset state
      setSearchQuery('');
      setSearchResults([]);
      setSelectedUsers([]);
      setRoomName('');
    } catch (e) {
      console.error('Failed to create chat');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Chat</DialogTitle>
      <DialogContent>
        {selectedUsers.length > 1 && (
          <TextField
            fullWidth
            label="Chat Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            margin="normal"
          />
        )}

        <TextField
          fullWidth
          label="Search Users"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          margin="normal"
          placeholder="Type at least 2 characters..."
        />

        {searchResults.length > 0 && (
          <List>
            {searchResults.map((user) => (
              <ListItem key={user.id} button onClick={() => toggleUser(user.id)}>
                <Checkbox checked={selectedUsers.includes(user.id)} />
                <ListItemAvatar>
                  <Avatar>{user.name?.charAt(0).toUpperCase()}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.name} secondary={user.email} />
              </ListItem>
            ))}
          </List>
        )}

        {searchQuery.length >= 2 && searchResults.length === 0 && (
          <Typography variant="body2" color="textSecondary" style={{ padding: '16px' }}>
            No users found
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate} color="primary" disabled={selectedUsers.length === 0}>
          Create Chat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewChatDialog;

