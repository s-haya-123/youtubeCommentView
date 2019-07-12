#!/usr/bin/python

from apiclient.discovery import build
from apiclient.errors import HttpError
from oauth2client.tools import argparser

DEVELOPER_KEY = ""
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"

# return: ( Array<(title,id)>, token )
def youtube_search_completed(channel_id,next_token=None):
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,developerKey=DEVELOPER_KEY)

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
    channel_id="UCD-miitqNY3nyukJ4Fnf4_A"

    try:
        test = youtube_search_completed(channel_id)
    except HttpError as e:
        print ("An HTTP error %d occurred:\n%s" % (e.resp.status, e.content))