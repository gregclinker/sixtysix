#!/bin/zsh
# defaults
PROJECT_ID="alliance-dev-uk"
PROJECT_NUMBER="344691125963"
PROVIDER_NAME="github-gcp-deploy2"
WORKLOAD_IDENTITY_POOL_ID="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github"
REPO="gregclinker/sixtysix"
#
gcloudExec() {
  echo "gcloud $1 --quiet";
  bash -c "gcloud $1 --quiet";
  echo ""
}

gcloudExec "config set project $PROJECT_ID"
gcloudExec "config set run/region europe-west2"

#gcloudExec "iam workload-identity-pools create github \
#  --project="${PROJECT_ID}" \
#  --location=\"global\" \
#  --display-name=\"GitHub Actions Pool\""

gcloudExec "iam workload-identity-pools providers create-oidc \"${PROVIDER_NAME}\" \
  --project=\"${PROJECT_ID}\" \
  --location=\"global\" \
  --workload-identity-pool=\"github\" \
  --display-name=\"GitHub repo provider\" \
  --attribute-mapping=\"google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository\" \
  --attribute-condition=\"assertion.repository=='${REPO}'\" \
  --issuer-uri=\"https://token.actions.githubusercontent.com\""

gcloudExec "iam workload-identity-pools providers describe '${PROVIDER_NAME}' \
  --project=\"${PROJECT_ID}\" \
  --location=\"global\" \
  --workload-identity-pool=\"github\" \
  --format=\"value(name)\""

gcloudExec "iam service-accounts add-iam-policy-binding \"${PROJECT_NUMBER}-compute@developer.gserviceaccount.com\" \
  --project=\"${PROJECT_ID}\" \
  --role=\"roles/iam.workloadIdentityUser\" \
  --member=\"principalSet://iam.googleapis.com/${WORKLOAD_IDENTITY_POOL_ID}/attribute.repository/${REPO}\""