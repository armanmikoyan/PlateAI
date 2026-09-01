import { DEVICE_TYPE, type DeviceHints, type DeviceType } from './types';

function isPhone(hints: DeviceHints): boolean {
  if (hints.USER_AGENT_MOBILE === true) {
    return true;
  }

  if (hints.USER_AGENT_MOBILE === false) {
    return false;
  }

  return /iPhone|iPod|Android.+Mobile|Windows Phone|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    hints.USER_AGENT,
  );
}

export function detectDeviceType(hints: DeviceHints): DeviceType {
  return isPhone(hints) ? DEVICE_TYPE.PHONE : DEVICE_TYPE.DESKTOP;
}

export function readDeviceHints(): DeviceHints {
  const userAgentData = (navigator as Navigator & { userAgentData?: { mobile?: boolean } })
    .userAgentData;

  return {
    USER_AGENT: navigator.userAgent,
    USER_AGENT_MOBILE: userAgentData?.mobile,
  };
}
