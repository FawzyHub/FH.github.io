# dos2unix deploy.sh 

if [[ -z "$GITHUB_HEAD_REF" ]]; then
    export BRANCH_NAME=$(git symbolic-ref --short HEAD)
else
    export BRANCH_NAME=$GITHUB_HEAD_REF
fi

echo "Deploying Resources for branch: $BRANCH_NAME"
terraform init -reconfigure -upgrade -backend-config=backend.conf -backend-config="key=fawzy-server/$BRANCH_NAME/tf.state"
terraform validate
terraform apply -var "branch_name=${BRANCH_NAME}" -no-color -auto-approve
terraform output

export MAIN_CLOUDFRONT_DISTRIBUTION_ID=$(terraform output -raw main_ui_aws_cloudfront_distribution_id)

echo "DEPLOYING UI CHANGES"
cd ./code/ui

echo "
VITE_API_PREFIX="api-${BRANCH_NAME}"
VITE_AUTH_API_PREFIX="auth-${BRANCH_NAME}"
" > .env

yarn build
aws s3 sync ./dist "s3://fawzy-server.com" --exclude 'node_modules/*'
aws cloudfront create-invalidation --distribution-id $MAIN_CLOUDFRONT_DISTRIBUTION_ID --paths '/*'

echo "deployment complete"
