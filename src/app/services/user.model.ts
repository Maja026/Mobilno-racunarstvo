export interface User {
  uid?: string;
  email: string;
  watchLater: { [movieId: string]: boolean };
  seen: { [movieId: string]: boolean };
}
