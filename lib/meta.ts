export const METHODS = [
  { id: "official", label: "Official 2K roster reveal", icon: "★" },
  { id: "trailer", label: "Trailer / gameplay footage", icon: "▶" },
  { id: "preorder", label: "Pre-order / edition bonus", icon: "◆" },
  { id: "dlc", label: "DLC pack announcement", icon: "＋" },
  { id: "social", label: "Official WWE / 2K social post", icon: "✦" },
  { id: "leak", label: "Leak / datamine", icon: "⚠" },
  { id: "insider", label: "Insider report", icon: "◉" },
  { id: "other", label: "Other", icon: "•" },
] as const;

export const REPORT_REASONS = [
  { id: "not-confirmed", label: "Not actually confirmed" },
  { id: "weak-source", label: "Source isn't good enough" },
  { id: "wrong-info", label: "Wrong games / ratings info" },
  { id: "fake", label: "Fake or troll entry" },
  { id: "bad-photo", label: "Shared photo is wrong or not allowed" },
  { id: "other", label: "Something else" },
] as const;

export const OFFICIAL_METHODS = new Set(["official", "trailer", "preorder", "dlc", "social"]);
/** reports at which an entry is flagged as disputed */
export const DISPUTE_AT = 3;
