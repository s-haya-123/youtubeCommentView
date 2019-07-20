#!/bin/bash

(cd ./scraping; docker-compose up -d)
(cd ./server; nodebrew use 8;functions start; nodebrew use 11; npx tsc --watch &)
