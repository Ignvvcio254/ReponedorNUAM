-- Migration to add authentication fields to users table
-- Run this in Supabase SQL Editor

-- Add missing columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS password TEXT NOT NULL DEFAULT 'changeme',
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "twoFactorSecret" TEXT,
ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "lastLoginIp" TEXT,
ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "lockedUntil" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "passwordResetToken" TEXT,
ADD COLUMN IF NOT EXISTS "passwordResetExpires" TIMESTAMP(3);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "users_email_idx" ON users(email);
CREATE INDEX IF NOT EXISTS "users_role_idx" ON users(role);
CREATE INDEX IF NOT EXISTS "users_isActive_idx" ON users("isActive");

-- Create NextAuth tables if they don't exist
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  CONSTRAINT accounts_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(provider, "providerAccountId")
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL,
  expires TIMESTAMP(3) NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  CONSTRAINT sessions_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "verification_tokens" (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires TIMESTAMP(3) NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Create indexes for NextAuth tables
CREATE INDEX IF NOT EXISTS "accounts_userId_idx" ON accounts("userId");
CREATE INDEX IF NOT EXISTS "sessions_userId_idx" ON sessions("userId");
CREATE INDEX IF NOT EXISTS "sessions_sessionToken_idx" ON sessions("sessionToken");
