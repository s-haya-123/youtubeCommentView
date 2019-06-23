from bs4 import BeautifulSoup
import json
import requests

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

target_url = "https://www.youtube.com/watch?v=juRmM7oa2Jg"
session = requests.Session()

# まず動画ページにrequestsを実行しhtmlソースを手に入れてlive_chat_replayの先頭のurlを入手
html = requests.get(target_url)
soup = BeautifulSoup(html.text, "html.parser")
next_url = get_next_url_from_soup(soup)



while(1):
    try:
        (comment_data,next_url) = get_comment_data(session,next_url)
        print(next_url)
    except:
        break
