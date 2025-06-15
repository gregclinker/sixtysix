#!/bin/zsh
# defaults
SQL_SERVICE_ACCOUNT="sql-client"
PROJECT_ID="alliance-dev-uk"
PROJECT_NUMBER="344691125963"
WORKLOAD_IDENTITY_POOL_ID="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github"
REPO="gregclinker/sixtysix"
GITHUB_SA="git-hub-actions-sa"
#
gcloudExec() {
  echo "gcloud $1 --quiet";
  bash -c "gcloud $1 --quiet";
  echo ""
}

gcloudExec() {
  echo "gcloud $1 --quiet";
  echo ""
  bash -c "gcloud $1 --quiet";
  echo ""
}

addRole() {
  local serviceAccount="$1"
  local project="$2"
  shift
  shift
  local roles=("$@")

  local roleString=""
  for role in "${roles[@]}"; do
    roleString="${roleString} --role=${role}"
  done

  gcloudExec "projects add-iam-policy-binding $project --member=serviceAccount:$serviceAccount$roleString"
}

gcloudExec "config set project $PROJECT_ID"
gcloudExec "config set run/region europe-west2"

#gcloudExec "iam workload-identity-pools create github \
#  --project="${PROJECT_ID}" \
#  --location=\"global\" \
#  --display-name=\"GitHub Actions Pool\""

#gcloudExec "iam workload-identity-pools providers delete \"${PROVIDER_NAME}\" --workload-identity-pool=github --location=global"

gcloudExec "iam workload-identity-pools providers update-oidc \"github-actions2\" \
  --project=\"${PROJECT_ID}\" \
  --location=\"global\" \
  --workload-identity-pool=\"github\" \
  --display-name=\"GitHub repo provider\" \
  --attribute-mapping=\"google.subject=assertion.sub,attribute.aud=assertion.aud,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_name=assertion.repository_name\" \
  --attribute-condition=\"assertion.repository_nme=='gregclinker/sixtysix'\" \
  --issuer-uri=\"https://token.actions.githubusercontent.com\""

gcloudExec "iam workload-identity-pools providers describe 'github-actions2' \
  --project=\"${PROJECT_ID}\" \
  --location=\"global\" \
  --workload-identity-pool=\"github\" \
  --format=\"value(name)\""

#gcloudExec "iam service-accounts create \"git-hub-actions-sa\" --project \"${PROJECT_ID}\""

# ${REPO} is the full repo name including the parent GitHub organization,
# such as "my-org/my-repo".
#
# ${WORKLOAD_IDENTITY_POOL_ID} is the full pool id, such as
# "projects/123456789/locations/global/workloadIdentityPools/github".
gcloudExec "iam service-accounts add-iam-policy-binding \"${GITHUB_SA}@${PROJECT_ID}.iam.gserviceaccount.com\" \
  --project=\"${PROJECT_ID}\" \
  --role=\"roles/iam.workloadIdentityUser\" \
  --member=\"principalSet://iam.googleapis.com/${WORKLOAD_IDENTITY_POOL_ID}/attribute.repository/${REPO}\""