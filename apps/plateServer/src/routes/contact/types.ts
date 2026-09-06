export type ContactMessageInput = Readonly<{
  message: string;
}>;

export type ContactMessageBody = Readonly<{
  email: string;
  message: string;
}>;

export type ContactMessageResponse = Readonly<{
  ok: true;
}>;
