#!/usr/bin/python

from apiclient.discovery import build
from apiclient.errors import HttpError
from oauth2client.tools import argparser
import sys

YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"

# return: ( Array<(title,id)>, token )
def youtube_search_completed(channel_id,developer_key,next_token=None):
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,developerKey=developer_key)

    search_response = youtube.search().list(
        channelId=channel_id,
        part="id,snippet",
        type="video",
        eventType="completed",
        pageToken=next_token,
        maxResults=50
    ).execute()

    videos = [ (search_result["snippet"]["title"], search_result["id"]["videoId"]) 
        for search_result in search_response.get("items", []) if search_result["id"]["kind"] == "youtube#video"
    ]
    token = search_response.get("nextPageToken")

    return (videos,token)


if __name__ == "__main__":
    arges = sys.argv
    channel_id=arges[1]
    developer_key=arges[2]

    try:
        test = youtube_search_completed(channel_id,developer_key)
    except HttpError as e:
        print ("An HTTP error %d occurred:\n%s" % (e.resp.status, e.content))