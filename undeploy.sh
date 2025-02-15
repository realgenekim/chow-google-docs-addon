#!/bin/bash

# Get all deployment IDs, excluding the latest "@HEAD"
deployments=$(clasp deployments | grep -v "@HEAD" | awk '{print $2}')

echo "Found deployments to delete:"
echo "$deployments"

# Confirm before deletion
read -p "Are you sure you want to undeploy all but the latest? (y/N): " confirm
if [[ $confirm != "y" ]]; then
  echo "Operation canceled."
  exit 1
fi

# Loop through deployment IDs and delete them
for deployment in $deployments; do
  echo "Deleting deployment: $deployment"
  clasp undeploy $deployment
done

echo "✅ All old deployments removed. Latest deployment (@HEAD) is retained."
