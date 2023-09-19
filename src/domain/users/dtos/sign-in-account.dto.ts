export type LoginInput = {
  email: string;
  password: string;
};

export type LoginOutput = {
  token: string;
  name: string;
  email: string;
  hasWallet: boolean;
};
