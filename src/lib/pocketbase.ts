import PocketBase, { type RecordModel } from 'pocketbase';

const url = import.meta.env.VITE_POCKETBASE_URL ?? 'http://127.0.0.1:8090';

export const pb = new PocketBase(url);

export type Session = {
  token: string;
  uid: string;
  source: string;
};

export function establishSession(params: Session): void {
  pb.authStore.save(params.token, {
    id: params.uid,
    collectionId: '',
    collectionName: 'users',
    source: params.source,
  } as RecordModel);
}

export function clearSession(): void {
  pb.authStore.clear();
}

export function hasSession(): boolean {
  return pb.authStore.isValid;
}
