#!/bin/bash

cd ./main
ng build --prod
cp ./app.yaml ./dist/YoutubeCommentView/
cd ./dist/YoutubeCommentView/
gcloud app deploy