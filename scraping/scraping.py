from bs4 import BeautifulSoup
import re
import json
import requests
from Comment import Comment
from CommentDatabase import CommentDatabase
from CommentDatabase import CommentDatabaseLocalPostgres
from Movie import Movie
from MovieDatabase import MovieDatabase
from MovieDatabase import MovieDatabaseLocalPostgres

def get_next_url_from_soup(soup):
    for iframe in soup.find_all("iframe"):
        if("live_chat_replay" in iframe["src"]):
            return iframe["src"]
    return

def get_next_url_from_dict_comment(dict_comment):
    continue_url = dict_comment["continuationContents"]["liveChatContinuation"]["continuations"][0]["liveChatReplayContinuationData"]["continuation"]
    return "https://www.youtube.com/live_chat_replay?continuation=" + continue_url

def get_comment_data_from_dict_comment(dict_comment):
    return dict_comment["continuationContents"]["liveChatContinuation"]["actions"][1:]
    
def get_dict_comment(soup):
    dict_str = ""
    for scrp in soup.find_all("script"):
        if "window[\"ytInitialData\"]" in scrp.text:
            dict_str = scrp.text.split(" = ")[1]
    dict_str = dict_str.replace("false","False").replace("true","True").rstrip("  \n;")
    return eval(dict_str)

def get_comment_data(session,target_url):
    headers = {'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'}
    html = session.get(target_url,headers=headers)
    soup = BeautifulSoup(html.text, "lxml")
    dict_comment = get_dict_comment(soup)
    next_url = get_next_url_from_dict_comment(dict_comment)
    comment_data = get_comment_data_from_dict_comment(dict_comment)
    return (comment_data,next_url)

def translate_comment_data_to_comment_dto(comment_data, movie_id):
    if "addChatItemAction" not in comment_data["replayChatItemAction"]["actions"][0]:
        return
    item = comment_data["replayChatItemAction"]["actions"][0]["addChatItemAction"]["item"]
    timestamp_msec = comment_data["replayChatItemAction"]["videoOffsetTimeMsec"]
    if "liveChatPaidMessageRenderer" in item:
        return translate_live_paid_to_dto(item["liveChatPaidMessageRenderer"],timestamp_msec,movie_id)
    elif "liveChatTextMessageRenderer" in item:
        return translate_live_text_to_dto(item["liveChatTextMessageRenderer"],timestamp_msec,movie_id)
    else:
        return 

def translate_live_text_to_dto(live_text,timestamp_msec,movie_id):
    id = live_text["id"]
    message = live_text["message"]["runs"][0]["text"]
    author_name = live_text["authorName"]["simpleText"]
    thumbnails = live_text["authorPhoto"]["thumbnails"][0]["url"]
    timestamp_text = live_text["timestampText"]["simpleText"]
    purchase_amount = ""
    return Comment(id,message,author_name,thumbnails,timestamp_msec,timestamp_text,purchase_amount,movie_id)



def translate_live_paid_to_dto(live_paid,timestamp_msec,movie_id):
    id = live_paid["id"]
    message =  live_paid["message"]["runs"][0]["text"] if "message" in live_paid else ""
    author_name = live_paid["authorName"]["simpleText"]
    thumbnails = live_paid["authorPhoto"]["thumbnails"][0]["url"]
    timestamp_text = live_paid["timestampText"]["simpleText"]
    purchase_amount = live_paid["purchaseAmountText"]["simpleText"]
    return Comment(id,message,author_name,thumbnails,timestamp_msec,timestamp_text,purchase_amount,movie_id)

def insert_comment(database: CommentDatabase, comment: Comment):
    database.upload_comment(comment)

def insert_movie(database: MovieDatabase, movie: Movie):
    database.upload_movie(movie)

movie_id = "CiWwSenltbc"
target_url = "https://www.youtube.com/watch?v=" + movie_id
session = requests.Session()

# まず動画ページにrequestsを実行しhtmlソースを手に入れてlive_chat_replayの先頭のurlを入手
html = requests.get(target_url)
soup = BeautifulSoup(html.text, "html.parser")
next_url = get_next_url_from_soup(soup)
title = re.search(r"(.*) - YouTube",soup.title.string).group(1)

insert_movie(MovieDatabaseLocalPostgres(),Movie(movie_id,title))

while(1):
    try:
        (comment_data,next_url) = get_comment_data(session,next_url)
        comments = [data for data in [ translate_comment_data_to_comment_dto(data,movie_id) for data in comment_data ] if data is not None]
        database = CommentDatabaseLocalPostgres()
        for comment in comments:
            insert_comment(database,comment)
    except:
        break