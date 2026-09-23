# Synergy Fund portfolio demo

This repository contains only the two frontends intended for Cloudflare Pages:

| Cloudflare Pages project | Root directory | Final address |
| --- | --- | --- |
| Public website | `public-website` | `https://synergyfund.ir` and `https://www.synergyfund.ir` |
| Guest dashboard | `dashboard` | `https://d.synergyfund.ir` |

Both apps are Next.js static exports. The dashboard uses browser-only demo data; it does not require a Django server, database, payment service, or VPS. Login shows an update notice and a guest demo button. Demo changes are stored in each visitor's browser and can be reset from the dashboard banner. No real account or transaction is created.

## 1. Check both builds before publishing

Use Node.js 22. Run these from this repository's root:

```bash
cd dashboard
npm ci
npm run build

cd ../public-website
npm ci
npm run build
```

Each app must create its own `out/` folder. Do not commit `node_modules/`, `.next/`, `out/`, `.env.local`, secrets, or old VPS data. The application `.gitignore` files exclude the generated folders and local environment files.

## 2. Put this repository on GitHub

This local repository currently has no GitHub remote. Create a new, empty GitHub repository for the demo frontends. In this repository, check the current branch (`master` at the time this guide was written) and add the new repository URL:

```bash
git status
git branch --show-current
git remote add origin https://github.com/YOUR_USERNAME/YOUR_NEW_REPO.git
git push -u origin master
```

Replace the example URL with the real GitHub URL. If you rename the branch, push that branch and select the same branch as the Cloudflare **Production branch**. Do not connect the old full-stack `synergyy` repository to these new Pages projects if you want Cloudflare's build checkout to contain only frontend source.

## 3. Deploy the dashboard to Cloudflare Pages

In [Cloudflare Dashboard](https://dash.cloudflare.com/), go to **Workers & Pages → Create application → Pages → Import an existing Git repository**. Connect the new GitHub repo and enter:

| Setting | Value |
| --- | --- |
| Project name | `synergy-dashboard` (or another available name) |
| Production branch | `master`, unless you renamed it |
| Framework preset | `Next.js (Static HTML Export)` |
| Root directory | `dashboard` |
| Build command | `npm run build` |
| Build output directory | `out` |

Add build environment variables:

```text
NODE_VERSION=22
NEXT_PUBLIC_DEMO_MODE=true
```

Set these in Production and Preview if you use preview deployments. Do not add `SESSION_SECRET`, `NEXT_PUBLIC_API_URL`, database credentials, or a Pages Function. Click **Save and Deploy**. Record the dashboard preview URL Cloudflare gives you, for example `https://synergy-dashboard.pages.dev`.

Open `<dashboard-preview-url>/login/` and click **ادامه در حالت دمو (مهمان)**. Confirm that `/dashboard/` and `/marketplace/` load.

## 4. Deploy the public website to a second Pages project

Create another Pages project from the **same new GitHub repository**:

| Setting | Value |
| --- | --- |
| Project name | `synergy-public` (or another available name) |
| Production branch | the same branch used above |
| Framework preset | `Next.js (Static HTML Export)` |
| Root directory | `public-website` |
| Build command | `npm run build` |
| Build output directory | `out` |

Use these build environment variables for the first deployment:

```text
NODE_VERSION=22
NEXT_PUBLIC_SITE_URL=https://synergyfund.ir
NEXT_PUBLIC_PLATFORM_URL=https://YOUR-DASHBOARD-PROJECT.pages.dev/login/
```

Replace `YOUR-DASHBOARD-PROJECT.pages.dev` with the dashboard preview URL from Step 3. Deploy. Open the public preview and verify that its dashboard buttons open the dashboard preview login. The public contact page shows a maintenance message; it does not submit to an API.

The `NEXT_PUBLIC_*` settings become part of the built files. After changing one, trigger a new deployment; changing the setting alone does not update an existing deployment.

## 5. Move domain DNS to Cloudflare

You need control of the domain `synergyfund.ir` at the registrar where it was registered. Domain registration and renewal are separate from free Pages hosting.

If the domain is already **Active** under **Cloudflare → Domains**, skip the nameserver change and review its DNS records. Otherwise:

1. In Cloudflare, choose **Domains → Onboard a domain**, enter `synergyfund.ir`, and select the Free plan.
2. In the current DNS provider's panel, copy or screenshot **all existing DNS records**. Cloudflare's automatic scan may miss records.
3. In **Cloudflare → synergyfund.ir → DNS → Records**, recreate all records still needed by other services, especially MX records and their priorities; TXT records for SPF, DKIM, DMARC, and verification; mail host records; and unrelated subdomains. Mail host records should be **DNS only**, not proxied.
4. If DNSSEC is enabled at the registrar, follow Cloudflare's guidance to remove or disable the old DS record before changing nameservers. It can be re-enabled after Cloudflare becomes Active.
5. At the registrar, replace the old authoritative nameservers with the **two exact nameservers assigned to this domain by Cloudflare**. Do not use nameservers from an example or another account.
6. Wait for the domain to show **Active** in Cloudflare. Nameserver changes can take up to 24 hours. `dig NS synergyfund.ir +short` should show the assigned Cloudflare nameservers.

Cloudflare nameservers are required to attach the root domain `synergyfund.ir` to Pages. Preserve mail and unrelated DNS records when replacing the old VPS website records. See [Cloudflare domain onboarding](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/).

## 6. Attach the custom domains inside Pages

Add the hostname **inside the correct Pages project first**:

1. **synergy-dashboard → Custom domains → Set up a domain:** `d.synergyfund.ir`.
2. **synergy-public → Custom domains → Set up a domain:** `synergyfund.ir`.
3. In the public project, repeat for `www.synergyfund.ir`.

Cloudflare should create the corresponding DNS records. If a custom domain reports a conflict, remove only the old VPS `A`, `AAAA`, or `CNAME` record for that exact hostname (`@`, `www`, or `d`) and retry. Do not remove mail records.

| Name | Final destination |
| --- | --- |
| `@` (`synergyfund.ir`) | Public Pages project |
| `www` | Public Pages project |
| `d` | Dashboard Pages project |
| `api` | Not used by the demo; remove its old record only after checking nothing else needs it |

Do not point these website hostnames to the VPS IP. Wait for **Active** status in each Pages project's Custom domains area and for HTTPS certificates to become valid. You do not need nginx or Certbot for Pages. Adding a DNS CNAME without attaching the hostname inside Pages is insufficient. See [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).

For a single canonical public address, you may later create a Cloudflare Redirect Rule from `www.synergyfund.ir` to `synergyfund.ir`, preserving the path and query string. Verify both hostnames work before adding that rule.

## 7. Replace the public site's preview link

In **synergy-public → Settings → Environment variables**, change:

```text
NEXT_PUBLIC_PLATFORM_URL=https://d.synergyfund.ir/login/
```

Redeploy the **public** Pages project. Its dashboard buttons should now open the final dashboard domain.

## 8. Check the live result

Open these addresses in a normal browser and on another device or network:

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

Check that the login update message is visible, guest mode opens without credentials, the marketplace has demo projects, a demo action survives a refresh, and **بازنشانی دمو** restores sample data. Refresh a deep route directly, such as a project detail page. In browser DevTools → Network, demo actions should not call `api.synergyfund.ir`. Check HTTPS on the public and dashboard domains.

After the Pages sites work, save any VPS database or uploaded files you want to keep. Stop the old VPS services, verify the two sites still work, and then cancel the VPS if nothing else uses it.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| `package.json` not found during a Pages build | Set the correct root directory: `dashboard` or `public-website`. |
| Build passes but Pages displays 404 | Build output directory must be `out`. |
| Dashboard TypeScript reports missing `useForm` | Run `npm ci` from `dashboard/` to replace a stale or damaged local `node_modules`; the lockfile is valid. |
| Public button opens the wrong dashboard | Check `NEXT_PUBLIC_PLATFORM_URL` and redeploy the public project. |
| Domain still shows the VPS | Check Pages Custom domains status and remove the conflicting old website DNS record. |
| Domain fails after switching nameservers | Check the exact assigned nameservers and old DNSSEC/DS record. |
| Email stops working | Restore the mail provider's MX, SPF, DKIM, DMARC, and mail host records. |

Cloudflare's [Next.js static export guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/) documents the Pages preset and `out` directory. Its [monorepo guide](https://developers.cloudflare.com/pages/configuration/monorepos/) explains using two projects from one Git repository.
