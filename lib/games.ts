export type Game = { code: string; title: string; year: number; mainline: boolean; era: "Pre-SmackDown" | "SmackDown!" | "SmackDown vs. Raw" | "THQ WWE" | "2K" | "Spin-off" };

/** Mainline annual series, in release order. */
export const MAINLINE: Game[] = [
  { code: "SD1", title: "WWF SmackDown!", year: 2000, mainline: true, era: "SmackDown!" },
  { code: "SD2", title: "WWF SmackDown! 2: Know Your Role", year: 2000, mainline: true, era: "SmackDown!" },
  { code: "JBI", title: "WWF SmackDown! Just Bring It", year: 2001, mainline: true, era: "SmackDown!" },
  { code: "SYM", title: "WWE SmackDown! Shut Your Mouth", year: 2002, mainline: true, era: "SmackDown!" },
  { code: "HCTP", title: "WWE SmackDown! Here Comes the Pain", year: 2003, mainline: true, era: "SmackDown!" },
  { code: "SVR", title: "WWE SmackDown! vs. Raw", year: 2004, mainline: true, era: "SmackDown vs. Raw" },
  { code: "SVR06", title: "WWE SmackDown! vs. Raw 2006", year: 2005, mainline: true, era: "SmackDown vs. Raw" },
  { code: "SVR07", title: "WWE SmackDown vs. Raw 2007", year: 2006, mainline: true, era: "SmackDown vs. Raw" },
  { code: "SVR08", title: "WWE SmackDown vs. Raw 2008", year: 2007, mainline: true, era: "SmackDown vs. Raw" },
  { code: "SVR09", title: "WWE SmackDown vs. Raw 2009", year: 2008, mainline: true, era: "SmackDown vs. Raw" },
  { code: "SVR10", title: "WWE SmackDown vs. Raw 2010", year: 2009, mainline: true, era: "SmackDown vs. Raw" },
  { code: "SVR11", title: "WWE SmackDown vs. Raw 2011", year: 2010, mainline: true, era: "SmackDown vs. Raw" },
  { code: "W12", title: "WWE '12", year: 2011, mainline: true, era: "THQ WWE" },
  { code: "W13", title: "WWE '13", year: 2012, mainline: true, era: "THQ WWE" },
  { code: "2K14", title: "WWE 2K14", year: 2013, mainline: true, era: "2K" },
  { code: "2K15", title: "WWE 2K15", year: 2014, mainline: true, era: "2K" },
  { code: "2K16", title: "WWE 2K16", year: 2015, mainline: true, era: "2K" },
  { code: "2K17", title: "WWE 2K17", year: 2016, mainline: true, era: "2K" },
  { code: "2K18", title: "WWE 2K18", year: 2017, mainline: true, era: "2K" },
  { code: "2K19", title: "WWE 2K19", year: 2018, mainline: true, era: "2K" },
  { code: "2K20", title: "WWE 2K20", year: 2019, mainline: true, era: "2K" },
  { code: "2K22", title: "WWE 2K22", year: 2022, mainline: true, era: "2K" },
  { code: "2K23", title: "WWE 2K23", year: 2023, mainline: true, era: "2K" },
  { code: "2K24", title: "WWE 2K24", year: 2024, mainline: true, era: "2K" },
  { code: "2K25", title: "WWE 2K25", year: 2025, mainline: true, era: "2K" },
  { code: "2K26", title: "WWE 2K26", year: 2026, mainline: true, era: "2K" },
];

/** Rated 2K-era slots, in the order used by each wrestler's rating string. */
export const RATED = ["2K14", "2K15", "2K16", "2K17", "2K18", "2K19", "2K20", "2K22", "2K23", "2K24", "2K25", "2K26"];

export const SPINOFFS: Game[] = [
  { code: "WMNES", title: "WWF WrestleMania (NES)", year: 1989, mainline: false, era: "Spin-off" },
  { code: "SWM", title: "WWF Super WrestleMania", year: 1992, mainline: false, era: "Spin-off" },
  { code: "RR93", title: "WWF Royal Rumble", year: 1993, mainline: false, era: "Spin-off" },
  { code: "RAW94", title: "WWF Raw", year: 1994, mainline: false, era: "Spin-off" },
  { code: "WMARC", title: "WWF WrestleMania: The Arcade Game", year: 1995, mainline: false, era: "Spin-off" },
  { code: "WZ", title: "WWF War Zone", year: 1998, mainline: false, era: "Spin-off" },
  { code: "ATT", title: "WWF Attitude", year: 1999, mainline: false, era: "Spin-off" },
  { code: "WM2K", title: "WWF WrestleMania 2000", year: 1999, mainline: false, era: "Spin-off" },
  { code: "NM", title: "WWF No Mercy", year: 2000, mainline: false, era: "Spin-off" },
  { code: "RR", title: "WWF Royal Rumble (Dreamcast)", year: 2000, mainline: false, era: "Spin-off" },
  { code: "RAW", title: "WWF Raw (Xbox)", year: 2002, mainline: false, era: "Spin-off" },
  { code: "WMX8", title: "WWF WrestleMania X8", year: 2002, mainline: false, era: "Spin-off" },
  { code: "WMXIX", title: "WWE WrestleMania XIX", year: 2003, mainline: false, era: "Spin-off" },
  { code: "RAW2", title: "WWE Raw 2", year: 2003, mainline: false, era: "Spin-off" },
  { code: "DOR", title: "WWE Day of Reckoning", year: 2004, mainline: false, era: "Spin-off" },
  { code: "DOR2", title: "WWE Day of Reckoning 2", year: 2005, mainline: false, era: "Spin-off" },
  { code: "LOW", title: "WWE Legends of WrestleMania", year: 2009, mainline: false, era: "Spin-off" },
  { code: "AS", title: "WWE All Stars", year: 2011, mainline: false, era: "Spin-off" },
  { code: "SC", title: "WWE SuperCard", year: 2014, mainline: false, era: "Spin-off" },
  { code: "BG", title: "WWE 2K Battlegrounds", year: 2020, mainline: false, era: "Spin-off" },
];

export const GAME_BY_CODE: Record<string, Game> = Object.fromEntries(
  [...MAINLINE, ...SPINOFFS].map((g) => [g.code, g])
);

const PRE_ORDER = MAINLINE.slice(0, 14).map((g) => g.code);

/** "SD1-SVR06,W13" → ["SD1","SD2",...,"SVR06","W13"] */
export function expandPre(spec: string): string[] {
  if (!spec) return [];
  const out: string[] = [];
  for (const part of spec.split(",").map((s) => s.trim()).filter(Boolean)) {
    const [a, b] = part.split("-");
    const i = PRE_ORDER.indexOf(a);
    const j = b ? PRE_ORDER.indexOf(b) : i;
    if (i < 0 || j < 0) continue;
    for (let k = i; k <= j; k++) out.push(PRE_ORDER[k]);
  }
  return out;
}
