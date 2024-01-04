# Steps to reproduce

1. Clone the repository **via ssh**, cd into the directory and install all dependencies.

```bash
git clone git@github.com:virtuallyunknown/nx-changelog-issue.git
cd nx-changelog-issue
pnpm install
```

2. Make any type of modification and commit it.

```bash
touch my_new_feature.txt
git add my_new_feature.txt
git commit -m "feat: added a new feature"
```

3. Make sure there is no `GH_TOKEN` or `GITHUB_TOKEN` environment variable set, so that the `releaseChangelog` command falls back to submitting the github release via the webform instead of the API. Run the `release.ts` script.

```bash
pnpm exec tsx release.ts

# Pick the following options:
# Question #1: ✔ What kind of change is this for your packages? - select any version
# Question #2: ? Do you want to dry run these commands? (Y/n)   - select "n" (no)
#
# Because no github token is available, the API request will fail, and a webform
# with pre-populated options will open in the browser.
```