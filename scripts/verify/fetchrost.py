import json,urllib.request,urllib.parse,time,os
UA={"User-Agent":"WWE2K27RosterTracker/1.0 (fan project)"}
G={"SD1":"WWF SmackDown!","SD2":"WWF SmackDown! 2: Know Your Role","JBI":"WWF SmackDown! Just Bring It","SYM":"WWE SmackDown! Shut Your Mouth","HCTP":"WWE SmackDown! Here Comes the Pain","SVR":"WWE SmackDown! vs. Raw","SVR06":"WWE SmackDown! vs. RAW 2006","SVR07":"WWE SmackDown vs. Raw 2007","SVR08":"WWE SmackDown vs. Raw 2008","SVR09":"WWE SmackDown vs. Raw 2009","SVR10":"WWE SmackDown vs. Raw 2010","SVR11":"WWE SmackDown vs. Raw 2011","W12":"WWE '12","W13":"WWE '13","2K14":"WWE 2K14","2K15":"WWE 2K15","2K16":"WWE 2K16","2K17":"WWE 2K17","2K18":"WWE 2K18","2K19":"WWE 2K19","2K20":"WWE 2K20","2K22":"WWE 2K22","2K23":"WWE 2K23","2K24":"WWE 2K24","2K25":"WWE 2K25","2K26":"WWE 2K26"}
def wikitext(host,title):
    q=urllib.parse.urlencode({"action":"parse","page":title,"prop":"wikitext","format":"json","redirects":1})
    try:
        j=json.load(urllib.request.urlopen(urllib.request.Request(f"https://{host}/api.php?"+q,headers=UA)))
        return j.get("parse",{}).get("wikitext",{}).get("*","")
    except Exception: return ""
if __name__=="__main__":
  os.makedirs("rosters",exist_ok=True)
  for code,t in G.items():
      parts=[]
      for host,title in [("prowrestling.fandom.com",t+"/Roster"),("prowrestling.fandom.com",t),("smackdown.fandom.com",t+" Roster"),("smackdown.fandom.com",t)]:
          w=wikitext(host,title); time.sleep(0.4)
          if w: parts.append(f"<<<{host}|{title}>>>\n"+w)
      open(f"rosters/{code}.txt","w").write("\n".join(parts))
      print(code,[len(p) for p in parts])
