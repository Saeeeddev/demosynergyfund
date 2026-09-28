# Publish the Synergy portfolio demo on Cloudflare Pages

This guide deploys **only static frontend files**. It does not deploy Django, a database, payment processing, email, or a VPS. The public site will live at `synergyfund.ir` (and `www.synergyfund.ir`); the guest dashboard will live at `d.synergyfund.ir`. You need access to the domain registrar, a Cloudflare account, and a GitHub account. Cloudflare Pages has a free plan, but **domain registration/renewal is not free**. Check Cloudflare's current [Pages limits](https://developers.cloudflare.com/pages/platform/limits/) before relying on the free plan.

> **Important:** This `demo/` folder is its own Git repository, separate from the old full-stack repository. Publish this repository, not the old Django/VPS repository. No real account, investment, or payment works here. Dashboard changes are stored in each visitor's browser and can be reset; do not ask visitors for personal or financial data.

## 1. Verify the local files

From the `demo/` directory, install and build each frontend using Node.js 22:

```bash
cd dashboard
npm ci
npm run build
cd ../public-website
npm ci
npm run build
```

Each build should finish successfully and produce an `out/` directory. `out/` is the static website Cloudflare will serve. The dashboard must have `NEXT_PUBLIC_DEMO_MODE=true` at build time; the code defaults to demo mode, but setting it explicitly prevents an accidental live-API build. Do **not** set `NEXT_PUBLIC_DEMO_MODE=false`. The public app uses `NEXT_PUBLIC_PLATFORM_URL` to choose where its dashboard buttons go. Values beginning `NEXT_PUBLIC_` are baked into the build, so **redeploy after changing them**.

The apps have separate `package.json` and lockfiles. Do not commit `node_modules/`, `.next/`, `out/`, `.env.local`, secrets, VPS backups, database dumps, or private certificates. Run `git status --short` before pushing and inspect what will be published. The dashboard demo fixtures live in `dashboard/src/lib/demo/`; do not replace them with real customer data.

## 2. Publish this `demo/` repository to GitHub

Create a new **empty** GitHub repository, for example `synergy-portfolio-demo`. Do not initialize it with a README or license: this repository already has a history. GitHub's public/private setting is your choice; a public repo makes the source visible to everyone, so inspect the tracked files first. In a terminal inside `demo/`:

```bash
git status
git branch --show-current
git remote -v
git remote add origin https://github.com/YOUR_USERNAME/synergy-portfolio-demo.git
git push -u origin master
```

Replace the URL with your new repository URL. The branch was `master` when this guide was written; if `git branch --show-current` says something else, push that exact branch and use it as the Pages **Production branch**. If `origin` already exists, check its URL instead of adding another remote. Commit your latest changes before pushing (`git add` only the intended source and documentation files, then `git commit`). Do not push the original full-stack repo by mistake.

If GitHub asks for authentication, use GitHub's browser/credential flow or a personal access token; GitHub account passwords do not work for HTTPS Git pushes.

## 3. Create the dashboard Pages project first

In [Cloudflare Dashboard](https://dash.cloudflare.com/):

1. Open **Workers & Pages → Create application → Pages → Import an existing Git repository** (wording may vary slightly).
2. Connect your GitHub account, grant access to the new demo repo, and select it.
3. Configure the build as follows. All paths are **relative to this Git repository**, not to the old monorepo.

| Field | Dashboard value |
| --- | --- |
| Project name | `synergy-dashboard` or another available name |
| Production branch | `master`, or the branch you actually pushed |
| Framework preset | `Next.js (Static HTML Export)` |
| Root directory | `dashboard` |
| Build command | `npm run build` |
| Build output directory | `out` |

4. In build environment variables, add `NODE_VERSION=22` and `NEXT_PUBLIC_DEMO_MODE=true` for Production. Set the same values for Preview if you will use branch previews. Do **not** add `NEXT_PUBLIC_API_URL`, `SESSION_SECRET`, Django variables, database credentials, Pages Functions, or a Worker.
5. Select **Save and Deploy**. Read the build log; the build should produce static files from `dashboard/out/`.
6. Note the assigned URL, such as `https://synergy-dashboard.pages.dev`. Open its `/login/` route, read the update notice, click **ادامه در حالت دمو (مهمان)**, and check `/dashboard/` and `/marketplace/`.

If the first deployment fails, do not change DNS yet. Fix the project root/build/output settings or the error shown in its build log.

## 4. Create the public website Pages project

Create **another** Pages project from the **same GitHub repository**. Cloudflare supports multiple Pages projects from one repo, each with its own root directory. Use:

| Field | Public website value |
| --- | --- |
| Project name | `synergy-public` or another available name |
| Production branch | Same branch as the dashboard |
| Framework preset | `Next.js (Static HTML Export)` |
| Root directory | `public-website` |
| Build command | `npm run build` |
| Build output directory | `out` |

Set these build environment variables for Production (and Preview if needed):

```text
NODE_VERSION=22
NEXT_PUBLIC_SITE_URL=https://synergyfund.ir
NEXT_PUBLIC_PLATFORM_URL=https://YOUR-DASHBOARD-PROJECT.pages.dev/login/
```

Replace the Pages URL with the **actual** dashboard URL from Step 3. Deploy and open the public `*.pages.dev` URL. Test the home page, `/about/`, `/contact/`, `/terms/`, and `/privacy/`. A button saying **ورود به پلتفرم** should take you to the dashboard preview login. The contact page should say that support is unavailable, not offer a real submission form.

## 5. Prepare your domain before changing nameservers

You need to control `synergyfund.ir` at the company where it is registered. If it is already an **Active** zone in your Cloudflare account, skip the nameserver swap but still audit the DNS records. Otherwise, in Cloudflare choose **Domains → Onboard a domain**, enter `synergyfund.ir`, and choose the Free plan.

Before changing anything at the registrar:

1. Export or screenshot **every current DNS record** from the existing DNS provider. Cloudflare's automatic import may miss records. Record `A`, `AAAA`, `CNAME`, `MX`, `TXT`, `CAA`, and `SRV` records and TTLs, including records for other services.
2. In **Cloudflare → synergyfund.ir → DNS → Records**, recreate records that must remain: particularly mail `MX` and its priorities, SPF/DKIM/DMARC `TXT`, mail host, verification records, and unrelated subdomains. Mail service host records must be **DNS only**, not proxied. If you are unsure what a record does, leave it in place until you identify its owner.
3. Check whether DNSSEC is enabled at the registrar. An old `DS` record can break resolution after a nameserver change. Follow [Cloudflare's DNSSEC migration instructions](https://developers.cloudflare.com/dns/dnssec/), removing the old DS record at the registrar when instructed; re-enable DNSSEC only after the Cloudflare zone is Active.
4. Cloudflare will show **two nameservers assigned to this exact domain**. At the registrar, replace the current authoritative nameservers with those two values. Do not copy nameservers from a tutorial or another domain.
5. Wait until Cloudflare shows the zone as **Active**. Nameserver propagation may take time. Check `dig NS synergyfund.ir +short` against the assigned nameservers. Do not cancel the VPS during this stage.

See Cloudflare's [domain setup guide](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/) for the current onboarding steps. Moving authoritative DNS to Cloudflare does **not** transfer the domain registration; keep paying the registrar for renewal.

## 6. Attach all three website hostnames

Once the domain zone is Active, add hostnames inside the **correct Pages project**:

1. **synergy-dashboard → Custom domains → Set up a domain**: `d.synergyfund.ir`.
2. **synergy-public → Custom domains → Set up a domain**: `synergyfund.ir`.
3. In **synergy-public**, repeat for `www.synergyfund.ir`.

Cloudflare normally creates the corresponding DNS records for a zone in the same account. If a hostname conflicts, inspect the DNS entry for **that exact hostname** and remove/replace only its old VPS website `A`, `AAAA`, or `CNAME` record. Preserve email and unrelated records. Do not point `@`, `www`, or `d` at the old VPS IP. Do not manually create only a CNAME without also adding the hostname under Pages **Custom domains**; that can fail. Wait for the custom domain status and HTTPS certificate to become Active. Pages supplies HTTPS—no nginx or Certbot is needed for these static sites. See [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).

`api.synergyfund.ir` is **not used by this demo**. Leave an existing `api` DNS entry alone until you confirm no other system uses it. If you later shut down the backend, remove stale API records and links deliberately; do not route the API hostname to Pages.

## 7. Make the public buttons use the final dashboard address

In the **public** Pages project only, open **Settings → Environment variables** and set:

```text
NEXT_PUBLIC_PLATFORM_URL=https://d.synergyfund.ir/login/
```

Trigger a **new deployment** of the public project (for example, use **Retry deployment**/**Create deployment** if offered, or push a small committed change). Verify the new deployment is Production and the build log reflects the new value. Changing a `NEXT_PUBLIC_*` variable does not rewrite an already published static build. The dashboard project does not need this variable.

## 8. Final checks before cancelling the VPS

Open these URLs on desktop and mobile, including a private/incognito window:

```text
https://synergyfund.ir/
https://www.synergyfund.ir/
https://synergyfund.ir/contact/
https://synergyfund.ir/robots.txt
https://synergyfund.ir/sitemap.xml
https://d.synergyfund.ir/login/
https://d.synergyfund.ir/dashboard/
https://d.synergyfund.ir/marketplace/
```

Check that all use HTTPS, images and styles load, and a direct refresh of a deeper dashboard route works. The login page must show the update message; guest mode should open without credentials. Try a sample action in the dashboard, refresh, and confirm the demo state persists; then click **بازنشانی دمو** to restore its initial data. In browser DevTools → Network, guest mode should make no request to `api.synergyfund.ir` or your old VPS. Try the public site's dashboard buttons and the browser back button. The contact page must not invite people to send real personal or payment information.

Only after the sites work, back up any VPS data/uploads you wish to keep, check whether another service or mail depends on the VPS, then stop/cancel it. Keep the original full-stack Git repo as an archive. Domain DNS changes can be rolled back by restoring the prior DNS records or nameservers, but first preserve a copy of them.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Build cannot find `package.json` | Project Root directory must be `dashboard` or `public-website`. |
| Build succeeds but site is 404 | Output directory must be `out`; confirm the build created it. |
| Build asks for server/Worker adapter | Select **Next.js (Static HTML Export)**, not a full-stack Next.js preset. Both `next.config.ts` files specify `output: 'export'`. |
| Dashboard tries to call an API | Check `NEXT_PUBLIC_DEMO_MODE=true` in the dashboard project's Production environment and redeploy. Do not set it to `false`. |
| Public button opens the wrong place | Check `NEXT_PUBLIC_PLATFORM_URL` in the public project, then redeploy. |
| Custom domain still shows the VPS | Inspect Pages Custom domains status, then the `A`/`AAAA`/`CNAME` record for that exact hostname. |
| Domain does not resolve after nameserver change | Compare the registrar's nameservers with Cloudflare's assigned pair; check old DNSSEC `DS` records. |
| Email stops working | Restore `MX`, SPF, DKIM, DMARC, and mail host DNS records from your backup. |
| Browser route works via navigation but fails on refresh | Confirm the static build contains that route under `out/`; check the Pages deployment and trailing-slash URL. |

Official references: [Cloudflare's static Next.js Pages guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/), [Pages monorepos](https://developers.cloudflare.com/pages/configuration/monorepos/), [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/), [Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/), and [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports).
