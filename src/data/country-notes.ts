// What is specific to supplying each destination: who runs the network, where sea
// freight from India lands, how the import certificate works, and what to specify.
// Kept to well-established facts; the buyer's specification and utility always win.

export type CountryNotes = {
  utilities: string;
  ports: string;
  certificate: string;
  specify: string;
};

export const countryNotes: Record<string, CountryNotes> = {
  SA: {
    utilities:
      "Saudi Electricity Company (SEC) runs transmission and distribution across the Kingdom, and its distribution specifications decide what an RMU, compact substation or distribution transformer must look like for a utility connection.",
    ports:
      "Sea freight from India usually lands at Jeddah Islamic Port on the Red Sea or King Abdulaziz Port in Dammam on the Gulf, depending on where the site is.",
    certificate:
      "Regulated electrical products need a SASO product certificate registered on the SABER platform, and each consignment then needs a shipment certificate before it clears Saudi customs.",
    specify:
      "Specify 60 Hz for every motor, contactor and transformer, and rate panels and transformers for a 50 °C design ambient. Nameplates are usually asked for in Arabic and English.",
  },
  AE: {
    utilities:
      "Each emirate has its own utility: DEWA in Dubai, SEWA in Sharjah, Etihad Water and Electricity in the northern emirates, and Abu Dhabi's distribution companies. Each keeps its own approved-manufacturer list.",
    ports:
      "Cargo from India usually lands at Jebel Ali in Dubai or Khalifa Port in Abu Dhabi.",
    certificate:
      "Utility projects need equipment from the relevant authority's approved list. Products that fall under the Emirates Conformity Assessment Scheme (ECAS) need its certificate as well.",
    specify:
      "Name the emirate and the utility early, because approved makes and panel layouts differ between DEWA, SEWA and Abu Dhabi. Design for a 50 °C ambient.",
  },
  QA: {
    utilities:
      "KAHRAMAA, the Qatar General Electricity and Water Corporation, is the single utility for transmission and distribution, and its regulations govern every connection to the network.",
    ports: "Sea freight from India lands at Hamad Port, south of Doha.",
    certificate:
      "Switchgear, distribution boards and transformers for a KAHRAMAA connection must come from manufacturers and models on KAHRAMAA's approved list.",
    specify:
      "Quote 415/240 V on the low-voltage side, 11 kV for most distribution, and a 50 °C design ambient. Check the approved-list status of each make before ordering.",
  },
  OM: {
    utilities:
      "Distribution in northern Oman is run by the Nama group's distribution companies, with rural and remote areas served separately, and each publishes its own equipment specifications.",
    ports: "Cargo from India usually lands at Sohar on the Batinah coast or at Salalah in the south.",
    certificate:
      "Equipment for a utility connection needs the distribution company's approval, built to the Oman Electrical Standards (OES) that apply.",
    specify:
      "Confirm which distribution company serves the site, since approvals are per company. Use 11 kV or 33 kV on the MV side and a 50 °C design ambient.",
  },
  KW: {
    utilities:
      "Kuwait's Ministry of Electricity and Water (MEW) owns and runs the network and publishes the specifications that substations and consumer intakes must follow.",
    ports: "Sea freight from India lands at Shuwaikh Port in Kuwait City or Shuaiba Port to the south.",
    certificate:
      "Equipment connected to the MEW network must be approved by the ministry, and project submittals are reviewed against MEW specifications before delivery.",
    specify:
      "Kuwait uses 415/240 V on the low-voltage side and 11 kV for distribution, with a 55 °C design ambient, one of the hottest in the region. Ask for the MEW approval status of each make with the quote.",
  },
  NG: {
    utilities:
      "Transmission is run by the Transmission Company of Nigeria (TCN), and distribution by regional distribution companies such as Ikeja Electric, Eko and Abuja Electricity Distribution.",
    ports:
      "Cargo from India usually lands at Apapa or Tin Can Island in Lagos, or at Onne in Rivers State for projects in the south-east.",
    certificate:
      "Regulated products need a SONCAP product certificate, and each shipment then needs its own SONCAP certificate to clear Nigerian customs.",
    specify:
      "Build to the Nigerian Industrial Standards (NIS) that adopt IEC, at 415/240 V and 50 Hz, and allow for long cable runs and unstable supply with suitable protection and changeover.",
  },
  KE: {
    utilities:
      "Kenya Power runs distribution nationwide, while KETRACO builds and runs high-voltage transmission. Kenya Power's specifications apply to anything connected to its network.",
    ports: "Sea freight from India lands at the Port of Mombasa.",
    certificate:
      "Regulated goods need a Certificate of Conformity under the Pre-Export Verification of Conformity (PVoC) programme run for the Kenya Bureau of Standards, issued before the goods leave India.",
    specify:
      "Kenya uses 415/240 V and 50 Hz, with 11 kV and 33 kV distribution. Book PVoC inspection early, because the goods cannot ship until the certificate is issued.",
  },
  TZ: {
    utilities:
      "TANESCO, the Tanzania Electric Supply Company, generates, transmits and distributes most of the country's electricity, and its standards apply to network connections.",
    ports: "Sea freight from India lands at the Port of Dar es Salaam.",
    certificate:
      "Regulated products need a Certificate of Conformity under the PVoC programme of the Tanzania Bureau of Standards, issued before shipment.",
    specify:
      "Tanzania uses 400/230 V and 50 Hz, with 11 kV and 33 kV distribution. Allow time for the pre-shipment inspection in the production plan.",
  },
  ZA: {
    utilities:
      "Eskom runs transmission and supplies many customers directly, while municipalities such as City Power in Johannesburg distribute in their own areas, each with its own requirements.",
    ports: "Cargo from India usually lands at Durban, with Cape Town and Gqeberha (Port Elizabeth) for the southern and western regions.",
    certificate:
      "Electrical products under a compulsory specification need a Letter of Authority from the National Regulator for Compulsory Specifications (NRCS) before they are sold.",
    specify:
      "South Africa uses 400/230 V and 50 Hz and builds to SANS standards, which largely adopt IEC. Confirm whether the site is supplied by Eskom or a municipality.",
  },
  GH: {
    utilities:
      "The Electricity Company of Ghana (ECG) distributes in the south and the Northern Electricity Distribution Company (NEDCo) in the north, with GRIDCo running transmission.",
    ports: "Sea freight from India lands at Tema, near Accra, or at Takoradi in the west.",
    certificate:
      "Imported electrical products are checked against Ghana Standards Authority (GSA) requirements, and regulated items need GSA conformity before they are released.",
    specify:
      "Ghana uses 400/230 V and 50 Hz with 11 kV and 33 kV distribution. Confirm whether ECG or NEDCo serves the site, since their specifications differ.",
  },
  BD: {
    utilities:
      "Distribution is split between several utilities: the Bangladesh Power Development Board, DPDC and DESCO in Dhaka, the West Zone Power Distribution Company and the Rural Electrification Board.",
    ports: "Sea freight from India lands at Chattogram (Chittagong) or at Mongla in the south-west.",
    certificate:
      "Utility projects are bought by tender, and the equipment must meet the tender's technical schedule and the purchasing utility's approval.",
    specify:
      "Bangladesh uses 400/230 V and 50 Hz, with 11 kV and 33 kV distribution. Work from the tender's guaranteed technical particulars, line by line.",
  },
  LK: {
    utilities:
      "The Ceylon Electricity Board (CEB) runs most of the network, and Lanka Electricity Company (LECO) distributes in parts of the western coastal belt.",
    ports: "Sea freight from India lands at the Port of Colombo.",
    certificate:
      "Equipment connected to the network needs approval from CEB or LECO, whichever serves the site.",
    specify:
      "Sri Lanka uses 400/230 V and 50 Hz, with 11 kV and 33 kV distribution. Allow for a humid coastal climate in enclosure and coating choices.",
  },
  NP: {
    utilities:
      "Nepal Electricity Authority (NEA) generates, transmits and distributes most of the country's electricity, and its specifications govern network connections.",
    ports:
      "Nepal has no seaport: cargo from India travels by road or rail, usually through the Raxaul–Birgunj crossing and the Birgunj dry port.",
    certificate:
      "Equipment for a network connection needs NEA approval, usually set out in the tender or connection agreement.",
    specify:
      "Nepal uses 400/230 V and 50 Hz, with 11 kV and 33 kV distribution. Ask for altitude derating on hill and mountain sites, since equipment above 1000 m needs it.",
  },
  ID: {
    utilities:
      "PLN, the state electricity company, runs transmission and distribution across Indonesia's islands, and its standards apply to every network connection.",
    ports: "Cargo from India usually lands at Tanjung Priok in Jakarta or Tanjung Perak in Surabaya.",
    certificate:
      "Products that fall under a mandatory Indonesian National Standard (SNI) need the SNI mark before they are imported; others follow PLN's requirements.",
    specify:
      "Indonesia uses 400/230 V and 50 Hz, with 20 kV medium-voltage distribution rather than 11 kV. Make sure transformers and RMUs are specified for 20 kV.",
  },
  PH: {
    utilities:
      "Meralco distributes power in Metro Manila and nearby provinces, electric cooperatives serve much of the rest of the country, and NGCP runs transmission.",
    ports: "Cargo from India usually lands at Manila, Batangas or Cebu.",
    certificate:
      "Products covered by Bureau of Philippine Standards (BPS) rules need a PS mark or an Import Commodity Clearance (ICC) before they are sold.",
    specify:
      "The Philippines uses 60 Hz, so motors, contactors and transformers must be rated for it. Specify 400/230 V on the low-voltage side and 13.2 kV or 34.5 kV for distribution.",
  },
  AU: {
    utilities:
      "Distribution network service providers such as Ausgrid, Energex and Western Power each run their own areas and publish their own connection rules.",
    ports: "Cargo from India usually lands at Melbourne, Sydney's Port Botany or Brisbane.",
    certificate:
      "In-scope electrical equipment must carry the Regulatory Compliance Mark (RCM), which the Australian supplier registers. Installations follow the AS/NZS 3000 wiring rules.",
    specify:
      "Build switchboards to AS/NZS 61439 and confirm the network operator's requirements for the site. Australia uses 400/230 V and 50 Hz, with 11 kV, 22 kV and 33 kV distribution.",
  },
  GB: {
    utilities:
      "Distribution network operators such as UK Power Networks and Scottish and Southern Electricity Networks run regional networks; National Grid runs transmission in England and Wales.",
    ports: "Cargo from India usually lands at Felixstowe, Southampton or London Gateway.",
    certificate:
      "Electrical equipment placed on the market in Great Britain needs a conformity marking and a declaration of conformity from the manufacturer or importer.",
    specify:
      "Build to the BS EN versions of the IEC standards. Britain uses 400/230 V and 50 Hz, with 11 kV and 33 kV distribution and a 35 °C design ambient.",
  },
  US: {
    utilities:
      "Power is distributed by investor-owned utilities, municipal utilities and rural cooperatives, and installations follow the National Electrical Code (NFPA 70).",
    ports: "Cargo from India usually lands at Houston, Savannah, New York and New Jersey, or Los Angeles and Long Beach.",
    certificate:
      "Equipment generally needs listing by a Nationally Recognized Testing Laboratory such as UL, or a field evaluation, before the local inspector will approve it.",
    specify:
      "Specify 60 Hz and 480/277 V or 208/120 V, and build panels to UL 891 or UL 508A rather than IEC 61439. This is a different design from IEC equipment, not a relabelling.",
  },
};
