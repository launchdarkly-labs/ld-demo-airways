import { init, LDClient } from "@launchdarkly/node-server-sdk";
import { TracingHook } from "@launchdarkly/node-server-sdk-otel";

export let ldClient: LDClient;

const LD_SDK_KEY = process.env.LD_SERVER_KEY || "";

const getServerClient = async () => {
  if (!ldClient) {
    ldClient = init(LD_SDK_KEY, {
      hooks: [new TracingHook()],
      streamUri: 'https://stream-stg.launchdarkly.com',
      baseUri: 'https://sdk-stg.launchdarkly.com',
      eventsUri: 'https://events-stg.launchdarkly.com',
    });
  }

  await ldClient.waitForInitialization();
  return ldClient;
};

export default getServerClient;
