"use client";

import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";
import { use } from "react";
import { isAndroid, isIOS, isBrowser, isMobile, isMacOs, isWindows } from 'react-device-detect';
import { v4 as uuidv4 } from "uuid";

export default function AsyncLDProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const operatingSystem = isAndroid ? 'Android' : isIOS ? 'iOS' : isWindows ? 'Windows' : isMacOs ? 'macOS' : '';
  const device = isMobile ? 'Mobile' : isBrowser ? 'Desktop' : '';

  const LDDynaProvider = use(
    asyncWithLDProvider({
      clientSideID: process.env.NEXT_PUBLIC_LD_CLIENT_KEY || '',
      // reactOptions: {

      //   useCamelCaseFlagKeys: false
      // },
      options: {
        application: {
          id: "launch-airways",
          version: "72c989d789d0835127e2c61dde582cc70ce15b75"
        }
      },
      context: {
        kind: "multi",
        user: {
          key: "jenn@launchmail.io",
          name: "Jenn",
          email: "jenn@launchmail.io",
          appName: "LD Demo",
        },
        device: {
          key: device,
          name: device,
          operating_system: operatingSystem,
          platform: device,
        },
        location: {
          key: Intl.DateTimeFormat().resolvedOptions().timeZone,
          name: Intl.DateTimeFormat().resolvedOptions().timeZone,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          country: "US",
        },
        experience: {
          key: "a380",
          name: "a380",
          airplane: "a380",
        },
        audience: {
          key: uuidv4().slice(0, 6),
        }}})
  );

  return <LDDynaProvider>{children}</LDDynaProvider>;
}
