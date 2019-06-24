from bs4 import BeautifulSoup
import json
import requests
from Comment import Comment

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

def translate_comment_data_to_comment_dto(comment_data):
    if "addChatItemAction" not in comment_data["replayChatItemAction"]["actions"][0]:
        return
    item = comment_data["replayChatItemAction"]["actions"][0]["addChatItemAction"]["item"]
    timestamp_msec = comment_data["replayChatItemAction"]["videoOffsetTimeMsec"]
    if "liveChatPaidMessageRenderer" in item:
        return translate_live_paid_to_dto(item["liveChatPaidMessageRenderer"],timestamp_msec)
    elif "liveChatTextMessageRenderer" in item:
        return translate_live_text_to_dto(item["liveChatTextMessageRenderer"],timestamp_msec)
    else:
        return 

def translate_live_text_to_dto(live_text,timestamp_msec):
    id = live_text["id"]
    message = live_text["message"]
    author_name = live_text["authorName"]["simpleText"]
    thumbnails = live_text["authorPhoto"]["thumbnails"][0]["url"]
    timestamp_text = live_text["timestampText"]["simpleText"]
    purcahse_amount = ""
    return Comment(id,message,author_name,thumbnails,timestamp_msec,timestamp_text,purcahse_amount)



def translate_live_paid_to_dto(live_paid,timestamp_msec):
    id = live_paid["id"]
    message =  live_paid["message"] if "message" in live_paid else ""
    author_name = live_paid["authorName"]["simpleText"]
    thumbnails = live_paid["authorPhoto"]["thumbnails"][0]["url"]
    timestamp_text = live_paid["timestampText"]["simpleText"]
    purcahse_amount = live_paid["purchaseAmountText"]["simpleText"]
    return Comment(id,message,author_name,thumbnails,timestamp_msec,timestamp_text,purcahse_amount)

target_url = "https://www.youtube.com/watch?v=juRmM7oa2Jg"
session = requests.Session()

# まず動画ページにrequestsを実行しhtmlソースを手に入れてlive_chat_replayの先頭のurlを入手
html = requests.get(target_url)
soup = BeautifulSoup(html.text, "html.parser")
next_url = get_next_url_from_soup(soup)
while(1):
    try:
        (comment_data,next_url) = get_comment_data(session,next_url)
        comments = [ translate_comment_data_to_comment_dto(data) for data in comment_data if data is Comment]
        print(next_url)
    except:
        break
