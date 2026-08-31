export const DEVICE_TYPE = {
  PHONE: 'phone',
  DESKTOP: 'desktop',
} as const;

export type DeviceType = (typeof DEVICE_TYPE)[keyof typeof DEVICE_TYPE];

export type DeviceHints = Readonly<{
  USER_AGENT: string;
  USER_AGENT_MOBILE?: boolean;
}>;
