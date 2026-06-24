-- CreateEnum
CREATE TYPE "TradeType" AS ENUM ('BUY', 'SELL');
CREATE TYPE "TradeStatus" AS ENUM ('OPEN', 'CLOSED', 'SIMULATED');
CREATE TYPE "MissionType" AS ENUM ('RISK_MAX_PCT', 'MIN_RR_RATIO', 'TRADES_COUNT', 'WIN_STREAK', 'NO_REVENGE_TRADE', 'MAX_DAILY_LOSS_PCT');
CREATE TYPE "MissionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'FAILED');

-- Users
CREATE TABLE users (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- SimAccount
CREATE TABLE sim_accounts (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id         TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  initial_balance FLOAT DEFAULT 10000,
  current_balance FLOAT DEFAULT 10000,
  equity          FLOAT DEFAULT 10000,
  level           INT DEFAULT 1,
  xp              INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Trades
CREATE TABLE trades (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type          "TradeType" NOT NULL,
  lot           FLOAT NOT NULL,
  entry_price   FLOAT NOT NULL,
  exit_price    FLOAT,
  sl            FLOAT,
  tp            FLOAT,
  result_usd    FLOAT,
  result_pct    FLOAT,
  rr_ratio      FLOAT,
  risk_pct      FLOAT,
  status        "TradeStatus" DEFAULT 'OPEN',
  notes         TEXT,
  entry_at      TIMESTAMPTZ DEFAULT NOW(),
  exit_at       TIMESTAMPTZ
);

-- Missions
CREATE TABLE missions (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name         TEXT UNIQUE NOT NULL,
  description  TEXT NOT NULL,
  type         "MissionType" NOT NULL,
  target_value FLOAT NOT NULL,
  xp_reward    INT DEFAULT 50,
  is_daily     BOOLEAN DEFAULT FALSE
);

-- UserMissions
CREATE TABLE user_missions (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id          TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mission_id       TEXT NOT NULL REFERENCES missions(id),
  status           "MissionStatus" DEFAULT 'ACTIVE',
  current_progress FLOAT DEFAULT 0,
  target_progress  FLOAT NOT NULL,
  assigned_at      TIMESTAMPTZ DEFAULT NOW(),
  completed_at     TIMESTAMPTZ,
  UNIQUE(user_id, mission_id)
);

-- StatsSnapshot
CREATE TABLE stats_snapshots (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id          TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date             TIMESTAMPTZ DEFAULT NOW(),
  win_rate         FLOAT NOT NULL,
  avg_risk         FLOAT NOT NULL,
  avg_rr           FLOAT NOT NULL,
  win_streak       INT NOT NULL,
  loss_streak      INT NOT NULL,
  total_trades     INT NOT NULL,
  total_pnl        FLOAT NOT NULL,
  avg_pnl_per_trade FLOAT NOT NULL
);
