import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { SEMRESATTRS_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import {
  ReadableSpan,
  SimpleSpanProcessor,
  TimedEvent,
} from "@opentelemetry/sdk-trace-node";

const eventMap: Record<string, TimedEvent[]> = {};

class Processor extends SimpleSpanProcessor {
  onEnd(span: ReadableSpan) {
    if (span.events.length) {
      const featureFlagEvents = span.events.filter(
        (e) => e.name === "feature_flag"
      );
      const parentSpanId = span.parentSpanId;
      if (parentSpanId) {
        eventMap[parentSpanId] = featureFlagEvents;
      }
    }

    if (!span.parentSpanId) {
      const ffEvents = eventMap[span.spanContext().spanId];
      if (ffEvents) {
        span.events.push(...ffEvents);
      }
    }

    super.onEnd(span);
  }
}

const sdk = new NodeSDK({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: "ld-demo-airways",
  }),
  spanProcessor: new SimpleSpanProcessor(new OTLPTraceExporter()),
});

sdk.start();
