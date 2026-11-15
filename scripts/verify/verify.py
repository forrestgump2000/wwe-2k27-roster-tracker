import json,re
from match import norm, GAMES, SPIN
R={k:set(v) for k,v in json.load(open("rosters/norm.json")).items()}
W=json.load(open("wrestlers.json"))
A={ # extra ring names / alternate listings
"stone-cold-steve-austin":["steve austin","stone cold"],"the-rock":["rocky maivia","dwayne johnson"],"the-undertaker":["undertaker","american badass undertaker","deadman undertaker"],
"triple-h":["hunter hearst helmsley","hhh"],"shawn-michaels":["hbk"],"mick-foley":["mankind","cactus jack","dude love"],"big-show":["the big show","paul wight"],
"kane":["kane"],"batista":["dave batista","dave bautista"],"x-pac":["sean waltman","syxx","1 2 3 kid"],"jbl":["john bradshaw layfield","bradshaw"],"ron-simmons":["faarooq"],
"bubba-ray-dudley":["bubba ray dudley","bully ray"],"d-von-dudley":["d von dudley","devon dudley"],"kevin-nash":["diesel"],"razor-ramon":["scott hall"],
"mr-perfect":["curt hennig"],"randy-savage":["macho man randy savage","macho man"],"roddy-piper":["rowdy roddy piper"],"jake-roberts":["jake the snake roberts","jake the snake"],
"ted-dibiase":["million dollar man ted dibiase","the million dollar man"],"ricky-steamboat":["ricky the dragon steamboat"],"british-bulldog":["davey boy smith"],"diamond-dallas-page":["ddp"],
"vader":["big van vader"],"hulk-hogan":["hollywood hulk hogan","mr america"],"ultimate-warrior":["the ultimate warrior","warrior"],"andre-the-giant":["andre the giant"],
"eddie-guerrero":["eddie guerrero"],"rey-mysterio":["rey mysterio jr"],"booker-t":["king booker"],"goldberg":["bill goldberg"],"edge":["edge"],"christian":["christian cage"],
"daniel-bryan":["bryan danielson"],"dean-ambrose":["jon moxley"],"bray-wyatt":["the fiend","the fiend bray wyatt","bray wyatt the fiend"],"uncle-howdy":["bo dallas"],
"matt-cardona":["zack ryder"],"nattie":["natalya","natalya neidhart"],"iyo-sky":["io shirai"],"michin":["mia yim"],"piper-niven":["doudrop"],"lexis-king":["brian pillman jr"],
"raquel-rodriguez":["raquel gonzalez"],"ludwig-kaiser":["marcel barthel"],"gunther":["walter"],"rusev":["miro"],"aleister-black":["malakai black"],"andrade":["andrade cien almas","andrade el idolo"],
"angel":["angel garza"],"berto":["humberto carrillo","humberto"],"big-cass":["colin cassady"],"cruz-del-toro":["raul mendoza"],"shawn-spears":["tye dillinger"],"baron-corbin":["king corbin","corbin"],
"tonga-loa":["tanga loa","camacho"],"penta":["penta el zero m","penta el zero miedo"],"rey-fenix":["rey fenix"],"finn-balor":["demon balor","finn balor demon"],"sasha-banks":["mercedes mone"],
"paige":["saraya"],"bobby-lashley":["lashley"],"big-e":["big e langston"],"the-miz":["miz"],"r-truth":["k kwik","ron killings"],"kofi-kingston":["kofi kingston"],
"jey-uso":["main event jey uso"],"alundra-blayze":["madusa"],"lita":["lita"],"chyna":["chyna"],"dusty-rhodes":["the american dream dusty rhodes"],"yokozuna":["yokozuna"],
"kurt-angle":["kurt angle"],"rob-van-dam":["rvd"],"william-regal":["lord steven regal","steven regal"],"cody-rhodes":["stardust"],"paul-heyman":["paul heyman"],
"carmelo-hayes":["melo"],"erick-rowan":["erick rowan"],"brie-bella":["the bella twins"],"nikki-bella":["the bella twins"],"omos":["omos"],"je-von-evans":["jevon evans"],
"channing-stacks-lorenzo":["stacks","channing lorenzo","stacks lorenzo"],"jd-mcdonagh":["jordan devlin"],"tony-dangelo":["tony d angelo"],"tyler-bate":["tyler bate"],
"seth-rollins":["seth freakin rollins"],"roman-reigns":["roman reigns"],"jimmy-uso":["jimmy uso"],"austin-theory":["theory"],"el-grande-americano":["el grande americano"],
"la-knight":["la knight"],"dominik-mysterio":["dirty dom"],"umaga":["jamal"],"rikishi":["rikishi"],
}
out={}; report=[]
for w in W:
    names={norm(w["name"]),norm(re.sub(r"_?\(.*?\)","",w["wiki"]).replace("_"," "))}|{norm(x) for x in A.get(w["slug"],[])}
    names={n for n in names if n}
    main=[g for g in GAMES if names & R[g]]
    spin=[g for g in SPIN if names & R[g]]
    out[w["slug"]]={"mainline":main,"spinoffs":spin}
    add=[g for g in main if g not in w["mainline"]]; rem=[g for g in w["mainline"] if g not in main]
    sadd=[g for g in spin if g not in w["spinoffs"]]; srem=[g for g in w["spinoffs"] if g not in spin and g in SPIN]
    if add or rem or sadd or srem: report.append(f'{w["name"]}: +{",".join(add)} -{",".join(rem)} | spin +{",".join(sadd)} -{",".join(srem)}')
json.dump(out,open("verified.json","w"))
print(len(report),"changed"); print("\n".join(report))
