import { useEffect, useState } from 'react';
import { establishSession, hasSession, type Session } from '@/lib/pocketbase';

const SOURCE_FLAG = 'mjw-apps-dash';

function readParams(): Session | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const uid = params.get('uid');
  const source = params.get('source');
  if (token && uid && source === SOURCE_FLAG) {
    return { token, uid, source };
  }
  return null;
}

export interface SessionState {
  ready: boolean;
  session: Session | null;
}

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({
    ready: false,
    session: null,
  });

  useEffect(() => {
    const incoming = readParams();
    if (incoming) {
      establishSession(incoming);
    }
    const active = hasSession() ? incoming : null;
    setState({ ready: true, session: active });
  }, []);

  return state;
}
