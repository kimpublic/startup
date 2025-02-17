import React from 'react';
import { AuthState } from './authState';
import { Authenticated } from './authenticated';
import { Unauthenticated } from './unauthenticated';

export function Login({ authState, userEmail, nickName, onLogin, onLogout }) {
  if (authState === AuthState.Authenticated && userEmail) {
    return <Authenticated userEmail={userEmail} nickName={nickName} onLogout={onLogout} onLogin={onLogin} />;
  }

  return <Unauthenticated onLogin={onLogin} />;
}