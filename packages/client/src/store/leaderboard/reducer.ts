import { LeaderboardActions } from './action.interface';
import { LeaderboardEnum } from './enum';
import { leaderboardInitialState } from './initialState';
import { LeaderboardStateInterface } from './initialState.interface';
import { AlertTypes } from '../../models/alerts';
import { LeaderboardPeriod } from '../../models/leaderboard';

const leaderboardReducer = (
  state = leaderboardInitialState,
  action: LeaderboardActions,
): LeaderboardStateInterface => {
  switch (action.type) {
    case LeaderboardEnum.InitFetchLeaderboard:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case LeaderboardEnum.SuccessFetchLeaderboard: {
      const { leaderboard, period } = action.data;
      const updateKey =
        period === LeaderboardPeriod.WEEK
          ? 'weeklyLeaderboard'
          : period === LeaderboardPeriod.MONTH
          ? 'monthlyLeaderboard'
          : 'globalLeaderboard';

      return {
        ...state,
        loading: false,
        [updateKey]: leaderboard,
        lastUpdated: new Date(),
      };
    }

    case LeaderboardEnum.FailFetchLeaderboard: {
      const { error } = action.data;
      return {
        ...state,
        loading: false,
        error,
        alertType: AlertTypes.ServerError,
      };
    }

    case LeaderboardEnum.InitFetchUserRank:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case LeaderboardEnum.SuccessFetchUserRank: {
      const { userRank } = action.data;
      return {
        ...state,
        loading: false,
        userRank,
      };
    }

    case LeaderboardEnum.FailFetchUserRank: {
      const { error } = action.data;
      return {
        ...state,
        loading: false,
        error,
        alertType: AlertTypes.ServerError,
      };
    }

    case LeaderboardEnum.SetSelectedPeriod: {
      const { period } = action.data;
      return {
        ...state,
        selectedPeriod: period,
      };
    }

    case LeaderboardEnum.CleanLeaderboardAlerts:
      return {
        ...state,
        error: null,
        alertType: null,
      };

    default:
      return state;
  }
};

export default leaderboardReducer;

