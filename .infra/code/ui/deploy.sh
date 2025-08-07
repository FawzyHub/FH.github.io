if [[ -z "$GITHUB_HEAD_REF" ]]; then
    export BRANCH_NAME=$(git symbolic-ref --short HEAD)
else
    export BRANCH_NAME=$GITHUB_HEAD_REF
fi

echo "Deploying resources for $BRANCH_NAME"

echo "
VITE_API_PREFIX="api-${BRANCH_NAME}"
" > .env

yarn build
if [ "$BRANCH_NAME" = main ]; then
    aws s3 sync ./dist "s3://ltrdigest.com" --exclude 'node_modules/*'
    aws cloudfront create-invalidation --distribution-id E1CKEP7Q81UUYU --paths '/*'
    aws cloudfront create-invalidation --distribution-id E3FJBHJHNG2K1T --paths '/*'
else
    aws s3 sync ./dist "s3://${BRANCH_NAME}.ltrdigest.com" --exclude 'node_modules/*'
fi    
