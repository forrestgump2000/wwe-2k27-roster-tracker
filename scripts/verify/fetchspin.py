import json,urllib.request,urllib.parse,time
from fetchrost import wikitext
S={"WMNES":["WWF WrestleMania (video game)","WWF WrestleMania (1989 video game)"],"SWM":["WWF Super WrestleMania"],"RR93":["WWF Royal Rumble (1993 video game)","WWF Royal Rumble (1993)"],"RAW94":["WWF Raw (1994 video game)","WWF Raw (video game)"],"WMARC":["WWF WrestleMania: The Arcade Game"],"WZ":["WWF War Zone"],"ATT":["WWF Attitude"],"WM2K":["WWF WrestleMania 2000"],"NM":["WWF No Mercy"],"RR":["WWF Royal Rumble (2000 video game)","WWF Royal Rumble (2000)"],"RAW":["WWF Raw (2002 video game)","WWF Raw (2002)"],"WMX8":["WWF WrestleMania X8"],"WMXIX":["WWE WrestleMania XIX"],"RAW2":["WWE Raw 2"],"DOR":["WWE Day of Reckoning"],"DOR2":["WWE Day of Reckoning 2"],"LOW":["WWE Legends of WrestleMania"],"AS":["WWE All Stars"],"SC":["WWE SuperCard"],"BG":["WWE 2K Battlegrounds"]}
for code,titles in S.items():
    parts=[]
    for t in titles:
        for host,title in [("prowrestling.fandom.com",t+"/Roster"),("prowrestling.fandom.com",t),("smackdown.fandom.com",t+" Roster"),("smackdown.fandom.com",t)]:
            w=wikitext(host,title); time.sleep(0.3)
            if w: parts.append(f"<<<{host}|{title}>>>\n"+w)
    open(f"rosters/{code}.txt","w").write("\n".join(parts))
    print(code,[len(p) for p in parts])
