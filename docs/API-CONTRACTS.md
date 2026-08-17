# Protected Backend Contract

The frontend calls only the first-party Cloudflare Worker. It must never call the Meta Graph API, PayPal, Binance Pay, bKash, or any other provider directly.

## Base URL

```text
https://bayezid-agency-api.sayadmdbayezidhosan.workers.dev
```

The production frontend should use a custom API origin if one is configured. The origin is public configuration; all credentials remain Worker secrets.

## Tenant and permission model

Every request must resolve a server-side session to one tenant and one principal. A tenant is an agency workspace or client business. A principal is an authenticated administrator, operator, or client member. Meta asset IDs are never trusted merely because they came from the browser; the Worker must verify that each asset is assigned to the tenant and that the principal has the required role.

| Role | Read authorized assets | Draft campaigns | Approve launch | Launch or change budget | Payments and payouts | Manage members |
|---|---:|---:|---:|---:|---:|---:|
| `client` | Yes | Yes | No | No | View own invoices | No |
| `operator` | Yes | Yes | No | No | View workspace status | No |
| `approver` | Yes | Yes | Yes | Yes, with confirmation | Approve permitted billing actions | No |
| `owner` | Yes | Yes | Yes | Yes, with confirmation | Yes, with two-step confirmation | Yes |

The System User token is an agency-level backend credential. It is not a client identity and must not be used to bypass Facebook Login, tenant authorization, or audit requirements.

## Safe response shape

The Worker may return scoped asset metadata and campaign summaries, for example:

```json
{
  "ok": true,
  "data": {
    "assets": [
      {
        "id": "opaque-internal-id",
        "type": "page",
        "name": "Authorized Page",
        "status": "connected"
      }
    ]
  },
  "requestId": "server-generated-id"
}
```

It must never return access tokens, App Secrets, authorization headers, provider signatures, decrypted payment details, or raw upstream error payloads.

## Endpoint proposal

| Method and path | Purpose | Minimum role | Mutation safety |
|---|---|---|---|
| `GET /v1/session` | Return current safe session and role | Signed-in principal | Read only |
| `GET /v1/assets` | Return tenant-authorized Pages, Instagram accounts, and ad accounts | Client | Read only |
| `POST /v1/campaign-drafts` | Validate and save a campaign brief | Client | Idempotency key required |
| `POST /v1/campaign-drafts/:id/generate` | Generate AI recommendations and creative variants | Client | Draft only |
| `POST /v1/campaign-drafts/:id/submit` | Submit a draft for review | Client | State transition only |
| `GET /v1/approvals` | List pending approvals | Approver | Read only |
| `POST /v1/approvals/:id/approve` | Approve a paused campaign plan | Approver | Explicit confirmation required |
| `POST /v1/campaigns/:id/activate` | Activate a previously approved campaign | Approver | Explicit confirmation and audit record required |
| `POST /v1/campaigns/:id/pause` | Pause an active campaign | Operator | Audit record required |
| `GET /v1/insights` | Return scoped reporting data | Client | Read only |
| `GET /v1/billing/summary` | Return safe invoice and settlement status | Client | Read only |
| `POST /v1/billing/payment-intents` | Create a provider payment intent | Owner | Idempotency and provider verification required |
| `POST /v1/webhooks/:provider` | Receive provider callbacks | Provider signature | Signature verification and replay protection |
| `GET /v1/audit` | Return tenant-scoped audit events | Approver | Read only |
| `GET /api/admin/meta/account` | Return safe ad-account metadata for the protected operator console | Admin only | `X-Admin-Secret`; no raw Graph errors |
| `GET /api/admin/meta/assets` | Return safe Business Portfolio ad-account and Page metadata | Admin only | `X-Admin-Secret`; no tokens |
| `GET /api/admin/meta/insights` | Return allowlisted campaign, ad-set, or ad reporting data | Admin only | `X-Admin-Secret`; constrained date presets and levels |
| `GET /health` | Return non-sensitive service health | Public or restricted | Never reveal configuration values |

## Mutation requirements

Campaign creation must validate the tenant, principal, asset assignment, objective, destination URL, budget, currency, schedule, creative policy state, and idempotency key. The first upstream campaign request should use a paused state. Activation requires a fresh authorization check, an explicit confirmation value, and an immutable audit event.

Payment mutations must use provider adapters, idempotency keys, server-side webhook verification, amount and currency reconciliation, duplicate-event protection, and a manual exception state. A successful HTTP response from a provider is not sufficient to mark a payment settled until the provider status is reconciled.

The initial Meta reporting endpoints are intentionally operator-only and read-only. They use the Worker-side System User token, optionally add `appsecret_proof` when `FB_APP_SECRET` is configured, allowlist returned fields, and refuse unauthenticated requests. The public `/api/console/health` endpoint reports only boolean readiness states; it does not expose account names, IDs, insights, or credentials.

## Logging and observability

Logs may include request IDs, tenant IDs, actor IDs, route names, latency, safe upstream error codes, and state transitions. Logs must redact authorization headers, cookies, raw provider payloads, tokens, signatures, payment account numbers, and personal data. Health endpoints should report booleans such as `metaConfigured` and `databaseReachable`, never secret values or token fragments.
