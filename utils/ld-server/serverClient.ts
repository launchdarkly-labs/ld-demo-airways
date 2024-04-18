import { init, LDClient } from "@launchdarkly/node-server-sdk";
import { TracingHook } from "@launchdarkly/node-server-sdk-otel";

export let ldClient: LDClient;

const LD_SDK_KEY = process.env.LD_SERVER_KEY_STG || "";
console.log("LD_SDK_KEY", LD_SDK_KEY);

const getServerClient = async () => {
  if (!ldClient) {
    ldClient = init(LD_SDK_KEY, {
      hooks: [new TracingHook({ includeVariant: true })],
      streamUri: "https://stream-stg.launchdarkly.com",
      baseUri: "https://sdk-stg.launchdarkly.com",
      eventsUri: "https://events-stg.launchdarkly.com",
    });
  }

  await ldClient.waitForInitialization();
  return ldClient;
};

export const getFlagContext = () => {
  // random integer between 0 and 100
  const random = Math.floor(Math.random() * 100).toString();

  return {
    kind: "user",
    key: "jenn+" + random,
    name: "jenn toggles",
  };
};

export default getServerClient;
