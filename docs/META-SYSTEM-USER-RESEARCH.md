# Meta System User Token Research

Reviewed the official Meta documentation on 18 August 2026: [Install Apps, Generate, Refresh, and Revoke Tokens](https://developers.facebook.com/docs/business-management-apis/system-users/install-apps-and-generate-tokens#types-of-system-access-tokens), [System Users overview](https://developers.facebook.com/docs/business-management-apis/system-users/), and the linked Business Management API guidance.

## Findings

Meta describes System Users as servers or software that make programmatic actions on ad objects or Pages and perform programmatic ad buying for assets owned or managed by a Business Manager. A System User token is not a Facebook Login user token and should not be used as a substitute for a real user authorization flow when actions must be attributed to a person.

Meta documents two System User token lifetimes: tokens that never expire and tokens valid for 60 days. The documentation recommends expiring tokens when the business can tolerate refresh operations or wants to reduce the risk of a leaked credential. It also documents refresh, revoke, and rotation flows. The planned Worker should therefore support token rotation without downtime and should never return the token to the frontend.

Before generating a System User token, the app must be installed for that System User. Meta states that the app and System User should belong to the same Business Manager, and only apps with Ads Management API standard access or above can be installed. Token generation requires the Business App ID, an app-secret proof, a caller token belonging to the same Business Manager, and the requested scopes.

Meta lists `ads_management`, `ads_read`, `business_management`, `pages_manage_ads`, `pages_read_engagement`, `pages_show_list`, `read_insights`, Instagram permissions, and other business scopes as supported System User scopes. The dashboard should request and use only the minimum scopes needed for the current phase rather than treating every checked permission as necessary.

Meta’s documented token-generation endpoint is `/SYSTEM-USER-ID/access_tokens`; the older `/ads_access_token` endpoint no longer works. Meta also documents `appsecret_proof` as an HMAC-SHA256 value calculated from the access token used in the API call and the app secret. The backend already contains an HMAC-SHA256 helper pattern and must keep the app secret and proof generation server-side.

Meta documents token rotation as: refresh an expiring token, deploy the new token, then revoke the old token. The Worker should treat the Cloudflare secret name `META_BM_TOKEN` as the active credential slot, but the value must be changed manually by the operator and must never be committed to the public repository.

## Implications for this project

The user’s screenshots demonstrate that the Meta app has broad permissions and that a System User has assigned Business Portfolio assets. That is not sufficient to prove that the live Worker can read the token. The current health endpoint reports only a safe boolean, `metaBusinessTokenConfigured: false`, which indicates an environment binding problem rather than a token-value validation result.

The first implementation phase should use a protected backend-only Meta call to enumerate authorized assets and return only safe IDs, names, types, and permission status. Campaign creation must begin in a paused state and require an explicit administrator approval. Paid providers and money movement remain disabled until the non-paid Meta workflow is working and audited.

## References

[1]: https://developers.facebook.com/docs/business-management-apis/system-users/install-apps-and-generate-tokens#types-of-system-access-tokens "Meta: Install Apps, Generate, Refresh, and Revoke Tokens"
[2]: https://developers.facebook.com/docs/business-management-apis/system-users/ "Meta: System Users"
