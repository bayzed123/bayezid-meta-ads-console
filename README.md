# Bayezid Meta Ads Console

A public, static frontend for a secure first-party Meta Business advertising console. The interface is designed for GitHub Pages, while all privileged operations and credentials remain in the Cloudflare Worker backend.

## Security boundary

This repository is intentionally public. It must never contain Meta System User tokens, `META_BM_TOKEN`, App Secrets, encryption keys, admin secrets, payment-provider credentials, webhook signing secrets, private keys, or client access tokens.

The frontend may contain public identifiers such as a Meta App ID, Pixel ID, API origin, and documentation links. It must never call Meta Marketing API or payment APIs directly. Those operations belong in the protected Cloudflare Worker.

## Planned product scope

The console will support client authorization, authorized Page and ad-account selection, campaign brief creation, AI-assisted draft generation, paused campaign creation, explicit approval before spend, audit history, and adapter-based billing or payout status. Production launch, budget increases, payouts, and transfers must require an explicit authorized confirmation.

## Current backend origin

```text
https://bayezid-agency-api.sayadmdbayezidhosan.workers.dev
```

The public frontend does not assume that a privileged token exists in the browser. The backend will read its secrets from Cloudflare Worker secrets and return only scoped, non-sensitive data.

## Development

This first foundation is static and can be hosted by GitHub Pages. Open `index.html` locally or serve the repository with any static web server. The frontend currently presents the dashboard foundation and safe workflow states; privileged API integrations should be enabled only after the backend contract and tenant authorization checks are deployed.

## Secret setup

See [`docs/SECRET-SETUP.md`](docs/SECRET-SETUP.md) for the required Cloudflare secret names and the values that must never be committed to this public repository.

## License and operational note

This repository is a private operational tool made public only for GitHub-hosted frontend delivery. Review the access policy, Meta permissions, payment-provider agreements, and applicable privacy obligations before enabling production campaign spending or money movement.
