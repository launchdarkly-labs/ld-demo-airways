import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { SEMRESATTRS_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import {
  ReadableSpan,
  SimpleSpanProcessor,
  TimedEvent,
} from "@opentelemetry/sdk-trace-node";

const eventMap: Record<string, TimedEvent> = {};

class Processor extends SimpleSpanProcessor {
  onEnd(span: ReadableSpan) {
    if (span.events.length) {
      const featureFlagEvent = span.events.find(
        (e) => e.name === "feature_flag"
      );
      if (featureFlagEvent) {
        const parentSpanId = span.parentSpanId;
        if (parentSpanId) {
          eventMap[parentSpanId] = featureFlagEvent;
        }
      }
    }

    if (!span.parentSpanId) {
      const ffEvent = eventMap[span.spanContext().spanId];
      if (ffEvent) {
        span.events.push(ffEvent);
      }
    }

    super.onEnd(span);
  }
}

const sdk = new NodeSDK({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: "ld-demo-airways",
  }),
  spanProcessor: new Processor(new OTLPTraceExporter()),
});

sdk.start();
