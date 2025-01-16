# this is a simple migration of the old deploy script
# effectively, we will search for the below variables in all of the files
# and replace them from the environment

GA4_TRACKING_ID=$GA4_TRACKING_ID
GA_ADS_TRACKING_CODE=$GA_ADS_TRACKING_CODE
LVED_APP_URL=$LVED_APP_URL

echo "Printing the working directory and the file structure"
pwd
ls -la

echo "Beginning the push..."

# the old deploy pretty much moved all of this stuff to the cloudfront
# but, that's a problem; for example, the .gitignore file; so we will build
# everything locally, put in ./dist, and then upload

rm -rf ./dist
mkdir ./dist
cp -r ./* ./dist
rm -rf ./dist/.git ./dist/.gitignore ./dist/deploy.sh ./dist/live-server.js ./dist/dist

# we will loop over all .html files in the dist folder and replace the variables
# and then make a copy without the .html so /pricing.html and /pricing both work
# we have a special case with 404.html, so we will copy error404.html to 404.html
cp ./dist/error404.html ./dist/404.html

echo "Processing all .html files with the replacements and then creating none *.html copies"
echo "Note that if we move to CloudFlare, this is automatic, so we can remove the stripped versions"

for i in ./dist/*.html ./dist/articles/*.html; do
    [ -f "$i" ] || break
    sed -i -e s/GA_TRACKING_CODE/$GA4_TRACKING_ID/g $i
    sed -i -e s/app.lved.com/$LVED_APP_URL/g $i
    sed -i -e s/GA_ADS_TRACKING_CODE/$GA_ADS_TRACKING_CODE/g $i
    rm -rf $i+"-e"
done

# remove any legacy sed outputs that didn't get cleaned up
echo "Cleaning up"
find . -name "*.html-e" -type f -delete
