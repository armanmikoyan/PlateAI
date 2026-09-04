export type ContactMessageBody = Readonly<{
  email: string;
  message: string;
}>;

export type ContactMessageResponse = Readonly<{
  ok: true;
}>;
