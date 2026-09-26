# Release asset records

The exact web/native web payload is defined by `../release-policy.cjs`. `asset-register.json` records asset hashes, source URLs, license texts and evidence level; `native-art-register.json` covers native icon/splash source images and store artwork. `software-sbom.json` inventories the locked npm dependencies; it is not a non-infringement warranty. Historical credits are retained separately in `ARCHIVED-CREDITS.md`.

Run `npm run audit:release` to verify reviewed bytes, licenses, static references, native artwork and the dependency lock. The server and mobile packaging also run this check. A new asset must be reviewed and explicitly added with its evidence; do not blindly refresh hashes to bypass failures. Excluded assets and arbitrary workspace files cannot be served through the release server.

Full current notices are in `licenses/` and are embedded in the offline `../licenses.html` page by `node legal/build-notices.cjs`. The originals retain upstream copyright and wording. `collect-software.cjs` collects installed package notices; it does not itself approve a new dependency license. The iOS evidence snapshot corresponds to Capacitor Swift PM 8.4.1. Upgrades require reviewing bundled components (including Cordova), not only the package's top-level SPDX label.

`gitconfiglocal@1.0.0` remains a build-tool-only record with an ambiguous BSD variant and missing full license text. It is not part of the app payload. Do not redistribute the development environment on the assumption that all tooling has received legal clearance.

The separate playable ad builder uses reviewed Mk2 models and embeds its own MIT/OFL notices. Ad-network submission rules, trademarks, store listings and jurisdiction-specific commercial requirements need separate review.
