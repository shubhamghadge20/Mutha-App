export interface Token {
  tokens: {
    access: { token: string; expires: string };
    refresh: { token: string; expires: string };
  };
}
