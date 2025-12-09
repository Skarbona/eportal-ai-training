import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container, Paper, Tabs, Tab, Box, Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { RootState } from '../../../store/store.interface';
import { useReduxDispatch } from '../../../store/helpers';
import { fetchLeaderboard, fetchUserRank } from '../../../store/leaderboard/thunks/fetchLeaderboard';
import { setSelectedPeriod } from '../../../store/leaderboard/action';
import { LeaderboardPeriod } from '../../../models/leaderboard';
import LeaderboardTable from './LeaderboardTable';
import UserRankBadge from './UserRankBadge';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(3),
    fontWeight: 600,
  },
  tabs: {
    marginBottom: theme.spacing(3),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4),
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box>{children}</Box>}
  </div>
);

export const Leaderboard: FC = () => {
  const classes = useStyles();
  const dispatch = useReduxDispatch();

  const {
    globalLeaderboard,
    weeklyLeaderboard,
    monthlyLeaderboard,
    userRank,
    loading,
    selectedPeriod,
  } = useSelector((state: RootState) => state.leaderboard);

  const { id: userId } = useSelector((state: RootState) => state.user.userData);

  const [tabValue, setTabValue] = React.useState(0);

  useEffect(() => {
    dispatch(fetchLeaderboard(LeaderboardPeriod.ALL));
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserRank(userId, selectedPeriod));
    }
  }, [dispatch, userId, selectedPeriod]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
    let period: LeaderboardPeriod;
    
    switch (newValue) {
      case 1:
        period = LeaderboardPeriod.WEEK;
        break;
      case 2:
        period = LeaderboardPeriod.MONTH;
        break;
      default:
        period = LeaderboardPeriod.ALL;
    }

    dispatch(setSelectedPeriod(period));
    dispatch(fetchLeaderboard(period));
    if (userId) {
      dispatch(fetchUserRank(userId, period));
    }
  };

  const getCurrentLeaderboard = () => {
    switch (tabValue) {
      case 1:
        return weeklyLeaderboard;
      case 2:
        return monthlyLeaderboard;
      default:
        return globalLeaderboard;
    }
  };

  return (
    <Container className={classes.container} maxWidth="lg">
      <Paper className={classes.paper}>
        <Typography variant="h4" className={classes.title}>
          🏆 Leaderboard
        </Typography>

        {userRank && <UserRankBadge userRank={userRank} />}

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          className={classes.tabs}
        >
          <Tab label="All Time" />
          <Tab label="This Week" />
          <Tab label="This Month" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {loading ? (
            <div className={classes.loading}>
              <CircularProgress />
            </div>
          ) : (
            <LeaderboardTable entries={getCurrentLeaderboard()} currentUserId={userId} />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {loading ? (
            <div className={classes.loading}>
              <CircularProgress />
            </div>
          ) : (
            <LeaderboardTable entries={getCurrentLeaderboard()} currentUserId={userId} />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {loading ? (
            <div className={classes.loading}>
              <CircularProgress />
            </div>
          ) : (
            <LeaderboardTable entries={getCurrentLeaderboard()} currentUserId={userId} />
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Leaderboard;

