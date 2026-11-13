import coverIllustrationUrl from "../assets/images/zofate_sulhnu_cover_1794582889010.jpg";
import type {
  BookProject,
  ChapterData,
  GlossaryCategory,
  GlossaryEntry,
} from "../types/book";

export const BOOK_MAIN_TITLE = "ZOFATE SULHNU";
export const BOOK_SUBTITLE = "Tobul, Lalte, Thawnthu leh Chanchin Ril";
export const COVER_ILLUSTRATION_PATH = coverIllustrationUrl;

function makeInitialRevision(content = "") {
  const revId = "rev-1";
  return {
    revisions: [
      {
        id: revId,
        label: "Rev 1",
        content,
        createdAt: Date.now(),
        note: "Initial draft",
      },
    ],
    activeRevisionId: revId,
  };
}

import {
  BUNG_1_CONTENT,
  BUNG_2_CONTENT,
  BUNG_3_CONTENT,
  BUNG_4_CONTENT,
  BUNG_5_CONTENT,
  BUNG_6_CONTENT,
  BUNG_7_CONTENT,
  BUNG_8_CONTENT,
  BUNG_9_CONTENT,
  BUNG_10_CONTENT,
} from "./chaptersContent";

import {
  PASALTHA_BUNG_1_CONTENT,
  PASALTHA_BUNG_2_CONTENT,
  PASALTHA_BUNG_3_CONTENT,
  PASALTHA_BUNG_4_CONTENT,
  PASALTHA_BUNG_5_CONTENT,
  PASALTHA_BUNG_6_CONTENT,
  PASALTHA_BUNG_7_CONTENT,
  FOLK_BUNG_1_CONTENT,
  FOLK_BUNG_2_CONTENT,
  FOLK_BUNG_3_CONTENT,
  FOLK_BUNG_4_CONTENT,
  FOLK_BUNG_5_CONTENT,
  FOLK_BUNG_6_CONTENT,
  FOLK_BUNG_7_CONTENT,
  ARCHIVE_BUNG_1_CONTENT,
  ARCHIVE_BUNG_2_CONTENT,
  ARCHIVE_BUNG_3_CONTENT,
  ARCHIVE_BUNG_4_CONTENT,
} from "./storyBooksContent";

export {
  BUNG_1_CONTENT,
  BUNG_2_CONTENT,
  BUNG_3_CONTENT,
  BUNG_4_CONTENT,
  BUNG_5_CONTENT,
  BUNG_6_CONTENT,
  BUNG_7_CONTENT,
  BUNG_8_CONTENT,
  BUNG_9_CONTENT,
  BUNG_10_CONTENT,
};

export const INITIAL_CHAPTERS: ChapterData[] = [
  {
    id: 1,
    bungLabel: "Bung 1",
    title: "Chhinlung leh Khawpui — Zofate Tobul leh Hnam Peng Hrang Hrangte Darh Dan",
    eraOrTheme: "Tobul leh Pem Darh Hun",
    summary:
      "Chhinlung chhuahsan dan thawnthu leh chhinchhiahna, Khawpui leh Shan/Chin phai paltlang dan, Tiau lui rala chawlh leh Zofate hnam peng (Lusei, Lai, Mara, Hmar, Paite, Ralte, Thadou-Kuki leh peng dangte) tlangrama an pem darh dan chanchin.",
    keyFigures: [
      "Chhinlung",
      "Khawpui",
      "Tiau Lui",
      "Selesih",
      "Lusei",
      "Lai",
      "Mara",
      "Hmar",
      "Ralte",
      "Paite",
      "Zahmuaka",
    ],
    content: BUNG_1_CONTENT,
    customFocus: "",
    updatedAt: Date.now(),
    ...makeInitialRevision(BUNG_1_CONTENT),
  },
  {
    id: 2,
    bungLabel: "Bung 2",
    title:
      "Hmanlai Sakhuana, Sadawt, Bawlpu leh Lasi Khawvel (Lalruanga, Keichala, Chawngtinleri, Tan Tlang & Rih Dil)",
    eraOrTheme: "Sakhaw Hlui leh Thlarau Khawvel",
    summary:
      "Pathian (Khuavang, Lasi, Khuazingnu) biak dan leh inthawina hmanlai serh leh sang; Sadawt leh Bawlpu mawhphurhna; dawi thiam ropui Lalruanga, sakei leh mihring inkara leng Keichala, Lasi lalnu Chawngtinleri, Tan Tlang chanchin leh thlaraute pialral kalkawng Rih Dil.",
    keyFigures: [
      "Sadawt",
      "Bawlpu",
      "Lalruanga",
      "Keichala",
      "Chawngtinleri",
      "Tan Tlang",
      "Rih Dil",
      "Khuavang",
    ],
    content: BUNG_2_CONTENT,
    customFocus: "",
    updatedAt: Date.now(),
    ...makeInitialRevision(BUNG_2_CONTENT),
  },
  {
    id: 3,
    bungLabel: "Bung 3",
    title:
      "Kâ-a Inhlanchhawn Thawnthu leh Finna (Chhura & Nahaia, Chemtatrawta, Tlumtea, Kungawrhi & Phawthira)",
    eraOrTheme: "Thawnthu Hlui leh Finna",
    summary:
      "Zawlbuk meipui bula kâ-a inhlanchhawn Mizo thawnthu ropui leh zirtir nei thuk takte: Chhura leh Nahaia chetdan nuihzatthlak leh fing si, Chemtatrawta thawnthu inthlung chho dan, Tlumtea huaisenna, Kungawrhi leh Keimi, Phawthira leh Hmuichukchuriduninu thawnthute.",
    keyFigures: [
      "Chhura",
      "Nahaia",
      "Chemtatrawta",
      "Tlumtea",
      "Kungawrhi",
      "Phawthira",
      "Hmuichukchuriduninu",
    ],
    content: BUNG_3_CONTENT,
    customFocus: "",
    updatedAt: Date.now(),
    ...makeInitialRevision(BUNG_3_CONTENT),
  },
  {
    id: 4,
    bungLabel: "Bung 4",
    title:
      "Mi Naran, Sal leh Hmeichhe Thawnthu Ril (Pi Hmuaki, Darlalpuii leh Sibuta Lung, Tualvungi & Zawlpala, Lianchhiari, Saikuti)",
    eraOrTheme: "Hmeichhe Hmingthang leh Thinlung Thawnthu",
    summary:
      "Lal ropui piah lama hmeichhiate, mi naran leh salte tawrhna, hmangaihna leh hla phuah thiamna: hla phuah thiam Pi Hmuaki, sal nula Darlalpuii leh Sibuta Lung rapthlak leh lungchhiatthlak, Tualvungi leh Zawlpala hmangaihna thu, Lianchhiari lunglen tlang, leh zai thiam Saikuti.",
    keyFigures: [
      "Pi Hmuaki",
      "Darlalpuii",
      "Sibuta Lung",
      "Tualvungi",
      "Zawlpala",
      "Lianchhiari",
      "Saikuti",
    ],
    content: BUNG_4_CONTENT,
    customFocus: "",
    updatedAt: Date.now(),
    ...makeInitialRevision(BUNG_4_CONTENT),
  },
  {
    id: 5,
    bungLabel: "Bung 5",
    title:
      "Zahmuaka Thlahte leh Lusei Lal Hnam 6 (Zadeng, Palian, Thangluah, Rivung, Rokhum, leh Sailo Lalte — Lallula, Vanhnuailiana)",
    eraOrTheme: "Lusei Lal Hnam 6 Rorelna",
    summary:
      "Zahmuaka leh a fapa parukte chanchin aṭanga Lusei lal hnam 6 — Zadeng, Palian, Thangluah, Rivung, Rokhum leh Sailo — indin dan; Lallula thiltihtheihna leh Thlanrawn rawtna bulpui, Selesih khawpui ropui leh Vanhnuailiana rorelna zau takte.",
    keyFigures: [
      "Zahmuaka",
      "Zadeng",
      "Palian",
      "Thangluah",
      "Rivung",
      "Rokhum",
      "Sailo",
      "Lallula",
      "Vanhnuailiana",
    ],
    content: BUNG_5_CONTENT,
    customFocus: "",
    updatedAt: Date.now(),
    ...makeInitialRevision(BUNG_5_CONTENT),
  },
  {
    id: 6,
    bungLabel: "Bung 6",
    title:
      "Chhim Lam leh Hnam Peng Dang Lalte Rorelna (Lai/Pawi Lalte - Hengmanga/Sangchema, Mara Lalte - Tlohsai/Hawthai, Fanai, Hmar)",
    eraOrTheme: "Chhim Lam leh Hnam Peng Lalte",
    summary:
      "Sailo lalte ruala Zoram chhim leh hmar-chhaka roreltu hnam peng dang lalte chanchin kimchang: Lai (Pawi) lal huaisen Hengmanga leh Sangchema, Mara lal ropui Tlohsai leh Hawthai khua te, Fanai lalte (Khawbel leh Chhim lam), leh Hmar lalte rorelna leh indo thawnthute.",
    keyFigures: [
      "Hengmanga",
      "Sangchema",
      "Tlohsai",
      "Hawthai",
      "Fanai",
      "Hmar",
      "Lai",
      "Mara",
    ],
    content: BUNG_6_CONTENT,
    customFocus: "",
    updatedAt: Date.now(),
    ...makeInitialRevision(BUNG_6_CONTENT),
  },
  {
    id: 7,
    bungLabel: "Bung 7",
    title:
      "Pasaltha Ropuite leh Indona Hlui (Vanapa, Chawngbawla, Taitesena, Zampuimanga, Thlanrawn Rawtna, Chhak leh Thlang Indo, Khawnglung Run 1856)",
    eraOrTheme: "Pasalthate leh Khaw Indo Hun",
    summary:
      "Tlawmngaihna leh huaisenna entirna ropui ber pasalthate: Vanapa (Thangzachhinga), Chawngbawla, Taitesena, Zampuimanga, Neuva leh pasaltha dangte; Thlanrawn Rawtna, Chhak leh Thlang Indo rapthlak leh Khawnglung Run 1856 (Chalkunga leh Thanghlianga te hun lai).",
    keyFigures: [
      "Vanapa",
      "Chawngbawla",
      "Taitesena",
      "Zampuimanga",
      "Thlanrawn Rawtna",
      "Chhak leh Thlang Indo",
      "Khawnglung Run 1856",
    ],
    content: BUNG_7_CONTENT,
    customFocus: "",
    updatedAt: Date.now(),
    ...makeInitialRevision(BUNG_7_CONTENT),
  },
  {
    id: 8,
    bungLabel: "Bung 8",
    title:
      "Vailian, British Runna leh Ram Chhantute (Zoluti Man Thu, Bengkhuaia, Rothangpuia, Lal Ropuiliani, Khuangchera, Zakapa)",
    eraOrTheme: "Vailian leh Zalenna Sual Hun",
    summary:
      "Sap (British) leh Zofate intawnna leh inbeihna lian takte: Alexandrapur leh Zoluti (Mary Winchester) man thu, Bengkhuaia huaisenna, Rothangpuia remhriatna, hmeichhe lal huaisen Lal Ropuiliani chanchin, pasaltha Khuangchera Aizawl leh Changsil inkara a thih dan leh Zakapa helna.",
    keyFigures: [
      "Zoluti",
      "Bengkhuaia",
      "Rothangpuia",
      "Lal Ropuiliani",
      "Khuangchera",
      "Zakapa",
      "Vailian",
    ],
    content: BUNG_8_CONTENT,
    customFocus: "",
    updatedAt: Date.now(),
    ...makeInitialRevision(BUNG_8_CONTENT),
  },
  {
    id: 9,
    bungLabel: "Bung 9",
    title:
      "Chanchin Tha, A AW B (1894), Bawi Chhuah leh Thu leh Hla Sulsutute (Darphawka, Pu Buanga & Sap Upa, Dr. Peter Fraser, Kaphleia, L. Biakliana, Rokunga, Patea)",
    eraOrTheme: "Thim Ata Engah — Thu leh Hla Zoram",
    summary:
      "Thlarau lam harhna leh thiamna eng lo luh dan: Darphawka mumang ropui, 1894-a Pu Buanga (J.H. Lorrain) leh Sap Upa (F.W. Savidge) ten A AW B an siam dan, Dr. Peter Fraser leh Bawi Chhuah thu, leh Mizo thu leh hla sulsutu hmasa Kaphleia, L. Biakliana, Rokunga leh Patea te kut chhuak.",
    keyFigures: [
      "Darphawka",
      "Pu Buanga",
      "Sap Upa",
      "Dr. Peter Fraser",
      "Kaphleia",
      "L. Biakliana",
      "Rokunga",
      "Patea",
    ],
    content: BUNG_9_CONTENT,
    customFocus: "",
    updatedAt: Date.now(),
    ...makeInitialRevision(BUNG_9_CONTENT),
  },
  {
    id: 10,
    bungLabel: "Bung 10",
    title:
      "Lal Ban, Zoram Buai (1966), Remna (1986) leh Zoram Thar (R. Vanlawma, Ch. Saprawnga, Laldenga, Brig. T. Sailo, Lal Thanhawla, LADC/MADC)",
    eraOrTheme: "Tunlai Zoram leh Remna Zoram Thar",
    summary:
      "Mizo Union leh Lal Ban thu (1954), Mautam tam leh MNF din dan, kum 1966 Zoram Buai thim leh khawkhawm (Grouping) tawrhna, 1986 Remna Thuthlung (Mizoram Peace Accord), leh R. Vanlawma, Ch. Saprawnga, Laldenga, Brig. T. Sailo, Lal Thanhawla leh LADC/MADC te chanvo pawimawh takte.",
    keyFigures: [
      "R. Vanlawma",
      "Ch. Saprawnga",
      "Laldenga",
      "Brig. T. Sailo",
      "Lal Thanhawla",
      "LADC",
      "MADC",
      "Remna 1986",
    ],
    content: BUNG_10_CONTENT,
    customFocus: "",
    updatedAt: Date.now(),
    ...makeInitialRevision(BUNG_10_CONTENT),
  },
];

export const MASTER_BOOK_PROJECT: BookProject = {
  id: "book-master-zofate-sulhnu",
  title: BOOK_MAIN_TITLE,
  subtitle: BOOK_SUBTITLE,
  mode: "master",
  chapters: INITIAL_CHAPTERS,
  createdAt: Date.now(),
};

export const PASALTHA_CHAPTERS: ChapterData[] = [
  {
    id: 1,
    bungLabel: "Bung 1",
    title: "Pasaltha Taitesena (Ralthatchhûnga) — A Tlawmngaihna Leh A Huaisenna Ropui",
    eraOrTheme: "Tlawmngaihna & Raldo Nun",
    summary:
      "Khawrihnim a piang Ralthatchhûnga (Khiangte hnam), Sehrmun a cheng, hmeithai fahrah tan a nun pe tu Mizo tlawmngaihna hmelchhanna ropui.",
    keyFigures: ["Taitesena", "Khalhvunga", "Dothangi", "Pahanga"],
    content: PASALTHA_BUNG_1_CONTENT,
    customFocus: "Pasaltha Tlawmngaihna",
    updatedAt: Date.now(),
    ...makeInitialRevision(PASALTHA_BUNG_1_CONTENT),
  },
  {
    id: 2,
    bungLabel: "Bung 2",
    title: "Pasaltha Chawngbawla — Ral Hrât leh Chemkalhna Thawnthu",
    eraOrTheme: "Chhak leh Thlang Indo Hun Lai",
    summary:
      "Chhakchhuak hnam Chawngbawla, Seipuia khua a mi, 'Ka kawi Chawngbawla a tlan ngai lo' thufing dintu pasaltha ngawichawi leh tawrhchhel.",
    keyFigures: ["Chawngbawla", "Neuva"],
    content: PASALTHA_BUNG_2_CONTENT,
    customFocus: "Chemkalhna & Ral Do",
    updatedAt: Date.now(),
    ...makeInitialRevision(PASALTHA_BUNG_2_CONTENT),
  },
  {
    id: 3,
    bungLabel: "Bung 3",
    title: "Pasaltha Khuangchera & Ngurbawnga — Changsil Kulh Vengtute",
    eraOrTheme: "1890 British Indo",
    summary:
      "Chhippui a piang Thangṭhiauva fapa Khuangchera (Ralte Kawlni), Parvatui pasaltha, September 13, 1890-a Changsil kulh beihnaa nun hlantu.",
    keyFigures: ["Khuangchera", "Ngurbawnga", "Thangṭhiauva"],
    content: PASALTHA_BUNG_3_CONTENT,
    customFocus: "Anti-Colonial Resistance",
    updatedAt: Date.now(),
    ...makeInitialRevision(PASALTHA_BUNG_3_CONTENT),
  },
  {
    id: 4,
    bungLabel: "Bung 4",
    title: "Pasaltha Neuva (Hnawncheuva) — Ral Rel Thiam leh Kalsiam Ropui",
    eraOrTheme: "Ral Rel Finna & Khaw Venghimna",
    summary:
      "Chawngbawla ṭhian zual, ral rel thiam leh tawrhchhel chungchuang, Chhim leh Hmar indo laia hmelma lo bum thiamtu pasaltha.",
    keyFigures: ["Neuva", "Chawngbawla"],
    content: PASALTHA_BUNG_4_CONTENT,
    customFocus: "Tactics & Strategy",
    updatedAt: Date.now(),
    ...makeInitialRevision(PASALTHA_BUNG_4_CONTENT),
  },
  {
    id: 5,
    bungLabel: "Bung 5",
    title: "Pasaltha Vanapa (Thangzachhinga) — Tualte Vengtu Ropui",
    eraOrTheme: "Zawlbuk Pa & Raldona",
    summary:
      "Thangzachhinga (Hmar Chongthu), Lalsavunga leh Vanhnuailiana pasaltha ber, zaidam zir chhuaktu leh hmeithai thlawhhma kian thiamtu.",
    keyFigures: ["Vanapa", "Lalsavunga", "Vanhnuailiana", "Chhawnthangi"],
    content: PASALTHA_BUNG_5_CONTENT,
    customFocus: "Noble Warriorhood",
    updatedAt: Date.now(),
    ...makeInitialRevision(PASALTHA_BUNG_5_CONTENT),
  },
  {
    id: 6,
    bungLabel: "Bung 6",
    title: "Pasaltha Zampuimanga (Manga) — Sakei 13 Sat Hlumtu",
    eraOrTheme: "Sakap Pasaltha & Sahrâng Hmachhawnna",
    summary:
      "Kum 1801-a Zampui khua a piang Manga (Chhakchhuak Hualngo), Thanghuliana fapa, a dam chhunga sakei 13 lai thattu sakap pasaltha.",
    keyFigures: ["Zampuimanga", "Thanghuliana", "Lalsavunga"],
    content: PASALTHA_BUNG_6_CONTENT,
    customFocus: "Hunter Legends",
    updatedAt: Date.now(),
    ...makeInitialRevision(PASALTHA_BUNG_6_CONTENT),
  },
  {
    id: 7,
    bungLabel: "Bung 7",
    title: "Pasaltha Saizahawla & Pasaltha Vawmkaia — Hnam Humhalhtute",
    eraOrTheme: "Zualko Tlan Chak & Ramri Vengtute",
    summary:
      "1858-a piang Saizahawla (Hmar Thiak, Khawruhlian lal puithiam & thirdeng pasaltha) leh Vawmkaia (Lal Nikuala pasaltha).",
    keyFigures: ["Saizahawla", "Vawmkaia", "Pâwibâwia", "Nikuala"],
    content: PASALTHA_BUNG_7_CONTENT,
    customFocus: "Frontier Guardians",
    updatedAt: Date.now(),
    ...makeInitialRevision(PASALTHA_BUNG_7_CONTENT),
  },
];

export const PASALTHA_BOOK_PROJECT: BookProject = {
  id: "book-story-mizo-pasalthate",
  title: "Mizo Pasaltha Ropuite & Raldona Thawnthu",
  subtitle:
    "Zofate Tlawmngaihna, Huaisenna leh Hnam Hum Nana Nun Hlantute",
  mode: "single_story",
  topicFocus: "Mizo Pasalthate Chanchin & Raldona",
  chapters: PASALTHA_CHAPTERS,
  createdAt: Date.now(),
};

export const FOLKTALES_CHAPTERS: ChapterData[] = [
  {
    id: 1,
    bungLabel: "Bung 1",
    title: "Chhura leh Nahaia — Fing Varpui leh Mawl Thilmak",
    eraOrTheme: "Pi-pu Fiamthu & Zirtirna Ril",
    summary:
      "Sekibuhchhuak, Mawngping khua verh, leilung vaw rualtu Chhura leh a ṭhian verther Nahaia.",
    keyFigures: ["Chhura", "Nahaia"],
    content: FOLK_BUNG_1_CONTENT,
    customFocus: "Mizo Folk Humour & Morality",
    updatedAt: Date.now(),
    ...makeInitialRevision(FOLK_BUNG_1_CONTENT),
  },
  {
    id: 2,
    bungLabel: "Bung 2",
    title: "Mauruangi — Nu Hrawn Tuarna, Vamur Thuruk leh Phunchawng Par",
    eraOrTheme: "Fahrah Hmangaihna & Dawi Thawnthu",
    summary:
      "Thaichhawninu (sangha), Phunchawng par mawi, Bingtaii nuhrawn duhdahna leh Vai lal nupui nihna.",
    keyFigures: ["Mauruangi", "Bingtaii"],
    content: FOLK_BUNG_2_CONTENT,
    customFocus: "Folk Tale of Righteous Vindication",
    updatedAt: Date.now(),
    ...makeInitialRevision(FOLK_BUNG_2_CONTENT),
  },
  {
    id: 3,
    bungLabel: "Bung 3",
    title: "Liandova te Unau & Tuaisiala — Fahrah Tuarna leh Khuangchawi Ropui",
    eraOrTheme: "Tlawmngaihna & Ropui Tanchhuahna",
    summary:
      "Liandova leh Tuaisiala retheih tuarna, bawngpa damlo enkawl, leh khaw pumpui hrai na Khuangchawi ruai.",
    keyFigures: ["Liandova", "Tuaisiala"],
    content: FOLK_BUNG_3_CONTENT,
    customFocus: "Triumph of Humility & Care",
    updatedAt: Date.now(),
    ...makeInitialRevision(FOLK_BUNG_3_CONTENT),
  },
  {
    id: 4,
    bungLabel: "Bung 4",
    title:
      "Chepahakhata — Changêl Hmun, Belte-phai-thei-lo leh Vaiva & Vakul Finfiahna",
    eraOrTheme: "Mizo Finna & Thluak Hman Dan",
    summary:
      "Chepahakhata, changêl hmun khaw ropuia chantir, nupui van lawn, Belte-phai-thei-lo, hmawng lera zeh, leh Vaiva & Vakul finna hmanga Vai Lal hneh dan.",
    keyFigures: ["Chepahakhata", "Vaiva", "Vakul"],
    content: FOLK_BUNG_4_CONTENT,
    customFocus: "Triumph of Wit & Morality",
    updatedAt: Date.now(),
    ...makeInitialRevision(FOLK_BUNG_4_CONTENT),
  },
  {
    id: 5,
    bungLabel: "Bung 5",
    title: "Rimenhawihi — Zoram Nula Hmelṭha Ber & Sam Zai Luang Thla",
    eraOrTheme: "Hmangaihna & Hmelṭhatna Ropui",
    summary:
      "Sam zai mawi luia thlah thlak leh Tuipui kam Vai lalpa'n a zawng chhuak thawnthu.",
    keyFigures: ["Rimenhawihi"],
    content: FOLK_BUNG_5_CONTENT,
    customFocus: "The Golden Haired Maiden",
    updatedAt: Date.now(),
    ...makeInitialRevision(FOLK_BUNG_5_CONTENT),
  },
  {
    id: 6,
    bungLabel: "Bung 6",
    title: "Kungawrhi — Keimi Laka Zalenna leh Pasalthate Chhan Chhuah",
    eraOrTheme: "Keimi Puk & Pasaltha Chhanchhuahna",
    summary:
      "Kutzungpui aṭanga lo piang, Keimi hovin puk thuka an ruk bo, Hranga leh Phunga'n an chhan chhuah dan.",
    keyFigures: ["Kungawrhi", "Hranga", "Phunga"],
    content: FOLK_BUNG_6_CONTENT,
    customFocus: "Tiger-Shifter & Rescue Legend",
    updatedAt: Date.now(),
    ...makeInitialRevision(FOLK_BUNG_6_CONTENT),
  },
  {
    id: 7,
    bungLabel: "Bung 7",
    title:
      "Tualvungi leh Zawlpala, Chawngchilhi & Lianchia — Pi-pute Lunglen Thawnthu",
    eraOrTheme: "Lunglenna, Hmangaihna & Dawi Thawnthu",
    summary:
      "Tualvungi leh Zawlpala thlan khata inphum dun, Lianchia Mizo tlangval hmelṭha ber boral dan, leh Chawngchilhi rul lian hmangaihna.",
    keyFigures: ["Tualvungi", "Zawlpala", "Lianchia", "Chawngchilhi"],
    content: FOLK_BUNG_7_CONTENT,
    customFocus: "Serpent Legends & Tragic Love",
    updatedAt: Date.now(),
    ...makeInitialRevision(FOLK_BUNG_7_CONTENT),
  },
];

export const FOLKTALES_BOOK_PROJECT: BookProject = {
  id: "book-story-mizo-folktales",
  title: "Mizo Pi-Pu Thawnthu & Folktales Master Collection",
  subtitle:
    "Zofate Thinlung Hlumtu Pi-Pu Thawnthu Ropui leh Zirtirna Rilte",
  mode: "single_story",
  topicFocus: "Pi-Pu Thawnthu & Folktales",
  chapters: FOLKTALES_CHAPTERS,
  createdAt: Date.now(),
};

export const ARCHIVAL_CHAPTERS: ChapterData[] = [
  {
    id: 1,
    bungLabel: "Bung 1",
    title: "Mizo Khawtlang Inrelbawlna, Tlawmngaihna & Zawlbuk Thununna",
    eraOrTheme: "Colonial & Traditional Anthropology",
    summary:
      "Rev. Liangkhaia, J. Shakespear, N.E. Parry chhinchhiahna: Val upa, Zawlbuk zirtirna, tlawmngaihna.",
    keyFigures: ["Rev. Liangkhaia", "J. Shakespear"],
    content: ARCHIVE_BUNG_1_CONTENT,
    customFocus: "Village Structure & Zawlbuk",
    updatedAt: Date.now(),
    ...makeInitialRevision(ARCHIVE_BUNG_1_CONTENT),
  },
  {
    id: 2,
    bungLabel: "Bung 2",
    title: "Hmanlai Sakhua, Ramhuai Biakna, Puithiam leh Mithikhua",
    eraOrTheme: "Animism & Spiritual Beliefs",
    summary:
      "Pathian, huai hrang hrang, bawpu leh puithiam inthawina, Rih dil leh Pialral kalkawng.",
    keyFigures: ["Puithiam", "Bawpu"],
    content: ARCHIVE_BUNG_2_CONTENT,
    customFocus: "Spiritualism & Eschatology",
    updatedAt: Date.now(),
    ...makeInitialRevision(ARCHIVE_BUNG_2_CONTENT),
  },
  {
    id: 3,
    bungLabel: "Bung 3",
    title: "Mautam leh Thingtam Chhinchhiahna (1862, 1881, 1911, 1959)",
    eraOrTheme: "Bamboo Flowering & Famines",
    summary:
      "Kum 48-50 dana ṭam lo thlen dan, chitu buhfaifa pun vak, leh MNFF/MNF lo pian chhuah dan.",
    keyFigures: ["Laldenga", "Rev. Liangkhaia"],
    content: ARCHIVE_BUNG_3_CONTENT,
    customFocus: "Famines of Mizoram",
    updatedAt: Date.now(),
    ...makeInitialRevision(ARCHIVE_BUNG_3_CONTENT),
  },
  {
    id: 4,
    bungLabel: "Bung 4",
    title: "Lushai Hills British Hun — Sanad, Bawrhsap & Lalte Thuneihna",
    eraOrTheme: "1871–1947 Colonial Era",
    summary:
      "Expedition hnu lama lal rorel dan inthlak, circle administration, house tax leh Zofate harh chhuahna.",
    keyFigures: ["Capt. T.H. Lewin", "Lalnu Ropuiliani"],
    content: ARCHIVE_BUNG_4_CONTENT,
    customFocus: "Colonial Transition",
    updatedAt: Date.now(),
    ...makeInitialRevision(ARCHIVE_BUNG_4_CONTENT),
  },
];

export const ARCHIVAL_BOOK_PROJECT: BookProject = {
  id: "book-story-mizo-archives",
  title: "Zofate Chanchin & Archival Chronicles",
  subtitle:
    "Mizo Khawtlang Inrelbawlna, Sakhua, Mautam leh Sap Ram Luh Chhinchhiahna",
  mode: "single_story",
  topicFocus: "Archival History & Chronicles",
  chapters: ARCHIVAL_CHAPTERS,
  createdAt: Date.now(),
};

export const ALL_SEED_BOOKS: BookProject[] = [
  MASTER_BOOK_PROJECT,
  PASALTHA_BOOK_PROJECT,
  FOLKTALES_BOOK_PROJECT,
  ARCHIVAL_BOOK_PROJECT,
];

export function createSingleStoryBook(
  title: string,
  topicFocus: string,
  chapterCount: number
): BookProject {
  const clampedCount = Math.max(1, Math.min(30, chapterCount));
  const chapters: ChapterData[] = Array.from(
    { length: clampedCount },
    (_, idx) => {
      const num = idx + 1;
      const revId = `rev-1-${num}`;
      return {
        id: num,
        bungLabel: `Bung ${num}`,
        title:
          num === 1
            ? `${title} — Thuhmahruai leh Inṭanna`
            : `${title} — Chanchin Bung ${num}`,
        eraOrTheme: topicFocus || "Single-Story Deep-Dive",
        summary: `${title} thawnthu leh chanchin ril Bung ${num}: ${topicFocus}`,
        keyFigures: [title],
        content: "",
        customFocus: topicFocus,
        updatedAt: null,
        revisions: [
          {
            id: revId,
            label: "Rev 1",
            content: "",
            createdAt: Date.now(),
            note: "Initial draft",
          },
        ],
        activeRevisionId: revId,
      };
    }
  );

  return {
    id: `book-story-${Date.now()}`,
    title: title.trim(),
    subtitle: topicFocus.trim() || "Single-Story Deep-Dive Edition",
    mode: "single_story",
    topicFocus: topicFocus.trim(),
    chapters,
    createdAt: Date.now(),
  };
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export interface CanonicalTerm {
  name: string;
  category: GlossaryCategory;
  mizoDescription: string;
  aliases?: string[];
}

export const CANONICAL_MIZO_TERMS: CanonicalTerm[] = [
  {
    name: "Chhinlung",
    category: "place",
    mizoDescription:
      "Zofate thlahtute hmanlai hmun ropui, thawnthu leh chanchin hluiah lungpui hnuai aṭanga an chhuahna nia sawi.",
  },
  {
    name: "Khawpui",
    category: "place",
    mizoDescription:
      "Zofate pem kawnga khaw hmasaberte zinga mi, Chhinlung chhuahsan hnua an khawsakna hmun hlui.",
  },
  {
    name: "Tiau Lui",
    category: "place",
    mizoDescription:
      "Mizoram leh Chin Hills inkar lui pawimawh, Zofate'n Burma phai aṭanga tuna Mizoram an rawn luhna paltlang lui.",
  },
  {
    name: "Rih Dil",
    category: "place",
    mizoDescription:
      "Mizoram chhak lama awm dil thianghlim leh ropui; hmanlai Mizo sakhuaah mitthi thlaraute pialral kalkawnga paltlang ngei tur.",
  },
  {
    name: "Tan Tlang",
    category: "place",
    mizoDescription:
      "Lasi lalnu Chawngtinleri leh Lasi te chenna hmun thianghlim nia hriat tlang sang leh hmingthang.",
  },
  {
    name: "Selesih",
    category: "place",
    mizoDescription:
      "Lusei lal chi hrang hrang leh khaw pasarih insuihkhawmna hmunpui hlui, thawnthu leh chanchina hmingthang tak.",
  },
  {
    name: "Lalruanga",
    category: "warrior",
    mizoDescription:
      "Mizo thawnthua dawithiam ropui leh chak chungchuang, thlarau khawvel leh mihring khawvel thlunzawmtu.",
  },
  {
    name: "Keichala",
    category: "warrior",
    mizoDescription:
      "Mihring leh sakei nihna kawp (Keimi), sa pel thiam leh hlauhawm tak chanchin thawnthu.",
  },
  {
    name: "Chawngtinleri",
    category: "folklore",
    mizoDescription:
      "Lasi lalnu, ramngaw leh ramsa te enkawltu leh pasaltha a duhsakte hnenah vanneihna petu.",
  },
  {
    name: "Chhura",
    category: "folklore",
    mizoDescription:
      "Mizo thawnthu hlui-a mi hmingthang berte zinga mi; a chetdan nuihzatthlak tak chungin finna leh thilphak thuk tak lantirtu.",
  },
  {
    name: "Nahaia",
    category: "folklore",
    mizoDescription:
      "Chhura unaupa fing vervek leh thil chik mi, Mizo thawnthu hluiah Chhura nena inkawp tlat.",
  },
  {
    name: "Pi Hmuaki",
    category: "warrior",
    mizoDescription:
      "Mizo hla phuah thiam hmasaberte zinga mi, thlan chhung aṭang pawha hla la sa nia thawnthua sawi hmeichhe ropui.",
  },
  {
    name: "Darlalpuii",
    category: "warrior",
    mizoDescription:
      "Lal Sibuta'n a lungphun tana nunna a lak tak sal nula khawngaihthlak leh rinawm.",
  },
  {
    name: "Sibuta",
    category: "chief",
    mizoDescription:
      "Lal nunrawng leh khirh tak, Darlalpuii nunna laksaktu leh Sibuta Lung dintirtu.",
    aliases: ["Sibuta Lung"],
  },
  {
    name: "Tualvungi",
    category: "folklore",
    mizoDescription:
      "Zawlpala nupui rinawm leh hmangaihna thuk tak neitu; Zawlpala thih hnua a thlan chunga thi ve hmeichhe hmingthang.",
  },
  {
    name: "Zawlpala",
    category: "warrior",
    mizoDescription:
      "Tualvungi pasal, hmangaihna rinawm leh tuarchhelna entirna hmingthang.",
  },
  {
    name: "Lianchhiari",
    category: "folklore",
    mizoDescription:
      "Lal fanu hmeltha, a hmangaih Chawngfianga a ngaihna leh a lunglenna hmun 'Lianchhiari Lunglen Tlang' hming chawitu.",
  },
  {
    name: "Saikuti",
    category: "warrior",
    mizoDescription:
      "Chhim lam leh khawthlang lama zai leh hla phuah thiam hmingthang tak hmeichhia.",
  },
  {
    name: "Zahmuaka",
    category: "chief",
    mizoDescription:
      "Lusei lal hnam paruk (Zadeng, Palian, Thangluah, Rivung, Rokhum, Sailo) thlahtu bul leh pa.",
  },
  {
    name: "Lallula",
    category: "chief",
    mizoDescription:
      "Sailo lal ropui leh fing tak, Thlanrawn rawtna hmangin Sailo thuneihna tichaktu leh Zopui khaw dintirtu.",
  },
  {
    name: "Vanhnuailiana",
    category: "chief",
    mizoDescription:
      "Tiau lui thlang lam leh Champhai phaizawl thlenga Sailo lal chak leh ropui berte zinga mi.",
  },
  {
    name: "Vanapa",
    category: "warrior",
    mizoDescription:
      "Hming tak Thangzachhinga; Tlawmngaihna leh pasaltha nun mawi ber entirna, Vanhnuailiana pasaltha rinawm.",
  },
  {
    name: "Chawngbawla",
    category: "warrior",
    mizoDescription:
      "Vanhnuailiana pasaltha huaisen chungchuang, indona hmun apianga hmahruaitu.",
  },
  {
    name: "Taitesena",
    category: "warrior",
    mizoDescription:
      "Tlawmngaihna vawrtawp lantirtu pasaltha huaisen leh thian chhan thih ngam.",
  },
  {
    name: "Zampuimanga",
    category: "warrior",
    mizoDescription:
      "Sakei lian pui pui pawh kut lawnga bei ngam pasaltha chak leh hlauhawm hre lo.",
  },
  {
    name: "Bengkhuaia",
    category: "chief",
    mizoDescription:
      "Sailo lal huaisen, kum 1871-a Alexandrapur run leh Mary Winchester (Zoluti) mantu.",
  },
  {
    name: "Rothangpuia",
    category: "chief",
    mizoDescription:
      "Thangluah lal fing leh hmathlir nei thuk, British sorkar nena inremna siam hmasa leh chhim lam vengtu.",
  },
  {
    name: "Lal Ropuiliani",
    category: "chief",
    mizoDescription:
      "Hmeichhe lal huaisen leh ram chhantu ropui; British sorkar chhiah pek duh lova tang tlattu leh Chittagong tan ina thi.",
  },
  {
    name: "Khuangchera",
    category: "warrior",
    mizoDescription:
      "Pasaltha huaisen leh tlawmngai chungchuang, kum 1890-a Changsil vela British sipaite beihnaah ram tana nun hlantu.",
  },
  {
    name: "Zakapa",
    category: "chief",
    mizoDescription:
      "Lal huaisen leh helna kaihruaitu, Sap sipaite laka Zoram zalenna sualtu.",
  },
  {
    name: "Laldenga",
    category: "warrior",
    mizoDescription:
      "Mizo National Front (MNF) dintu leh kum 20 rambuai hruaitu, kum 1986 Remna Thuthlung ziaktu.",
  },
  {
    name: "Brig. T. Sailo",
    category: "warrior",
    mizoDescription:
      "Brigadier Thenphunga Sailo, People's Conference dintu, Human Rights humhalhtu leh Mizoram Chief Minister hlui.",
  },
];

export function extractCanonicalTermsFromChapters(
  chapters: ChapterData[]
): GlossaryEntry[] {
  const results: GlossaryEntry[] = [];
  for (const term of CANONICAL_MIZO_TERMS) {
    const needles = [term.name, ...(term.aliases ?? [])];
    const foundIn: number[] = [];
    for (const ch of chapters) {
      if (!ch.content.trim()) continue;
      const hay = ch.content.toLowerCase();
      if (needles.some((n) => hay.includes(n.toLowerCase()))) {
        foundIn.push(ch.id);
      }
    }
    if (foundIn.length > 0) {
      results.push({
        id: `canonical-${term.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        name: term.name,
        category: term.category,
        mizoDescription: term.mizoDescription,
        chapterNumbers: foundIn,
      });
    }
  }
  return results;
}
