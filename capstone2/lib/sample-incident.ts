import type { IncidentInput } from "./types";

export const sampleIncident: IncidentInput = {
  incidentTitle: "Checkout failures after payments deployment",
  systemType: "E-commerce platform / distributed web services",
  environment: "production",
  startTime: "2026-08-08T14:02",
  expectedBehaviour:
    "Customers should complete card payment, receive an order confirmation, and see the new order in their account within seconds.",
  actualBehaviour:
    "Checkout returns HTTP 500 for some customers. Support reports two customers may have a captured payment without a corresponding order confirmation.",
  evidence: `[2026-08-08T13:48:11Z] deploy-service INFO deployment checkout-api v4.18.0 completed; changed payment retry and order transaction handling
[2026-08-08T14:02:03Z] checkout-api ERROR POST /api/checkout 500 request_id=req-a17 duration=30112ms
[2026-08-08T14:02:03Z] checkout-api ERROR order creation failed after payment authorization request_id=req-a17
[2026-08-08T14:02:02Z] payment-service WARN upstream timeout after 30000ms provider=card-gateway request_id=req-a17
[2026-08-08T14:02:04Z] orders-db ERROR connection pool exhausted active=40 idle=0 pending=117 max=40
[2026-08-08T14:03:19Z] checkout-api ERROR POST /api/checkout 500 request_id=req-b42 duration=30088ms
[2026-08-08T14:03:18Z] payment-service WARN authorization response received after client timeout request_id=req-b42 status=approved
[2026-08-08T14:03:19Z] order-service ERROR failed to begin transaction: connection acquisition timeout request_id=req-b42
[2026-08-08T14:04:00Z] monitor ALERT checkout success rate 63% (baseline 98.8%); 500 rate 31%
[2026-08-08T14:05:00Z] monitor INFO checkout-api cpu=37% memory=58%; no resource saturation
[2026-08-08T14:05:00Z] monitor INFO product-service success=99.96% p95=91ms healthy
[2026-08-08T14:05:00Z] monitor INFO cart-service success=99.91% p95=126ms healthy
[2026-08-08T14:06:27Z] orders-db WARN connection wait p95=28760ms open_connections=40
[2026-08-08T14:08:10Z] support NOTE customer says bank charged card but checkout showed an error; order history is empty
[2026-08-08T14:09:45Z] on-call NOTE no database failover, schema migration, or infrastructure alert in the same window`,
  notes:
    "Release v4.18.0 began at 13:43 UTC and completed at 13:48 UTC. The team has not yet compared pool usage by application version. Payment provider status page reports normal operation.",
};
