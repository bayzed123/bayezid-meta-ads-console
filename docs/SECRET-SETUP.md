# Secret Setup for the Cloudflare Worker

This frontend repository is public. **Do not add any secret to GitHub, GitHub Pages, HTML, JavaScript, browser local storage, query parameters, screenshots, issue comments, or logs.** The names below are configuration contracts for the protected Worker only.

## Required Meta secrets

| Secret name | Stored in | Purpose | Browser exposure |
|---|---|---|---|
| `META_BM_TOKEN` | Cloudflare Worker secret | Server-side Meta Business/System User access token | Never |
| `META_APP_SECRET` | Cloudflare Worker secret | Server-side app-secret operations and token validation | Never |
| `META_APP_ID` | Worker variable or public frontend config | Meta application identifier | Public identifier only |
| `META_GRAPH_API_VERSION` | Worker variable | Pinned Graph API version, for example `v26.0` | Never required in client |
| `META_APP_ENCRYPTION_KEY` | Cloudflare Worker secret | AES-GCM encryption key for encrypted tenant token material | Never |
| `META_WEBHOOK_VERIFY_TOKEN` | Cloudflare Worker secret | Webhook verification | Never |
| `META_WEBHOOK_APP_SECRET` | Cloudflare Worker secret | Webhook signature verification | Never |

`META_BM_TOKEN` is the requested canonical name. Add it manually to the existing `bayezid-agency-api` Worker with the Cloudflare dashboard or Wrangler secret command. Never place its value in this repository.

## Required application secrets

| Secret name | Purpose |
|---|---|
| `ADMIN_SECRET` | Existing backend admin route protection; rotate if it has ever been exposed |
| `SESSION_SIGNING_SECRET` | Signs short-lived server sessions or cookies |
| `SESSION_ENCRYPTION_KEY` | Encrypts server-side session state where required |
| `CORS_ALLOWED_ORIGINS` | Exact allowed frontend origins, comma-separated; never use `*` with credentials |
| `PUBLIC_APP_ORIGIN` | Canonical GitHub Pages/custom-domain origin used for redirect and CORS validation |

## Payment adapter secrets

Add only when the corresponding provider has been approved and onboarded. Do not add every provider speculatively.

| Secret name | Provider |
|---|---|
| `PAYPAL_CLIENT_ID` | PayPal public identifier used by the server-side integration |
| `PAYPAL_CLIENT_SECRET` | PayPal server credential |
| `PAYPAL_WEBHOOK_ID` | PayPal webhook verification |
| `BINANCE_PAY_CERTIFICATE` | Binance Pay certificate/private material |
| `BINANCE_PAY_API_KEY` | Binance Pay merchant API identity key |
| `BINANCE_PAY_API_SECRET` | Binance Pay merchant API secret |
| `BINANCE_PAY_WEBHOOK_SECRET` | Binance Pay webhook verification where applicable |
| `BKASH_APP_KEY` | bKash merchant integration |
| `BKASH_APP_SECRET` | bKash merchant integration |
| `BKASH_USERNAME` | bKash merchant integration |
| `BKASH_PASSWORD` | bKash merchant integration |
| `BKASH_WEBHOOK_SECRET` | bKash webhook verification |

Nagad, Rocket, bank, and other local or crypto integrations should use provider-specific names only after an official merchant API agreement and webhook verification method are confirmed. Do not use unofficial scraping or consumer-app credentials.

## Safe setup sequence

1. Confirm that the Worker project is the intended `bayezid-agency-api` production service.
2. Add the required secrets in the Cloudflare Worker secret store, one at a time.
3. Keep values out of shell history where possible and never echo them.
4. Deploy the backend with a separate protected environment for production.
5. Verify only non-sensitive health indicators, such as `metaConfigured: true`, without returning token fragments, lengths, hashes, or secret names.
6. Configure the frontend with only public values such as the backend origin, public App ID, and public Pixel ID.
7. Test Meta calls using a paused campaign or test ad account before production.

## Secret safety rules

The Worker must reject requests without a validated tenant session, enforce tenant-to-asset authorization on every operation, redact authorization headers and provider payloads from logs, use idempotency keys for payment and campaign mutations, and write immutable audit records for privileged actions. Error responses must contain a safe public code and human-readable remediation message, not raw Graph API payloads or credentials.
