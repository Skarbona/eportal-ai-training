import React, { FC } from 'react';
import { Paper, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TrendingUp, TrendingDown } from '@material-ui/icons';
import { UserRank } from '../../../models/leaderboard';

const useStyles = makeStyles((theme) => ({
  badge: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    backgroundColor: theme.palette.primary.light,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rankInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  rank: {
    fontSize: '2rem',
    fontWeight: 700,
    color: theme.palette.primary.dark,
  },
  points: {
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  trendingUp: {
    color: theme.palette.success.main,
  },
  trendingDown: {
    color: theme.palette.error.main,
  },
}));

interface Props {
  userRank: UserRank;
}

export const UserRankBadge: FC<Props> = ({ userRank }) => {
  const classes = useStyles();

  if (!userRank || userRank.rank === null) {
    return null;
  }

  return (
    <Paper className={classes.badge} elevation={2}>
      <Box className={classes.rankInfo}>
        <Box>
          <Typography variant="caption" color="textSecondary">
            Your Rank
          </Typography>
          <Typography className={classes.rank}>#{userRank.rank}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="textSecondary">
            Total Points
          </Typography>
          <Typography className={classes.points}>
            {userRank.totalPoints.toLocaleString()}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="textSecondary">
            Games
          </Typography>
          <Typography variant="body1">{userRank.gamesPlayed}</Typography>
        </Box>
      </Box>
      <Box>
        {userRank.rank <= 10 ? (
          <TrendingUp className={classes.trendingUp} fontSize="large" />
        ) : (
          <TrendingDown className={classes.trendingDown} fontSize="large" />
        )}
      </Box>
    </Paper>
  );
};

export default UserRankBadge;

