# Owner checklist — do not paste this heading into App Review

These notes describe the intended release. Do not submit while production Arena is unavailable or the listed readiness gates remain pending. Set the real review contact in App Store Connect. The app is currently free of real-money payments and ads; confirm this launch scope with the owner. `metadata.json` contains Turkish and English copy. Its optional 1v1 paragraph may be included only after production validation; leaving it out does not make a broken in-app 1v1 entry acceptable.

## App Review notes (English)

TREAD RIVALS is a landscape tank action game with separate movement and turret-aim controls. The left stick moves the tank. Drag the right stick to aim and fire. Solo Campaign and Bot Practice work without an account and without a network connection after installation.

To test: open Solo Campaign from the home screen, or choose Practice for a clearly labeled bot match. Garage contains tank bodies, paints, decals, accessories and projectile appearances. Solo upgrades do not apply to competitive Arena. Bot practice does not award a competitive rating.

Online Arena creates a guest account when the player connects; no email, password, third-party social login or demo credentials are required. The first five matches are placements. Matchmaking uses real players; if another player is unavailable, Practice is explicitly offered as a separate bot mode. It does not impersonate a human opponent.

Settings contains Privacy Policy, Support, Licenses, optional analytics and solo score sharing (both off by default), local solo-save deletion, and Arena account recovery/deletion. Deleting the Arena account requires a second confirmation and removes server credentials, wallet and inventory. Solo saves are separate. A recovery code restores only the Arena account.

Player options in League, the match result and in-match settings provide reporting and blocking. Blocking prevents future pairings. Solo leaderboard nickname reports open a support email for the player to send.

There are no real-money purchases, subscriptions, external checkout links or advertising in this build. In-game currencies and cosmetic containers are earned through gameplay. No items can be cashed out. The app does not use advertising tracking or request ATT authorization.

All gameplay assets are bundled. Downloading executable gameplay code is not required. The shipped build does not include private AudioHero audition recordings.

## Moderation operations (private server)

`node tools/moderate-arena.mjs list` reads unresolved reports using the owner's existing `DATABASE_URL`. Never put the URL in metadata, screenshots, source control or chat. `resolve REPORT_ID` resolves a reviewed report; `suspend ACCOUNT_ID` revokes access after an actual moderation decision. These commands change real user accounts and are not run as part of packaging. Connected suspended accounts are checked every 15 seconds. Reports expire after 90 days. No automatic guilt-by-report-count ban is applied.

The owner must assign someone to review reports and the support inbox. Escalations, erroneous bans and deletion requests need a human response. Test reports were submitted only to local test servers/databases.
