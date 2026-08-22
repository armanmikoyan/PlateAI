export type AuthUser = Readonly<{
  id: string;
  email: string;
  name: string;
  image: string | null;
}>;

export type AuthMeResponse = Readonly<{
  user: AuthUser;
}>;

export type AuthErrorResponse = Readonly<{
  error: string;
}>;
