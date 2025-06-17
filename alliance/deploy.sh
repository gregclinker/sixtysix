#!/bin/zsh
#
REVISION="$(sed "s/\./-/g" <<< "$VERSION")"
BUILD_PROJECT="alliance-dev-uk"
#
date
echo "started alliance"
#
git stash
echo git checkout $VERSION
git checkout $VERSION
git status
#
echo gcloud config set project $PROJECT
gcloud config set project $PROJECT
#
echo gcloud config set run/region europe-west2
gcloud config set run/region europe-west2
#
if [ $NEW = "true" ]; then
  echo gcloud services enable run.googleapis.com cloudbuild.googleapis.com
  gcloud services enable run.googleapis.com cloudbuild.googleapis.com
  #
  echo gcloud projects add-iam-policy-binding boardrunner --member=serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com --role=roles/cloudbuild.builds.builder
  gcloud projects add-iam-policy-binding boardrunner --member=serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com --role=roles/cloudbuild.builds.builder
fi
#
if [ $DELETE = "true" ]; then
  echo gcloud run services delete alliance --quiet
  gcloud run services delete alliance --quiet
  #
fi
#
gcloud -q run deploy alliance --allow-unauthenticated --revision-suffix=$REVISION \
  --set-env-vars PROJECT_NUMBER=$PROJECT_NUMBER \
  --set-env-vars CONSTITUENCY=$CONSTITUENCY \
  --timeout=1800 \
  --source .
#
echo "finished alliance"
date
#
