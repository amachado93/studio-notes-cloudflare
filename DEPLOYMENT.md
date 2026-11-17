# Deployment guide

Studio Notes builds to plain static files. Cloudflare Pages and Netlify are both suitable; no provider-specific runtime or configuration is required.

## 1. Put the project on GitHub

From the project directory:

```sh
git init
git add .
git commit -m "Initial Studio Notes journal"
git branch -M main
```

Create an empty repository on GitHub, then follow GitHub's instructions to add its `origin` remote and push:

```sh
git remote add origin git@github.com:YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Do not commit `.env` files, credentials, `node_modules/`, or `dist/`; `.gitignore` already excludes them.

## 2. Import into a static host

### Cloudflare Pages

1. In the Cloudflare dashboard, open **Workers & Pages** and create a **Pages** project.
2. Connect the GitHub repository and select the `main` production branch.
3. Choose the **Astro** framework preset if offered, or enter the settings below manually.
4. Add the environment variable described in step 3, then deploy.

### Netlify

1. In the Netlify dashboard, choose **Add new site → Import an existing project**.
2. Connect GitHub and select the repository.
3. Use the settings below and add the environment variable from step 3.
4. Deploy the `main` branch.

### Build settings for either host

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output / publish directory | `dist` |
| Production branch | `main` |
| Node version | `24` (or a supported Node 22.23.4+ release) |

No serverless functions, database, API keys, or build plugins are needed.

## 3. Set the public URL

After the host assigns an HTTPS preview domain, add this environment variable in the project's production environment settings:

```text
PUBLIC_SITE_URL=https://YOUR-ASSIGNED-PREVIEW-DOMAIN
```

Use only the origin: no trailing slash or path. Redeploy after setting it. This value is required for correct canonical links, sitemap entries, and absolute RSS links/images. Without it, builds use `http://localhost:4321`, which is suitable only for local development.

## 4. Verify the deployment

Visit the preview domain and check:

- `/` shows entries newest first and images fit without cropping.
- An entry number opens its `/entries/<slug>/` permalink.
- `/archive/` lists every entry by publication year.
- `/about/` contains your edited text.
- `/rss.xml` loads and its entry/image URLs use the preview HTTPS origin.
- `/sitemap-index.xml` loads.
- Keyboard focus is visible and the layout works at mobile and desktop widths.

Then test the real publishing workflow: add a Markdown entry and image, commit, and push to `main`. The host should build and deploy automatically. Build logs are available in the host dashboard if deployment fails.

## 5. Custom domain later

Domain connection is intentionally **not** part of this build. When the preview site is ready, use the host's custom-domain flow and follow its exact DNS instructions at GoDaddy. Do not transfer the domain. After HTTPS works on the custom domain:

1. Change `PUBLIC_SITE_URL` to `https://your-custom-domain.example`.
2. Redeploy.
3. Recheck canonical URLs, RSS, and the sitemap.
4. Configure any old-preview-domain redirect using the host's controls, if desired.

No nameserver or DNS records are prescribed here because they depend on the selected host and its instructions at setup time.
