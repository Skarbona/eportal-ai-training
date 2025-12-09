import React, { FC } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { LeaderboardEntry } from '../../../models/leaderboard';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  rankCell: {
    fontWeight: 600,
    fontSize: '1.1rem',
  },
  gold: {
    color: '#FFD700',
    fontSize: '1.5rem',
  },
  silver: {
    color: '#C0C0C0',
    fontSize: '1.5rem',
  },
  bronze: {
    color: '#CD7F32',
    fontSize: '1.5rem',
  },
  currentUser: {
    backgroundColor: theme.palette.action.selected,
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    backgroundColor: theme.palette.primary.main,
  },
  usernameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  pointsChip: {
    fontWeight: 600,
  },
}));

interface Props {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export const LeaderboardTable: FC<Props> = ({ entries, currentUserId }) => {
  const classes = useStyles();

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return <span className={classes.gold}>🥇</span>;
    if (rank === 2) return <span className={classes.silver}>🥈</span>;
    if (rank === 3) return <span className={classes.bronze}>🥉</span>;
    return `#${rank}`;
  };

  if (!entries || entries.length === 0) {
    return (
      <Typography variant="body1" align="center" style={{ padding: '2rem' }}>
        No leaderboard data available yet. Start playing to appear on the leaderboard!
      </Typography>
    );
  }

  return (
    <TableContainer>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Player</TableCell>
            <TableCell align="right">Points</TableCell>
            <TableCell align="right">Games Played</TableCell>
            <TableCell align="right">Avg. Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => (
            <TableRow
              key={entry.userId}
              className={entry.userId === currentUserId ? classes.currentUser : ''}
            >
              <TableCell className={classes.rankCell}>{getRankDisplay(entry.rank)}</TableCell>
              <TableCell>
                <div className={classes.usernameCell}>
                  <Avatar className={classes.avatar}>
                    {entry.username?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body1">{entry.username}</Typography>
                  {entry.userId === currentUserId && (
                    <Chip label="You" size="small" color="primary" />
                  )}
                </div>
              </TableCell>
              <TableCell align="right">
                <Chip
                  label={entry.totalPoints.toLocaleString()}
                  className={classes.pointsChip}
                  color="primary"
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="right">{entry.gamesPlayed}</TableCell>
              <TableCell align="right">
                {entry.averageTime ? `${Math.round(entry.averageTime)}s` : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeaderboardTable;

