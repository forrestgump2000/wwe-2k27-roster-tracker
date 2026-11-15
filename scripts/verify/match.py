import re,json,unicodedata,glob,os,sys
def norm(s):
    s=unicodedata.normalize("NFD",s); s="".join(c for c in s if not unicodedata.combining(c)).lower()
    s=re.sub(r"[‘’'`\".!]","",s); s=re.sub(r"\(.*?\)","",s)
    s=re.sub(r"\b(19|20)?\d\d\b","",s)            # variant years like '12, 2005
    s=re.sub(r"\bwm\d+\b","",s)
    s=re.sub(r"^elite\s+","",s.strip())
    return re.sub(r"[^a-z0-9]+"," ",s).strip()
GAMES=["SD1","SD2","JBI","SYM","HCTP","SVR","SVR06","SVR07","SVR08","SVR09","SVR10","SVR11","W12","W13","2K14","2K15","2K16","2K17","2K18","2K19","2K20","2K22","2K23","2K24","2K25","2K26"]
SPIN=["SWM","RR93","RAW94","WMARC","WZ","ATT","WM2K","NM","RR","WMXIX","DOR","DOR2","LOW","AS","BG"]
def names_in(code):
    t=open(f"rosters/{code}.txt").read()
    out=set()
    for a in re.findall(r"\[\[([^\]]+)\]\]",t):
        for part in a.split("|"): out.add(norm(part.split("#")[0]))
    for line in t.splitlines():
        m=re.match(r"^[*#]+\s*([^\[\]{}|<]+?)\s*$",line)
        if m: out.add(norm(m.group(1)))
        for cell in re.split(r"\|\||\n\|",line):
            c=re.sub(r"\[\[|\]\]","",cell).strip(" |")
            if 2<len(c)<40: out.add(norm(c.split("|")[-1]))
    return out
if __name__=="__main__":
  R={c:names_in(c) for c in GAMES+SPIN}
  json.dump({k:sorted(v) for k,v in R.items()},open("rosters/norm.json","w"))
  print({c:len(v) for c,v in R.items()})
