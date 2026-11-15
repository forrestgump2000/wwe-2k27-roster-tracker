import { expandPre, GAME_BY_CODE, MAINLINE, RATED } from "./games";
import APPEARANCES from "./appearances.json";

export type Brand = "Raw" | "SmackDown" | "NXT" | "Free Agent" | "Legend" | "Alumni";
export type Wrestler = {
  slug: string;
  name: string;
  brand: Brand;
  div: "M" | "F";
  color: string;
  /** Wikipedia article title used for the photo */
  wiki: string;
  /** mainline game codes, in release order */
  mainline: string[];
  /** spin-off game codes */
  spinoffs: string[];
  /** overall rating by 2K game code */
  ratings: Record<string, number>;
  hot?: boolean;
};

type Opts = { wiki?: string; spin?: string; hot?: boolean };

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const B: Record<string, Brand> = { R: "Raw", S: "SmackDown", N: "NXT", F: "Free Agent", L: "Legend", A: "Alumni" };

function w(name: string, brand: string, div: "M" | "F", color: string, pre: string, r: string, o: Opts = {}): Wrestler {
  const ratings: Record<string, number> = {};
  r.trim()
    .split(/\s+/)
    .forEach((v, i) => {
      const n = parseInt(v, 10);
      if (RATED[i] && Number.isFinite(n)) ratings[RATED[i]] = n;
    });
  const set = new Set([...expandPre(pre), ...Object.keys(ratings)]);
  return {
    slug: slugify(name),
    name,
    brand: B[brand],
    div,
    color,
    wiki: o.wiki ?? name.replace(/ /g, "_"),
    mainline: MAINLINE.map((g) => g.code).filter((c) => set.has(c)),
    spinoffs: (o.spin ?? "").split(" ").filter((c) => GAME_BY_CODE[c]),
    ratings,
    hot: o.hot,
  };
}

const _ = "-";
const NO = `${_} ${_} ${_} ${_} ${_} ${_} ${_}`; // 2K14–2K20 absent

// Ratings columns: 2K14 2K15 2K16 2K17 2K18 2K19 2K20 2K22 2K23 2K24 2K25 2K26
export const WRESTLERS: Wrestler[] = [
  // ───────────── RAW ─────────────
  w("CM Punk", "R", "M", "#d4d4d4", "SVR08-W13", `91 ${_} ${_} ${_} ${_} ${_} ${_} ${_} ${_} 90 92 93`, { spin: "SC", hot: true }),
  w("Seth Rollins", "R", "M", "#8b5cf6", "", "74 83 89 92 91 91 92 92 91 93 92 94", { spin: "SC BG" }),
  w("Roman Reigns", "R", "M", "#1f6feb", "", "75 81 87 89 91 91 92 94 95 96 96 95", { spin: "SC BG", hot: true }),
  w("Gunther", "R", "M", "#c9a227", "", `${_} ${_} ${_} ${_} ${_} ${_} 78 86 89 91 93 95`, { wiki: "Gunther_(wrestler)", spin: "SC" }),
  w("Jey Uso", "R", "M", "#facc15", "SVR11-W13", "71 74 75 76 77 79 80 83 85 87 89 89", { spin: "SC BG" }),
  w("Jimmy Uso", "R", "M", "#60a5fa", "SVR11-W13", "71 74 75 76 77 79 80 83 85 86 86 85", { spin: "SC BG" }),
  w("Bron Breakker", "R", "M", "#ef4444", "", `${NO} 80 83 85 88 89`, { hot: true }),
  w("Bronson Reed", "R", "M", "#f97316", "", `${NO} ${_} ${_} 80 83 85`),
  w("Dominik Mysterio", "R", "M", "#a3a3a3", "", `${NO} 72 76 82 84 85`),
  w("Finn Bálor", "R", "M", "#dc2626", "", `${_} ${_} 81 86 87 87 88 88 87 86 85 84`, { wiki: "Finn_Bálor", spin: "SC BG" }),
  w("JD McDonagh", "R", "M", "#a855f7", "", `${NO} ${_} ${_} 75 78 78`),
  w("Penta", "R", "M", "#e11d48", "", `${NO} ${_} ${_} ${_} 80 84`, { wiki: "Penta_(wrestler)", hot: true }),
  w("Rusev", "R", "M", "#b91c1c", "", `${_} 80 82 82 79 80 79 ${_} ${_} ${_} ${_} 81`, { wiki: "Miro_(wrestler)", spin: "SC" }),
  w("Sheamus", "R", "M", "#22c55e", "SVR10-W13", "83 85 86 85 85 84 85 85 85 85 84 82", { spin: "SC BG" }),
  w("Rey Mysterio", "R", "M", "#38bdf8", "SYM-W13", `85 85 ${_} ${_} ${_} 85 85 88 86 85 84 83`, { spin: "RAW2 DOR DOR2 SC BG" }),
  w("Dragon Lee", "R", "M", "#f43f5e", "", `${NO} ${_} ${_} 77 79 79`, { wiki: "Dragon_Lee_(wrestler,_born_1995)" }),
  w("Chad Gable", "R", "M", "#2563eb", "", `${_} ${_} ${_} 73 74 75 76 77 79 82 84 83`, { spin: "SC" }),
  w("Kofi Kingston", "R", "M", "#16a34a", "SVR09-W13", "79 79 78 80 81 84 87 84 84 83 82 80", { spin: "SC BG" }),
  w("Xavier Woods", "R", "M", "#9333ea", "", `${_} 71 72 74 76 78 79 79 79 79 78 77`, { spin: "SC BG" }),
  w("Otis", "R", "M", "#eab308", "", `${_} ${_} ${_} ${_} ${_} ${_} 73 75 76 76 77 76`, { wiki: "Otis_(wrestler)" }),
  w("Akira Tozawa", "R", "M", "#f59e0b", "", `${_} ${_} ${_} ${_} 72 73 73 73 73 73 73 72`),
  w("Austin Theory", "R", "M", "#e5e7eb", "", `${NO} 72 82 84 82 80`),
  w("Grayson Waller", "R", "M", "#fde047", "", `${NO} ${_} 74 77 78 78`),
  w("Logan Paul", "R", "M", "#3b82f6", "", `${NO} ${_} 80 83 85 86`, { hot: true }),
  w("R-Truth", "R", "M", "#facc15", "SVR09-W13", "75 74 72 72 73 74 75 75 76 77 78 78", { spin: "SC" }),
  w("Rhea Ripley", "R", "F", "#7c3aed", "", `${_} ${_} ${_} ${_} ${_} 74 82 84 87 91 92 91`, { spin: "BG", hot: true }),
  w("Becky Lynch", "R", "F", "#f97316", "", `${_} ${_} 77 79 80 88 91 91 91 92 90 90`, { spin: "SC BG" }),
  w("IYO SKY", "R", "F", "#06b6d4", "", `${_} ${_} ${_} ${_} ${_} 78 82 84 86 88 89 88`, { wiki: "Iyo_Sky" }),
  w("Liv Morgan", "R", "F", "#ec4899", "", `${_} ${_} ${_} ${_} 70 72 74 77 84 84 89 88`, { spin: "SC" }),
  w("Raquel Rodriguez", "R", "F", "#dc2626", "", `${NO} 76 79 81 82 82`, { wiki: "Raquel_Rodríguez" }),
  w("Asuka", "R", "F", "#f43f5e", "", `${_} ${_} ${_} 86 88 87 88 88 89 88 87 87`, { wiki: "Asuka_(wrestler)", spin: "SC BG" }),
  w("Kairi Sane", "R", "F", "#fb7185", "", `${_} ${_} ${_} ${_} ${_} 80 81 ${_} ${_} 83 82 81`),
  w("Lyra Valkyria", "R", "F", "#38bdf8", "", `${NO} ${_} ${_} 74 79 82`),
  w("Bayley", "R", "F", "#a855f7", "", `${_} 70 74 80 82 83 86 87 88 90 87 86`, { wiki: "Bayley_(wrestler)", spin: "SC BG" }),
  w("Stephanie Vaquer", "R", "F", "#9f1239", "", `${NO} ${_} ${_} ${_} ${_} 85`, { hot: true }),
  w("Roxanne Perez", "R", "F", "#d946ef", "", `${NO} ${_} 75 78 81 82`),
  w("Nikki Bella", "R", "F", "#f472b6", "SVR10-W13", `72 74 77 80 82 82 82 ${_} ${_} 80 80 82`, { spin: "SC", hot: true }),
  w("Nattie", "R", "F", "#ec4899", "SVR09-W13", "73 74 76 79 79 80 80 82 80 78 77 76", { wiki: "Natalya_Neidhart", spin: "SC" }),
  w("Zoey Stark", "R", "F", "#eab308", "", `${NO} ${_} ${_} 76 78 78`),
  w("Ivy Nile", "R", "F", "#14b8a6", "", `${NO} ${_} ${_} 74 76 76`),
  w("Maxxine Dupri", "R", "F", "#f9a8d4", "", `${NO} ${_} ${_} 68 70 72`),
  w("AJ Lee", "R", "F", "#f43f5e", "W12-W13", `79 80 ${_} ${_} ${_} ${_} ${_} ${_} ${_} ${_} ${_} 80`, { hot: true }),

  // ───────────── SMACKDOWN ─────────────
  w("Cody Rhodes", "S", "M", "#60a5fa", "SVR09-W13", `74 73 71 ${_} ${_} ${_} ${_} ${_} 89 95 97 97`, { spin: "SC", hot: true }),
  w("Drew McIntyre", "S", "M", "#991b1b", "SVR10-W13", `63 ${_} ${_} ${_} 84 85 87 91 91 90 91 90`, { spin: "SC BG" }),
  w("Randy Orton", "S", "M", "#16a34a", "HCTP-W13", "91 90 88 88 87 87 88 89 90 90 91 90", { spin: "DOR DOR2 SC BG" }),
  w("Solo Sikoa", "S", "M", "#a16207", "", `${NO} ${_} 80 85 87 84`),
  w("Jacob Fatu", "S", "M", "#7f1d1d", "", `${NO} ${_} ${_} ${_} 85 90`, { hot: true }),
  w("Tama Tonga", "S", "M", "#57534e", "", `${NO} ${_} ${_} ${_} 78 79`),
  w("Tonga Loa", "S", "M", "#78716c", "", `${NO} ${_} ${_} ${_} 76 77`),
  w("Sami Zayn", "S", "M", "#0ea5e9", "", `${_} 74 79 80 80 79 80 80 85 87 86 85`, { spin: "SC BG" }),
  w("LA Knight", "S", "M", "#facc15", "", `${NO} ${_} 79 85 88 88`, { wiki: "LA_Knight", hot: true }),
  w("Damian Priest", "S", "M", "#4c1d95", "", `${NO} 80 82 86 89 87`),
  w("Carmelo Hayes", "S", "M", "#0891b2", "", `${NO} 76 79 81 82 83`),
  w("Shinsuke Nakamura", "S", "M", "#e11d48", "", `${_} ${_} ${_} 87 88 87 85 83 82 83 83 82`, { spin: "SC BG" }),
  w("Johnny Gargano", "S", "M", "#facc15", "", `${_} ${_} ${_} 77 79 82 84 83 81 80 79 78`),
  w("Tommaso Ciampa", "S", "M", "#525252", "", `${_} ${_} ${_} 76 78 82 84 85 82 80 78 77`),
  w("Aleister Black", "S", "M", "#18181b", "", `${_} ${_} ${_} ${_} 80 84 86 ${_} ${_} ${_} ${_} 82`, { wiki: "Malakai_Black", hot: true }),
  w("Montez Ford", "S", "M", "#f59e0b", "", `${_} ${_} ${_} ${_} ${_} 74 75 79 80 81 81 80`),
  w("Angelo Dawkins", "S", "M", "#d97706", "", `${_} ${_} ${_} ${_} ${_} 72 73 77 78 79 79 78`),
  w("The Miz", "S", "M", "#dc2626", "SVR08-W13", "81 82 82 85 85 84 83 82 81 80 79 78", { spin: "SC BG" }),
  w("Uncle Howdy", "S", "M", "#fef3c7", "", `66 70 69 68 68 70 ${_} ${_} ${_} 80 81 80`, { wiki: "Bo_Dallas" }),
  w("Erick Rowan", "S", "M", "#78350f", "", `74 75 77 77 76 77 78 ${_} ${_} ${_} 79 78`, { spin: "SC" }),
  w("Dexter Lumis", "S", "M", "#57534e", "", `${NO} 70 74 ${_} 76 76`),
  w("Joe Gacy", "S", "M", "#fde68a", "", `${NO} ${_} ${_} 72 76 75`),
  w("Rey Fénix", "S", "M", "#dc2626", "", `${NO} ${_} ${_} ${_} ${_} 80`, { wiki: "Rey_Fénix", hot: true }),
  w("Trick Williams", "S", "M", "#22c55e", "", `${NO} ${_} ${_} 78 82 84`, { hot: true }),
  w("Ilja Dragunov", "S", "M", "#be123c", "", `${NO} 79 80 84 86 85`),
  w("Charlotte Flair", "S", "F", "#c084fc", "", `${_} 76 85 88 88 89 90 92 91 90 91 90`, { spin: "SC BG" }),
  w("Tiffany Stratton", "S", "F", "#f9a8d4", "", `${NO} ${_} ${_} 78 84 89`, { hot: true }),
  w("Jade Cargill", "S", "F", "#a3e635", "", `${NO} ${_} ${_} 85 87 88`),
  w("Naomi", "S", "F", "#facc15", "W12-W13", `69 72 73 77 78 78 78 78 ${_} 80 81 85`, { wiki: "Naomi_(wrestler)", spin: "SC" }),
  w("Bianca Belair", "S", "F", "#0d9488", "", `${_} ${_} ${_} ${_} ${_} ${_} 74 88 89 91 90 89`),
  w("Alexa Bliss", "S", "F", "#e879f9", "", `${_} ${_} ${_} 78 85 87 84 82 83 ${_} 82 82`, { spin: "SC BG" }),
  w("Nia Jax", "S", "F", "#ea580c", "", `${_} ${_} ${_} 78 81 82 83 83 ${_} 85 86 85`, { spin: "SC" }),
  w("Chelsea Green", "S", "F", "#fca5a5", "", `${NO} ${_} ${_} 72 76 78`),
  w("Piper Niven", "S", "F", "#a855f7", "", `${NO} 73 74 76 77 76`),
  w("Zelina Vega", "S", "F", "#ef4444", "", `${_} ${_} ${_} ${_} ${_} 70 71 72 74 76 78 79`),
  w("Giulia", "S", "F", "#ec4899", "", `${NO} ${_} ${_} ${_} ${_} 82`, { wiki: "Giulia_(wrestler)", hot: true }),
  w("Michin", "S", "F", "#f43f5e", "", `${_} ${_} ${_} ${_} ${_} ${_} 73 ${_} ${_} ${_} 74 75`, { wiki: "Mia_Yim" }),
  w("Shayna Baszler", "S", "F", "#475569", "", `${_} ${_} ${_} ${_} ${_} 80 82 80 80 79 78 77`),

  // ───────────── NXT ─────────────
  w("Oba Femi", "N", "M", "#ca8a04", "", `${NO} ${_} ${_} ${_} 82 86`, { hot: true }),
  w("Je'Von Evans", "N", "M", "#2563eb", "", `${NO} ${_} ${_} ${_} 75 80`, { hot: true }),
  w("Ethan Page", "N", "M", "#71717a", "", `${NO} ${_} ${_} ${_} 79 80`),
  w("Tony D'Angelo", "N", "M", "#1c1917", "", `${NO} ${_} 74 77 78 79`),
  w("Wes Lee", "N", "M", "#06b6d4", "", `${NO} ${_} ${_} 77 78 77`),
  w("Nathan Frazer", "N", "M", "#f97316", "", `${NO} ${_} ${_} 76 78 79`),
  w("Axiom", "N", "M", "#3b82f6", "", `${NO} ${_} ${_} 75 77 78`, { wiki: "Axiom_(wrestler)" }),
  w("Ricky Saints", "N", "M", "#eab308", "", `${NO} ${_} ${_} ${_} ${_} 81`, { wiki: "Ricky_Starks", hot: true }),
  w("Sol Ruca", "N", "F", "#22d3ee", "", `${NO} ${_} ${_} ${_} ${_} 76`, { hot: true }),
  w("Jordynne Grace", "N", "F", "#7e22ce", "", `${NO} ${_} ${_} ${_} ${_} 80`, { hot: true }),
  w("Jacy Jayne", "N", "F", "#f472b6", "", `${NO} ${_} ${_} ${_} ${_} 76`),
  w("Kelani Jordan", "N", "F", "#facc15", "", `${NO} ${_} ${_} ${_} 74 76`),
  w("Tatum Paxley", "N", "F", "#a78bfa", "", `${NO} ${_} ${_} ${_} 70 73`),
  w("Lola Vice", "N", "F", "#fb7185", "", `${NO} ${_} ${_} 72 74 75`),

  // ───────────── LEGENDS ─────────────
  w("John Cena", "L", "M", "#22c55e", "HCTP-W13", "93 94 93 92 90 89 88 89 91 91 90 93", { spin: "RAW2 DOR DOR2 SC BG", hot: true }),
  w("AJ Styles", "L", "M", "#94a3b8", "", `${_} ${_} 85 90 91 92 90 89 90 90 88 86`, { spin: "SC BG" }),
  w("Stone Cold Steve Austin", "L", "M", "#111827", "SD1-SVR06,W13", "94 94 95 95 94 94 94 95 96 96 96 96", { wiki: "Stone_Cold_Steve_Austin", spin: "WZ ATT WM2K NM RR RAW WMX8 RAW2 WMXIX LOW AS SC BG", hot: true }),
  w("The Rock", "L", "M", "#a16207", "SD1-SVR,W13", "95 94 94 95 94 93 94 95 96 96 97 97", { wiki: "Dwayne_Johnson", spin: "WZ ATT WM2K NM RR RAW WMX8 LOW AS SC BG", hot: true }),
  w("The Undertaker", "L", "M", "#4c1d95", "SD1-W13", "95 95 96 95 94 94 93 95 96 96 96 96", { spin: "RR93 RAW94 WMARC WZ ATT WM2K NM RR RAW WMX8 RAW2 WMXIX DOR DOR2 LOW AS SC BG", hot: true }),
  w("Triple H", "L", "M", "#a3a3a3", "SD1-W13", "95 95 96 95 93 93 93 93 94 94 94 93", { spin: "WZ ATT WM2K NM RR RAW WMX8 RAW2 WMXIX DOR DOR2 LOW AS SC BG" }),
  w("Shawn Michaels", "L", "M", "#f472b6", "HCTP-SVR11,W13", "95 95 95 94 94 94 94 95 95 95 95 94", { spin: "RR93 RAW94 WMARC RAW2 DOR DOR2 LOW AS SC BG" }),
  w("Brock Lesnar", "L", "M", "#b91c1c", "SYM-HCTP,W13", "93 95 95 94 95 96 95 96 94 94 93 92", { spin: "RAW2 WMXIX SC BG", hot: true }),
  w("Batista", "L", "M", "#57534e", "HCTP-SVR10,W13", "88 90 89 89 89 90 90 91 92 92 91 91", { wiki: "Dave_Bautista", spin: "DOR DOR2 LOW SC" }),
  w("Goldberg", "L", "M", "#262626", "HCTP", `${_} ${_} ${_} 94 94 94 94 93 93 93 92 92`, { wiki: "Bill_Goldberg", spin: "SC BG" }),
  w("Kane", "L", "M", "#dc2626", "SD1-W13", "86 86 87 87 87 86 85 87 88 87 86 86", { wiki: "Kane_(wrestler)", spin: "WZ ATT WM2K NM RR RAW WMX8 RAW2 WMXIX DOR DOR2 LOW SC" }),
  w("Big Show", "L", "M", "#1e3a8a", "SD1-W13", `88 88 87 87 86 86 87 ${_} ${_} ${_} ${_} ${_}`, { wiki: "Paul_Wight", spin: "NM RR RAW WMX8 RAW2 WMXIX DOR DOR2 SC" }),
  w("Kurt Angle", "L", "M", "#dc2626", "SD2-SVR06", `${_} ${_} ${_} ${_} 92 92 90 91 91 91 90 90`, { spin: "NM RAW WMX8 RAW2 WMXIX DOR DOR2 SC BG" }),
  w("Rob Van Dam", "L", "M", "#eab308", "SYM-SVR08", `85 ${_} ${_} 88 87 87 87 88 88 88 87 87`, { spin: "WMX8 RAW2 WMXIX DOR DOR2 SC" }),
  w("Eddie Guerrero", "L", "M", "#0369a1", "SD2-SVR06", `${NO} 89 89 89 88 88`, { spin: "NM RAW WMXIX DOR DOR2 LOW SC" }),
  w("Booker T", "L", "M", "#ca8a04", "SYM-SVR08", `83 83 84 84 84 84 84 85 85 85 84 84`, { spin: "WMX8 RAW2 WMXIX DOR DOR2 LOW SC" }),
  w("Mick Foley", "L", "M", "#78350f", "SD1-JBI,SVR06", "87 87 87 87 87 87 87 88 88 88 88 88", { spin: "WZ ATT WM2K NM RR LOW AS SC" }),
  w("Ric Flair", "L", "M", "#fbbf24", "SYM-SVR08", "86 87 87 86 86 86 86 87 87 86 86 85", { spin: "RR93 WMXIX DOR LOW SC" }),
  w("Bret Hart", "L", "M", "#ec4899", "W12", "91 90 91 91 90 90 91 91 92 92 91 91", { spin: "SWM RR93 RAW94 WMARC LOW AS SC BG" }),
  w("Hulk Hogan", "L", "M", "#facc15", "SYM-HCTP", `92 ${_} ${_} ${_} ${_} ${_} ${_} ${_} ${_} 90 89 89`, { spin: "WMNES SWM RR93 WMX8 WMXIX RAW2 LOW AS" }),
  w("Andre the Giant", "L", "M", "#292524", "", "90 90 91 90 90 90 90 90 91 91 90 90", { spin: "WMNES LOW AS SC BG" }),
  w("Ultimate Warrior", "L", "M", "#f97316", "", "91 90 90 90 90 90 90 90 90 90 89 89", { spin: "SWM LOW AS SC BG" }),
  w("Randy Savage", "L", "M", "#a855f7", "", `90 90 90 ${_} 90 90 90 91 91 91 90 90`, { spin: "WMNES SWM RR93 LOW AS SC BG" }),
  w("Roddy Piper", "L", "M", "#dc2626", "", `85 86 86 86 86 86 86 86 86 86 85 85`, { spin: "LOW AS SC" }),
  w("Jake Roberts", "L", "M", "#166534", "", `84 84 84 84 83 83 83 84 84 84 83 83`, { spin: "SWM LOW AS SC" }),
  w("Ted DiBiase", "L", "M", "#eab308", "", `82 82 82 82 82 82 82 83 83 83 82 82`, { spin: "WMNES SWM RR93 LOW" }),
  w("Ricky Steamboat", "L", "M", "#ef4444", "", `86 86 86 86 85 85 85 86 86 86 85 85`, { spin: "LOW AS SC" }),
  w("Mr. Perfect", "L", "M", "#f59e0b", "", `86 86 86 86 86 86 86 87 87 87 86 86`, { wiki: "Curt_Hennig", spin: "SWM RR93 LOW SC" }),
  w("Dusty Rhodes", "L", "M", "#fde047", "", `84 84 84 84 84 84 84 85 85 85 84 84`, { spin: "LOW SC" }),
  w("Yokozuna", "L", "M", "#b45309", "", `85 85 85 85 85 85 85 86 86 86 85 85`, { spin: "RAW94 WMARC LOW SC" }),
  w("Razor Ramon", "L", "M", "#fbbf24", "", `86 86 86 86 86 86 86 87 87 87 86 86`, { wiki: "Scott_Hall", spin: "RR93 RAW94 WMARC LOW SC" }),
  w("Kevin Nash", "L", "M", "#111827", "SYM", `86 86 86 86 86 86 86 86 87 87 86 86`, { spin: "RAW94 LOW SC" }),
  w("X-Pac", "L", "M", "#16a34a", "SD1-JBI", `81 81 81 80 80 80 80 81 81 81 80 80`, { wiki: "Sean_Waltman", spin: "WZ ATT WM2K NM RR" }),
  w("Diamond Dallas Page", "L", "M", "#7c3aed", "", `${_} ${_} ${_} 84 84 84 84 85 85 85 84 84`),
  w("Lex Luger", "L", "M", "#2563eb", "", `${_} 84 84 84 83 83 83 84 84 84 83 83`, { spin: "RAW94" }),
  w("Vader", "L", "M", "#7f1d1d", "", `${_} 85 85 85 85 85 85 86 86 86 85 85`, { wiki: "Vader_(wrestler)" }),
  w("Bam Bam Bigelow", "L", "M", "#ea580c", "", `${_} 84 84 84 84 84 84 85 85 85 84 84`),
  w("British Bulldog", "L", "M", "#1d4ed8", "", `84 84 84 84 84 84 84 85 85 85 84 84`, { wiki: "Davey_Boy_Smith", spin: "RR93 WMARC LOW" }),
  w("Rikishi", "L", "M", "#f59e0b", "SD1-SVR", `83 83 83 83 83 83 83 84 84 84 83 83`, { spin: "NM RR WMX8 SC" }),
  w("Umaga", "L", "M", "#7c2d12", "SVR07-SVR10", `${_} 85 85 85 85 85 85 86 86 86 85 85`),
  w("Bubba Ray Dudley", "L", "M", "#2563eb", "SD2-SVR06", `${_} ${_} 83 83 83 83 83 84 84 84 83 83`, { wiki: "Bully_Ray", spin: "NM WMX8 RAW2 DOR" }),
  w("D-Von Dudley", "L", "M", "#1e40af", "SD2-SVR06", `${_} ${_} 81 81 81 81 81 82 82 82 81 81`, { spin: "NM WMX8 RAW2 DOR" }),
  w("Ron Simmons", "L", "M", "#111827", "SD1-SVR06", `${_} ${_} ${_} ${_} ${_} 80 80 81 81 81 80 80`, { spin: "ATT WM2K NM" }),
  w("JBL", "L", "M", "#713f12", "SD1-SVR09", `${_} ${_} ${_} ${_} ${_} ${_} ${_} 82 82 82 81 81`, { wiki: "John_Bradshaw_Layfield", spin: "ATT WM2K NM DOR DOR2" }),
  w("Bray Wyatt", "L", "M", "#9a3412", "", `81 84 86 87 86 87 90 ${_} 90 90 89 89`, { spin: "SC BG", hot: true }),
  w("Trish Stratus", "L", "F", "#facc15", "JBI-SVR07", `${_} ${_} ${_} ${_} ${_} 85 85 86 87 86 86 86`, { spin: "WMX8 RAW2 WMXIX DOR DOR2 SC", hot: true }),
  w("Lita", "L", "F", "#dc2626", "SD2-SVR07", `76 ${_} 81 81 80 80 82 86 86 86 85 85`, { wiki: "Lita_(wrestler)", spin: "NM WMX8 RAW2 DOR DOR2 SC" }),
  w("Chyna", "L", "F", "#7e22ce", "SD1-SD2", `${NO} ${_} ${_} 85 85 85`, { spin: "WZ ATT WM2K NM RR" }),
  w("Beth Phoenix", "L", "F", "#d97706", "SVR08-W12", `${NO} 85 84 84 83 83`, { spin: "SC" }),
  w("Michelle McCool", "L", "F", "#f9a8d4", "SVR08-SVR11", `${NO} ${_} ${_} 82 80 80`),
  w("Brie Bella", "L", "F", "#fb7185", "SVR10-W13", `71 73 76 78 78 79 79 ${_} ${_} 78 78 79`, { spin: "SC" }),
  w("Alundra Blayze", "L", "F", "#22d3ee", "", `${_} ${_} ${_} ${_} ${_} 75 75 ${_} ${_} 77 77 77`, { wiki: "Madusa" }),

  // ───────────── ALUMNI (former 2K stars) ─────────────
  w("Edge", "A", "M", "#64748b", "SD1-SVR11", `88 88 90 90 89 89 89 90 91 ${_} ${_} ${_}`, { wiki: "Edge_(wrestler)", spin: "NM WMX8 RAW2 WMXIX DOR DOR2 SC" }),
  w("Christian", "A", "M", "#94a3b8", "SD1-SVR06,SVR10-W12", `82 ${_} 83 83 83 83 83 85 85 ${_} ${_} ${_}`, { wiki: "Christian_Cage", spin: "NM WMX8 DOR SC" }),
  w("Sting", "A", "M", "#e5e7eb", "", `${_} 92 92 92 91 92 91 ${_} ${_} ${_} ${_} ${_}`, { wiki: "Sting_(wrestler)", spin: "SC" }),
  w("Daniel Bryan", "A", "M", "#65a30d", "SVR11-W13", `90 91 90 ${_} 89 91 92 90 ${_} ${_} ${_} ${_}`, { wiki: "Bryan_Danielson", spin: "SC BG" }),
  w("Dean Ambrose", "A", "M", "#525252", "", `74 83 85 88 88 87 ${_} ${_} ${_} ${_} ${_} ${_}`, { wiki: "Jon_Moxley", spin: "SC" }),
  w("Bobby Lashley", "A", "M", "#1e3a8a", "SVR07-SVR08", `${_} ${_} ${_} ${_} ${_} 83 84 91 89 87 ${_} ${_}`, { spin: "SC BG" }),
  w("Braun Strowman", "A", "M", "#3f6212", "", `${_} ${_} 79 82 88 91 92 ${_} 88 88 87 ${_}`, { spin: "SC BG" }),
  w("Big E", "A", "M", "#dc2626", "", `${_} 74 76 77 79 81 82 88 85 ${_} ${_} ${_}`, { wiki: "Big_E", spin: "SC BG" }),
  w("Jeff Hardy", "A", "M", "#a855f7", "SD1-SYM,SVR07-SVR10", `${_} ${_} ${_} ${_} 87 87 87 85 ${_} ${_} ${_} ${_}`, { spin: "WM2K NM RR WMX8 SC" }),
  w("Matt Hardy", "A", "M", "#6d28d9", "SD1-SVR10", `${_} ${_} ${_} ${_} 82 82 82 ${_} ${_} ${_} ${_} ${_}`, { spin: "WM2K NM RR WMX8 SC" }),
  w("Karrion Kross", "A", "M", "#991b1b", "", `${NO} 84 83 82 80 ${_}`),
  w("Andrade", "A", "M", "#b91c1c", "", `${_} ${_} ${_} ${_} 77 80 80 ${_} ${_} ${_} 80 ${_}`, { wiki: "Andrade_El_Ídolo" }),
  w("Sasha Banks", "A", "F", "#3b82f6", "", `${_} ${_} 80 85 86 86 86 88 ${_} ${_} ${_} ${_}`, { wiki: "Mercedes_Moné", spin: "SC BG" }),
  w("Paige", "A", "F", "#111827", "", `${_} 82 83 80 78 77 77 ${_} ${_} ${_} ${_} ${_}`, { wiki: "Saraya_(wrestler)", spin: "SC" }),
  // ───────────── FULL CURRENT ROSTER ADDITIONS (WWE.com, Nov 2026) ─────────────
  // Ratings for newer names are left blank where no reliable 2K history exists.
  w("Kevin Owens", "S", "M", "#1d4ed8", "", `${_} ${_} 85 88 87 86 86 86 86 87 88 87`, { spin: "SC BG" }),
  w("Pete Dunne", "R", "M", "#7c2d12", "", `${_} ${_} ${_} ${_} 80 81 80 80 80 80 82 81`),
  w("Ludwig Kaiser", "R", "M", "#a16207", "", `${NO} 70 74 77 80 80`),
  w("Joe Hendry", "R", "M", "#2563eb", "", `${NO} ${_} ${_} ${_} 78 82`, { hot: true }),
  w("El Grande Americano", "R", "M", "#dc2626", "", `${NO} ${_} ${_} ${_} ${_} 80`),
  w("Tyler Bate", "R", "M", "#0f766e", "", `${_} ${_} ${_} ${_} 72 74 75 76 76 ${_} 77 77`),
  w("Big Cass", "R", "M", "#facc15", "", `${_} ${_} 70 73 76 ${_} ${_} ${_} ${_} ${_} ${_} ${_}`, { wiki: "Colin_Cassady" }),
  w("Bravo Americano", "R", "M", "#b91c1c", "", ""),
  w("Rayo Americano", "R", "M", "#ef4444", "", ""),
  w("Bronco Nima", "R", "M", "#a16207", "", ""),
  w("Lucien Price", "R", "M", "#57534e", "", ""),
  w("Cruz Del Toro", "R", "M", "#16a34a", "", `${NO} ${_} ${_} ${_} 72 74`),
  w("Joaquin Wilde", "R", "M", "#f59e0b", "", `${NO} 68 70 71 72 73`),
  w("Royce Keys", "R", "M", "#374151", "", ""),
  w("Jaida Parker", "R", "F", "#a855f7", "", ""),
  w("Baron Corbin", "S", "M", "#334155", "", `${_} ${_} 75 79 80 82 82 80 78 77 ${_} ${_}`, { spin: "SC BG" }),
  w("Matt Cardona", "S", "M", "#f472b6", "W12-W13", `74 72 70 69 69 68 68 ${_} ${_} ${_} ${_} ${_}`, { wiki: "Matt_Cardona", spin: "SC" }),
  w("Angel", "S", "M", "#dc2626", "", `${_} ${_} ${_} ${_} ${_} ${_} 72 73 73 74 74 74`, { wiki: "Angel_Garza" }),
  w("Berto", "S", "M", "#ea580c", "", `${_} ${_} ${_} ${_} ${_} 70 72 72 73 73 74 74`, { wiki: "Humberto_Carrillo" }),
  w("Erik", "S", "M", "#0369a1", "", `${_} ${_} ${_} 75 77 78 78 78 78 78 77 76`, { wiki: "Erik_(wrestler)", spin: "SC" }),
  w("Ivar", "S", "M", "#075985", "", `${_} ${_} ${_} 76 78 79 79 79 79 79 78 77`, { wiki: "Ivar_(wrestler)", spin: "SC" }),
  w("Elton Prince", "S", "M", "#9333ea", "", `${NO} ${_} 72 74 74 73`),
  w("Kit Wilson", "S", "M", "#7e22ce", "", `${NO} ${_} 70 73 73 72`),
  w("Talla Tonga", "S", "M", "#292524", "", `${NO} ${_} ${_} ${_} ${_} 74`),
  w("Mark Nash", "S", "M", "#525252", "", ""),
  w("Paul Heyman", "S", "M", "#0a0a0a", "", `75 75 75 75 75 75 75 75 75 76 76 76`, { spin: "SC" }),
  w("Candice LeRae", "S", "F", "#f43f5e", "", `${_} ${_} ${_} ${_} ${_} 72 74 74 75 75 74 74`),
  w("B-Fab", "S", "F", "#c026d3", "", `${NO} ${_} ${_} ${_} 70 71`),
  w("Kiana James", "S", "F", "#e879f9", "", `${NO} ${_} ${_} 70 72 73`),
  w("Fallon Henley", "S", "F", "#fb923c", "", `${NO} ${_} ${_} 71 73 74`),
  w("Lash Legend", "S", "F", "#7c3aed", "", `${NO} ${_} ${_} 72 74 76`),
  w("Blake Monroe", "S", "F", "#f9a8d4", "", ""),
  w("Lainey Reid", "S", "F", "#fda4af", "", ""),
  w("Zilla Fatu", "N", "M", "#7f1d1d", "", ""),
  w("Noam Dar", "N", "M", "#ca8a04", "", `${_} ${_} ${_} 70 71 72 72 74 75 75 75 74`),
  w("Shawn Spears", "N", "M", "#334155", "", `${_} ${_} ${_} ${_} ${_} ${_} ${_} ${_} ${_} ${_} 74 74`),
  w("Lexis King", "N", "M", "#a3a3a3", "", `${NO} ${_} ${_} 70 72 73`, { wiki: "Brian_Pillman_Jr." }),
  w("Josh Briggs", "N", "M", "#eab308", "", `${NO} ${_} 70 72 73 73`),
  w("Brooks Jensen", "N", "M", "#d97706", "", `${NO} ${_} 68 70 71 71`),
  w("Charlie Dempsey", "N", "M", "#166534", "", `${NO} ${_} ${_} 71 73 74`),
  w("Myles Borne", "N", "M", "#0ea5e9", "", ""),
  w("Tavion Heights", "N", "M", "#0f766e", "", ""),
  w("Hank Walker", "N", "M", "#ca8a04", "", ""),
  w("Tank Ledger", "N", "M", "#713f12", "", ""),
  w("Channing \"Stacks\" Lorenzo", "N", "M", "#1c1917", "", `${NO} ${_} 70 72 73 73`, { wiki: "Channing_Lorenzo" }),
  w("Dion Lennox", "N", "M", "#be123c", "", ""),
  w("Cutler James", "N", "M", "#155e75", "", ""),
  w("Brad Baylor", "N", "M", "#44403c", "", ""),
  w("Blake Howard", "N", "M", "#52525b", "", ""),
  w("Cruz Montana", "N", "M", "#b45309", "", ""),
  w("Dorian Van Dux", "N", "M", "#4c1d95", "", ""),
  w("EK Prosper", "N", "M", "#ea580c", "", ""),
  w("Elio LeFleur", "N", "M", "#2563eb", "", ""),
  w("Jackson Drake", "N", "M", "#1e3a8a", "", ""),
  w("Kale Dixon", "N", "M", "#3f6212", "", ""),
  w("Mason Rook", "N", "M", "#18181b", "", ""),
  w("Naraku", "N", "M", "#7f1d1d", "", ""),
  w("Niko Vance", "N", "M", "#0369a1", "", ""),
  w("Osiris Griffin", "N", "M", "#a16207", "", ""),
  w("Ricky Smokes", "N", "M", "#65a30d", "", ""),
  w("Romeo Moreno", "N", "M", "#dc2626", "", ""),
  w("Saquon Shugars", "N", "M", "#c2410c", "", ""),
  w("Sean Legacy", "N", "M", "#1d4ed8", "", ""),
  w("Shiloh Hill", "N", "M", "#57534e", "", ""),
  w("Tristan Angels", "N", "M", "#7c3aed", "", ""),
  w("Uriah Connors", "N", "M", "#0f172a", "", ""),
  w("Nikkita Lyons", "N", "F", "#d946ef", "", `${NO} ${_} ${_} 72 74 74`),
  w("Thea Hail", "N", "F", "#fb7185", "", `${NO} ${_} ${_} 68 70 71`),
  w("Arianna Grace", "N", "F", "#fde047", "", `${NO} ${_} ${_} ${_} 68 70`),
  w("Izzi Dame", "N", "F", "#7e22ce", "", `${NO} ${_} ${_} ${_} 70 72`),
  w("Karmen Petrovic", "N", "F", "#e11d48", "", `${NO} ${_} ${_} ${_} 69 71`),
  w("Wren Sinclair", "N", "F", "#4d7c0f", "", `${NO} ${_} ${_} ${_} 69 71`),
  w("Kendal Grey", "N", "F", "#06b6d4", "", ""),
  w("Kali Armstrong", "N", "F", "#9333ea", "", ""),
  w("Lizzy Rain", "N", "F", "#38bdf8", "", ""),
  w("Myka Lockwood", "N", "F", "#be185d", "", ""),
  w("Skylar Raye", "N", "F", "#f472b6", "", ""),
  w("Zaria", "N", "F", "#16a34a", "", ""),
  w("Omos", "F", "M", "#0c4a6e", "", `${NO} 82 83 83 82 ${_}`, { wiki: "Omos_(wrestler)" }),
  w("Danhausen", "F", "M", "#111827", "", ""),
  w("William Regal", "L", "M", "#713f12", "SYM-W13", `78 ${_} ${_} 80 80 80 80 ${_} ${_} 79 79 79`),
];

/**
 * Current brand assignments from the official WWE.com roster (Raw / SmackDown / NXT / Free Agent).
 * Anyone in the database previously listed on a brand but no longer on WWE.com is moved to Alumni.
 */
const CURRENT: Record<string, Brand> = {"akira-tozawa": "Raw", "angelo-dawkins": "Raw", "asuka": "Raw", "austin-theory": "Raw", "bayley": "Raw", "becky-lynch": "Raw", "big-cass": "Raw", "bravo-americano": "Raw", "bron-breakker": "Raw", "bronco-nima": "Raw", "bronson-reed": "Raw", "chad-gable": "Raw", "cruz-del-toro": "Raw", "dominik-mysterio": "Raw", "dragon-lee": "Raw", "el-grande-americano": "Raw", "ethan-page": "Raw", "ivy-nile": "Raw", "iyo-sky": "Raw", "jacob-fatu": "Raw", "jaida-parker": "Raw", "jd-mcdonagh": "Raw", "jevon-evans": "Raw", "jey-uso": "Raw", "jimmy-uso": "Raw", "joaquin-wilde": "Raw", "joe-hendry": "Raw", "la-knight": "Raw", "liv-morgan": "Raw", "logan-paul": "Raw", "lola-vice": "Raw", "lucien-price": "Raw", "ludwig-kaiser": "Raw", "lyra-valkyria": "Raw", "maxxine-dupri": "Raw", "montez-ford": "Raw", "nattie": "Raw", "oba-femi": "Raw", "otis": "Raw", "penta": "Raw", "pete-dunne": "Raw", "raquel-rodriguez": "Raw", "rayo-americano": "Raw", "rey-mysterio": "Raw", "roman-reigns": "Raw", "roxanne-perez": "Raw", "royce-keys": "Raw", "rusev": "Raw", "seth-rollins": "Raw", "sol-ruca": "Raw", "stephanie-vaquer": "Raw", "tyler-bate": "Raw", "alexa-bliss": "SmackDown", "angel": "SmackDown", "axiom": "SmackDown", "b-fab": "SmackDown", "baron-corbin": "SmackDown", "berto": "SmackDown", "bianca-belair": "SmackDown", "blake-monroe": "SmackDown", "candice-lerae": "SmackDown", "carmelo-hayes": "SmackDown", "charlotte-flair": "SmackDown", "chelsea-green": "SmackDown", "cm-punk": "SmackDown", "cody-rhodes": "SmackDown", "damian-priest": "SmackDown", "drew-mcintyre": "SmackDown", "elton-prince": "SmackDown", "erik": "SmackDown", "fallon-henley": "SmackDown", "finn-balor": "SmackDown", "giulia": "SmackDown", "gunther": "SmackDown", "ivar": "SmackDown", "jacy-jayne": "SmackDown", "jade-cargill": "SmackDown", "johnny-gargano": "SmackDown", "jordynne-grace": "SmackDown", "kevin-owens": "SmackDown", "kiana-james": "SmackDown", "kit-wilson": "SmackDown", "lainey-reid": "SmackDown", "lash-legend": "SmackDown", "mark-nash": "SmackDown", "matt-cardona": "SmackDown", "michin": "SmackDown", "naomi": "SmackDown", "nathan-frazer": "SmackDown", "nia-jax": "SmackDown", "paige": "SmackDown", "paul-heyman": "SmackDown", "piper-niven": "SmackDown", "r-truth": "SmackDown", "randy-orton": "SmackDown", "rey-fenix": "SmackDown", "rhea-ripley": "SmackDown", "ricky-saints": "SmackDown", "sami-zayn": "SmackDown", "shinsuke-nakamura": "SmackDown", "solo-sikoa": "SmackDown", "talla-tonga": "SmackDown", "tama-tonga": "SmackDown", "tatum-paxley": "SmackDown", "the-miz": "SmackDown", "tiffany-stratton": "SmackDown", "trick-williams": "SmackDown", "arianna-grace": "NXT", "blake-howard": "NXT", "brad-baylor": "NXT", "brooks-jensen": "NXT", "channing-stacks-lorenzo": "NXT", "charlie-dempsey": "NXT", "cruz-montana": "NXT", "cutler-james": "NXT", "dion-lennox": "NXT", "dorian-van-dux": "NXT", "ek-prosper": "NXT", "elio-lefleur": "NXT", "grayson-waller": "NXT", "hank-walker": "NXT", "izzi-dame": "NXT", "jackson-drake": "NXT", "josh-briggs": "NXT", "kale-dixon": "NXT", "kali-armstrong": "NXT", "karmen-petrovic": "NXT", "kelani-jordan": "NXT", "kendal-grey": "NXT", "lexis-king": "NXT", "lizzy-rain": "NXT", "mason-rook": "NXT", "myka-lockwood": "NXT", "myles-borne": "NXT", "naraku": "NXT", "nikkita-lyons": "NXT", "niko-vance": "NXT", "noam-dar": "NXT", "osiris-griffin": "NXT", "ricky-smokes": "NXT", "romeo-moreno": "NXT", "saquon-shugars": "NXT", "sean-legacy": "NXT", "shawn-spears": "NXT", "shiloh-hill": "NXT", "skylar-raye": "NXT", "tank-ledger": "NXT", "tavion-heights": "NXT", "thea-hail": "NXT", "tony-dangelo": "NXT", "tristan-angels": "NXT", "uriah-connors": "NXT", "wren-sinclair": "NXT", "zaria": "NXT", "zilla-fatu": "NXT", "aj-lee": "Free Agent", "brie-bella": "Free Agent", "danhausen": "Free Agent", "nikki-bella": "Free Agent", "omos": "Free Agent"};
for (const x of WRESTLERS) {
  const b = CURRENT[x.slug];
  if (b) x.brand = b;
  else if (x.brand === "Raw" || x.brand === "SmackDown" || x.brand === "NXT" || x.brand === "Free Agent") x.brand = "Alumni";
}

/**
 * Verified game appearances (scripts/verify-appearances): every mainline and spin-off game is
 * cross-checked against full per-game rosters (TheSmackDownHotel + Pro Wrestling / SmackDown fandom
 * wikis, incl. DLC and alternate ring names). Ratings are only kept for verified games.
 */
const APP = APPEARANCES as Record<string, { mainline: string[]; spinoffs: string[] }>;
for (const x of WRESTLERS) {
  const a = APP[x.slug];
  if (!a) continue;
  x.mainline = a.mainline;
  x.spinoffs = a.spinoffs;
  x.ratings = Object.fromEntries(Object.entries(x.ratings).filter(([g]) => a.mainline.includes(g)));
}

export const BY_SLUG: Record<string, Wrestler> = Object.fromEntries(WRESTLERS.map((x) => [x.slug, x]));

export function ratingSeries(wr: Wrestler) {
  return RATED.filter((c) => wr.ratings[c] != null).map((c) => ({ code: c, value: wr.ratings[c] }));
}

export const BRAND_ORDER: Brand[] = ["Raw", "SmackDown", "NXT", "Free Agent", "Legend", "Alumni"];
