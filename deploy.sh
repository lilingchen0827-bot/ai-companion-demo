#!/usr/bin/env bash
# ============================================================
#  One-command deploy to GitHub Pages (public)
#  Usage:  ./deploy.sh <github_username> <personal_access_token>
#
#  The PAT needs the "repo" scope (full control of repos).
#  After deploy you can delete/revoke the token — it is only
#  used once to create the repo and push.
# ============================================================
set -e

USER="$1"
TOKEN="$2"
REPO="ai-companion-demo"

if [ -z "$USER" ] || [ -z "$TOKEN" ]; then
  echo "Usage: ./deploy.sh <github_username> <personal_access_token>"
  exit 1
fi

echo ">> Creating GitHub repo '$REPO' (ignored if it already exists) ..."
curl -s -o /dev/null -w "   create repo -> HTTP %{http_code}\n" \
  -X POST -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO\",\"description\":\"AI Family Companion - interactive web demo (English, no backend)\",\"homepage\":\"https://$USER.github.io/$REPO/\",\"private\":false,\"auto_init\":false,\"has_projects\":false,\"has_wiki\":false}"

echo ">> Setting remote and pushing to main ..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://$TOKEN@github.com/$USER/$REPO.git"
git push -u origin main --force

echo ">> Enabling GitHub Pages on branch main (root) ..."
curl -s -o /dev/null -w "   enable pages -> HTTP %{http_code}\n" \
  -X POST -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/$USER/$REPO/pages \
  -d '{"source":{"branch":"main","path":"/"}}' || \
  echo "   (Pages may already be enabled, or needs a moment)"

echo ""
echo "DONE. Wait ~1 minute for GitHub to build the site, then open:"
echo "   https://$USER.github.io/$REPO/"
