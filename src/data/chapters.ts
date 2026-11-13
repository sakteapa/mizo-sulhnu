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

export const BUNG_1_CONTENT = `## Khawvel Thim Chhuahsan Dan leh Chhinlung Lungpui

Hmanlai piallei an chhuah hma, khawvel thim chhah mup hnuaia mihring leh saron an la awm khawm lai khan, Zofate thlahtu pipute chu leilung chhung ril, lungpui kawrawng zaupui maiah an lo cheng khawm ṭhin a. Chu hmun thuk leh serh tak chu kan pi leh pute chuan kâ-a inhlanchhawng zelin Chhinlung (Sinlung) tiin an vuah a ni. Khawvel eng hmu lova lungpui chhin hnuaia an awm lai chuan, mihringte chu sakei leh ramsa kawlh te nen leilung hnuaiah an khawsa ho va; mahse leilung a lo her a, chung Khuazingnu leh Lasi mite duhsakna a lo thlen meuh chuan, Zofate chuan he leilung chhin hi hawnga eng khawvel pan an lo tum ta a ni.

Lungpui chhin lianpui chu mi huaisente chuan an nawr hawng a, a hmasa berin hnam peng pengte chu an rawn chhuak ṭan a. Mahse, chhuah kawka ramsa kawlh pui mai a lo ṭhut tlat avangin, mi tam tak an lo chhuah hnuah hnung dawla lo chhuak turte chuan an ngam ta lo va, lungpui chhin chu khar lehin, mi tam tak chu leilung chhungah chuan an la cham hlen ta tiin upate chuan titi an lo vawng ṭhin. Chu Chhinlung chhuahsan hun lai chu Zofate hla phuah thiam hmasaten hetiang hian an lo sa ṭhin a ni:

> "Kan ni Chhinlung chhuak a ni,
> Kan chhuahna pialral tlang a ni;
> A thim e pialral tlang chu,
> Lungpui chhin kan hawng ta e."

![Chhinlung Lungpui aṭanga Zofate lo chhuah dan leh pialral tlangram pan zinkawng](/images/bung1_chhinlung_migration.jpg)

Chhinlung aṭanga lo chhuak hmasate chu hmar lam tlang kar leh Mekong lui dung, Yalung lui dung zuiin an lo tawlh thla zel a. Tlang chhengchhe tak tak, khawvawt vur vur leh chhum zing chiai karah chuan, an thul phur leh chemsei nen, an chenna tur phai zawl leh tlangram duhawm zawn beiseiin hmalam an pan zel a ni. Chu zinkawngah chuan hnam peng hrang hrang — Lusei, Hmar, Ralte, Lai, Mara, Paite leh Thadou te chu la inthen hrang lovin, thisen inzawm unau dik tak an nih zia hriain an kal ho dial dial ṭhin.

---

## Shan Ram, Kabaw Phai leh Khampat Bungpui Thutiam

Kum zabi tam a liam a, pipute chuan tlang sang pui pui an pelh hnuah, Shan ram (Shan State) leh Kabaw Valley (Kabaw Phai zawl nuam tak) an lo thleng ta hlawl mai a. Helai hmun hi Chindwin lui kam, thlai chite an chin theihna leh ramsa an kah theihna hmun remchang em em a nih avangin, Zofate chuan khawpui lian tak Khawpui (Khampat) an din ta a ni. Kabaw phai zawla an chen lai hi Mizo hnam history-a hun reilote chhung lungmuanga an awm theih hun laite a ni hial awm e.

Mahse, Shan lalte leh Burmese lalte thiltihtheihna a lo lian chho va, ralthuam thir ṭha zawk leh sakawr sipai rual neitu Shan mite chuan Zofate chu an rawn nawr chep ta tlat mai a. Hmanlai upate titi chuan, Shan lalte chuan Zofate chu chhiah rit tak tak chawi tirin, tui hna vawn leh tlang dung ram hauh chungchangah innghirnghona lian tak a lo chhuak ta a ni. Chutah meuh chuan Zofate hruaitu, bawlpu, leh upa fing rualte chu an inrawn khawm ta a: "He phai zawla kan awm reng chuan kan hnam hian mahni rorelna kan chan zo vang a, hnam dang sal kan ni mai dawn e. Tlangram lam panin mahni zalenna leh lalte dinhmun humhalh zawk ang u," an ti ta a ni.

Khampat khawpui an chhuahsan hma chiah hian, an kal hrang tur chu inngai em em in, hnam pumkhat an nih zia chhinchhiah nan leh nakina an la inhmuh khawm leh ngei theih nan thutiam ropui tak an siam ta a. Chu chu hnam zinkawnga thil ropui leh chhinchhiah hlawh ber pakhat Khampat Bungpui phun a nih dan chu a ni.

![Khampat Bungpui hnuaia Zofate thutiam ropui leh hnam inṭhen hmaa inngaih taka an intiamna](/images/bung1_khampat_bungpui.jpg)

Khampat khaw piah, Khampat lui kamah chuan Bung zung ṭha mi an phun a, chumi bulah chuan bawlpu chuan ui pa leh vawk pa thau takin a inthawi a. Lalte, pasalthate, leh nula-tlangval te chuan chu Bung thing ding lai chu an hual a, upa ber chuan hetiang hian kut pharin phuisam a chham a:

> "Khuavang leh Lasi te u, kan hnam unau te hi tunah chuan ram hrang leh tlang hrangah kal darh dawn mah ila, he Bungpui hian kan thutiam chu a hriatpui e. He Bungpui zar a lo chhuah a, a zung a lo zik a, a zungte chuan lei an tawng leh a nih chuan, kan thlah kal zelte hian he kan pipute ram leh Khampat khawpui hi an la rawn luah leh ngei tur a ni!"

Chu thu tiam ropui chu vawiin thlengin Zofate rilruah a la thi lova, Burma leh India inrina rala awm Khampat Bungpui chu hnam lungrualna leh tobul chhinchhiahna ropui ber a la ni reng a ni.

---

## Tiau Lui Kânna leh Chin Hills Tlangrama Inzarpharh Dan

Kabaw phai zawl an chhuahsan hnu chuan, Zofate chu hmarthlang lam hawi zawngin Chin Hills (Lentlang, Run lui kam, Seipui leh Lailun) tlang sang pui pui panin an chho ta zel a. Chin Hills tlangramah hian kum tam tak an khawsa leh a, heta ṭang hian hnam peng hrang hrangte zia leh khawsak phung a lo inthliar hrang ṭan ta a ni.

Chutah khawthlang lam tlang dung, vawiina Mizoram kan tih meuh mai tlang mawi tak takte chu ral aṭangin an lo thlir a. Mahse, chu ram thar thleng tur chuan lui lian leh hlauhawm tak, Tiau Lui (Tiau River) kân a ngai ta a ni. Tiau lui hi luipui mai ni lovin, Zofate rilruah chuan ram hlui leh ram thar inrina, pipute sulhnu kalsana hnam pumhlum tlangram bika lalram din ṭanna kawngkapui a ni.

![Tiau Lui fep taka kâna tlangram thar pana Zofate pem darh lai](/images/bung1_tiau_crossing.jpg)

Tiau lui an kân lai hian ruah a sur nasa hle a, tui lian fawn hlup hlup karah chuan, pasalthate chuan hrui zam hlawmin, nute chuan an naute puan zai-a an awm zawna puak chungin, darkhuang leh fei kengin an kân kai zel a. Tiau rala an kân kim hnu chuan, hnam tinte chu mahni thlahtu leh lalte ho zelin tlang dung hrang hrangah an insem darh ta a ni:

- **Lusei Hnam Pengte**: Zahmuaka leh a thlahte kaihhruaina hnuaiah Selesih, Champhai leh Khawbung tlang dung zawhin an pem lut a. Heng aṭang hian Lusei lal hnam paruk (Zadeng, Palian, Thangluah, Rivung, Rokhum, leh Sailo) an lo intuaithar chho ta a ni.
- **Ralte Hnam**: Pasaltha huaisen, thawm ri bung bung leh tlawmngaihna hria, hnam lian leh nghet tak an ni a. Khelte, Siakeng, Kawlni leh Lelhchhun tiin peng li-ah an insem a; Lusei lalte rualin tlang dung an chelh a, khaw venghimtu ber an ni ṭhin.
- **Hmar Hnam**: Hmar lam tlang dung leh Manipur/Cachar inrina tlangram zawng zawng luahin, an kutchhuak puanthiamna leh indona thiamna vawng nung tlattu an ni.
- **Lai (Pawi) Hnam**: Chhim lam tlang sang tak tak leh Chin Hills inrina tlang ram ngawpui zawng zawng awptu, ralthuam hum thiam leh lal ropui (Hengmanga, Sangchema) thlahte an ni.
- **Mara (Lakher) Hnam**: Chhim tawp, Kolodyne (Chhimtuipui) dung leh Saiha chhehvel tlangram zalen taka awptu, rorelna nghet tak neitu an ni.
- **Paite, Thadou-Kuki, Vaiphei, Gangte leh peng dangte**: Tlang dung leh hmun zawl remchang zawng zawngah inzar pharhin, an hla leh tawngkam vawng nung zeltu an ni.

---

## Selesih Khawpui: Zofate Ropui Vawrvawmna Bul

Zofate pem luh zelnaah chuan khaw hrang hrang indin mah se, an ropuina vawrvawmna leh Lusei lal zinga Sailo thlahte tana lungphum pawimawh ber chu Selesih Khawpui a ni. 

Selesih khawpui hi in 7,000 zet khua a ni a tiin hmanlai upate chuan an sawi ṭhin. He khawpui ropui takah hian Zawlbuk mai pawh hmun hrang hrangah a awm a, khua a len em avangin khaw pakhat chhungah meuh pawh ar khuan inzah theih loh hial khawpa zau a ni an ti ṭhin. Lal Zahmuaka thlah, lal huaisen Lallula rorel lai hian Selesih chu tlangram hnam dangte tana hriat hlawh ber leh tlangvalho zawlbuk riahna, pasaltha hmingthangte intawhkhawmna hmunpui a lo ni ta a ni.

Selesih khawpuiah hian Duhlian tawng (Lusei tawng) chu hnam hrang hrang — Ralte, Hmar, Khiangte, Pachuau, Chawngthu, Chhakchhuak leh mi dang zawng zawng inbiakpawhna ṭawng berah a lo chang chho va; vawiina Mizo hnam tawng kan neih tak ropui tak hi Selesih zawlbuk meipui bul aṭanga lo ṭhanglian a ni.

---

### Thlirzauna: Hnam Zinkawng, Inpumkhatna leh Tlawmngaihna Tobul

Chhinlung aṭanga vawiina kan awmna tlangram thlenga Zofate zinkawng hian hnam pumhlum tan zirtir thuk tak a nei a ni:

1. **Tibeto-Burman To-bul leh History Chhinchhiahna**:
   Anthropologist leh historian-te zir chianna chuan Zofate hi Sino-Tibetan ṭawng phung hmangtu, Tibeto-Burman hnam thlah zinga mi kan nih zia a nemnghet a. Mekong lui dung leh Chindwin lui dung zui a pem thla kan nih zia hi tunlai DNA leh ṭawng thumal zir chianna (linguistics) pawhin a fiah thlap a ni.

2. **Khampat Bungpui Symbolism**:
   Khampat Bungpui hi thing zung phun mai a ni lo va; Zofate'n hnam dang laka mahni zalenna humhalh an duh zia leh, engtik niah emaw kan thlahte chu la inluahkhawm leh ngei ang tih an rinna ril zia entirtu a ni. Vawiin thlengin he thutiam hian hnam thinlung a la thlung khawm reng a ni.

3. **Tlawmngaihna Pian Chhuah Dan**:
   Zofate hi phai zawl nuam tak aṭanga tlang chhengchhe taka um zuih kan nih avangin, tlangrama nun khawchhuak tur chuan mahni hmasial a theih tawh loh va. Harsatna, ramsa kawlh, indo leh ṭam laka him tur chuan "Mi dang tana inpekna" leh "Midangte aia mahni inngaihtlawmna" a ngai ta a; chu nun chu vawiin thlenga kan hnam rochun ropui ber **TLAWMNGAIHNA** lo piana leh lo ṭhanlenna chhan ber a ni.`;

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
    content: "",
    customFocus: "",
    updatedAt: null,
    ...makeInitialRevision(""),
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
    content: "",
    customFocus: "",
    updatedAt: null,
    ...makeInitialRevision(""),
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
    content: "",
    customFocus: "",
    updatedAt: null,
    ...makeInitialRevision(""),
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
    content: "",
    customFocus: "",
    updatedAt: null,
    ...makeInitialRevision(""),
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
    content: "",
    customFocus: "",
    updatedAt: null,
    ...makeInitialRevision(""),
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
    content: "",
    customFocus: "",
    updatedAt: null,
    ...makeInitialRevision(""),
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
    content: "",
    customFocus: "",
    updatedAt: null,
    ...makeInitialRevision(""),
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
    content: "",
    customFocus: "",
    updatedAt: null,
    ...makeInitialRevision(""),
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
    content: "",
    customFocus: "",
    updatedAt: null,
    ...makeInitialRevision(""),
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
