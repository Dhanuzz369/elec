// Typical grid and compliance conditions per destination, used to pre-fill the
// configurator. These are starting points only: the project specification and
// the local utility's approval list always win, and the buyer can edit every field.

export type Country = {
  code: string;
  name: string;
  region: string;
  lv: string;
  mv: string;
  hz: 50 | 60;
  standard: string;
  conformity: string;
  ambient: number;
  plate: string;
};

export const countries: Country[] = [
  { code: "SA", name: "Saudi Arabia", region: "Gulf", lv: "400/230 V", mv: "13.8 kV · 33 kV", hz: 60, standard: "IEC 61439 · IEC 62271 · SEC specs", conformity: "SASO / SABER certificate", ambient: 50, plate: "Arabic and English" },
  { code: "AE", name: "United Arab Emirates", region: "Gulf", lv: "400/230 V", mv: "11 kV · 33 kV", hz: 50, standard: "IEC 61439 · DEWA / ADDC regulations", conformity: "Utility approval list, ECAS where listed", ambient: 50, plate: "English" },
  { code: "QA", name: "Qatar", region: "Gulf", lv: "415/240 V", mv: "11 kV · 33 kV", hz: 50, standard: "IEC 61439 · KAHRAMAA regulations", conformity: "KAHRAMAA approval", ambient: 50, plate: "English" },
  { code: "OM", name: "Oman", region: "Gulf", lv: "415/240 V", mv: "11 kV · 33 kV", hz: 50, standard: "IEC · OES specifications", conformity: "Distribution company approval", ambient: 50, plate: "English" },
  { code: "KW", name: "Kuwait", region: "Gulf", lv: "415/240 V", mv: "11 kV", hz: 50, standard: "IEC · MEW specifications", conformity: "MEW approval", ambient: 55, plate: "Arabic and English" },
  { code: "NG", name: "Nigeria", region: "Africa", lv: "415/240 V", mv: "11 kV · 33 kV", hz: 50, standard: "IEC · NIS", conformity: "SONCAP certificate", ambient: 45, plate: "English" },
  { code: "KE", name: "Kenya", region: "Africa", lv: "415/240 V", mv: "11 kV · 33 kV", hz: 50, standard: "IEC · KS (KEBS)", conformity: "PVoC certificate of conformity", ambient: 40, plate: "English" },
  { code: "TZ", name: "Tanzania", region: "Africa", lv: "400/230 V", mv: "11 kV · 33 kV", hz: 50, standard: "IEC · TZS", conformity: "PVoC certificate of conformity", ambient: 40, plate: "English" },
  { code: "ZA", name: "South Africa", region: "Africa", lv: "400/230 V", mv: "11 kV · 22 kV", hz: 50, standard: "SANS / IEC 61439", conformity: "NRCS where applicable", ambient: 40, plate: "English" },
  { code: "GH", name: "Ghana", region: "Africa", lv: "400/230 V", mv: "11 kV · 33 kV", hz: 50, standard: "IEC · GS", conformity: "GSA conformity", ambient: 40, plate: "English" },
  { code: "BD", name: "Bangladesh", region: "Asia", lv: "400/230 V", mv: "11 kV · 33 kV", hz: 50, standard: "IEC · BDS", conformity: "Utility tender approval", ambient: 45, plate: "English" },
  { code: "LK", name: "Sri Lanka", region: "Asia", lv: "400/230 V", mv: "11 kV · 33 kV", hz: 50, standard: "IEC · SLS", conformity: "CEB / LECO approval", ambient: 40, plate: "English" },
  { code: "NP", name: "Nepal", region: "Asia", lv: "400/230 V", mv: "11 kV · 33 kV", hz: 50, standard: "IEC · NEA specifications", conformity: "NEA approval", ambient: 40, plate: "English" },
  { code: "ID", name: "Indonesia", region: "Asia", lv: "400/230 V", mv: "20 kV", hz: 50, standard: "IEC · SNI", conformity: "SNI marking where listed", ambient: 40, plate: "Bahasa Indonesia and English" },
  { code: "PH", name: "Philippines", region: "Asia", lv: "400/230 V", mv: "13.2 kV · 34.5 kV", hz: 60, standard: "IEC · PEC", conformity: "BPS / ICC where listed", ambient: 40, plate: "English" },
  { code: "AU", name: "Australia", region: "Oceania", lv: "400/230 V", mv: "11 kV · 22 kV · 33 kV", hz: 50, standard: "AS/NZS 61439", conformity: "RCM", ambient: 40, plate: "English" },
  { code: "GB", name: "United Kingdom", region: "Europe", lv: "400/230 V", mv: "11 kV · 33 kV", hz: 50, standard: "BS EN 61439 · BS EN 62271", conformity: "UKCA", ambient: 35, plate: "English" },
  { code: "US", name: "United States", region: "Americas", lv: "480/277 V", mv: "12.47 kV · 13.8 kV", hz: 60, standard: "UL 891 · UL 508A · IEEE C37", conformity: "UL listing or field evaluation", ambient: 40, plate: "English" },
];

export const defaultCountry = countries[0];
