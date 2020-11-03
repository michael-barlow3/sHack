# Script to pull from docker repo all the different services for the VistA Audit Solution
./pullutils.sh
./pullMetadata.sh
./pullSubscriber.sh
./pullRedshift.sh
# Note the subscriber is not a docker container and must be uploaded separately as a ZIP file.