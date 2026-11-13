import type { LoreEntity } from "../types/book";

export const MIZO_MYTHOLOGY_LORE_DATABASE: LoreEntity[] = [
  // =========================================================================
  // 1. VANCHUNG & HIGH CELESTIAL REALM
  // =========================================================================
  {
    id: "lore-pu-vana",
    title: "Pu Vana",
    aliases: ["Chung Pathian", "Van Roreltu"],
    realm: "vanchung",
    rarity: "Legendary",
    tagline: "Vana cheng engkim siamtu leh ruah leh khawpui ri thununtu Pathian ropui.",
    iconName: "Sun",
    powers: [
      "Vana rorelna leh khawdur thunun",
      "Mihringte tawngtai leh phuisam hriat",
      "Ruah tui leh leilung malsawmna pek",
      "Sual hremna leh khawpui ri hmanga vau",
    ],
    weaknessOrTaboo: "Bawlhhlawh leh inngaihtlawm lohna, serh bawhchhiat.",
    lore:
      "Zofate hian Chanchin Ṭha an hriat hma daih tawh khan vana cheng Pathian ropui ber 'Pu Vana' an lo be tawh ṭhin a. Khawpui ri leh ṭhante chu a aw leh a thinurnaah an ngai a, ruah tui a lo tlak chuan a malsawmnaah an ngai ṭhin. Sadawt leh Bawlpu-te'n inthawina serh an neih hian Pu Vana hnenah phuisam an chham hmasa ziah ṭhin a ni.",
    connectedEntityIds: [
      "lore-khuanu",
      "lore-khuavang",
      "lore-chham-phuisam",
      "lore-pialral",
      "lore-arsi-chanchin",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 2, label: "Bung 2: Hmanlai Sakhuana" },
      { bookId: "book-archival-records", chapterId: 2, label: "Bung 2: Hmanlai Sakhua & Bawlpu" },
    ],
    secretClue:
      "Pu Vana hian ruah a sur tir hma hian vana khawpui ri a ri tir hmasa a, chu chu Sadawt-te'n phuisam chham nan an hmang ṭhin.",
    riddleOrHlado: "> [!HLADO]\n> Vana Pu Vana rorel chu leilung hian a hriatpui e,\n> Ruah tui min pe la, thlai thar seng tir ang che.",
  },
  {
    id: "lore-khuanu",
    title: "Khuanu / Khuazingnu",
    aliases: ["Leilung Nu", "Khuazing Nu", "Malsawm Tu"],
    realm: "vanchung",
    rarity: "Legendary",
    tagline: "Mihringte duhsaktu, naupiang hualhimtu leh thlai thar seng tirtu Nu ropui.",
    iconName: "HeartHandshake",
    powers: [
      "Naupang leh hmeichhe hualhim",
      "Buh thlai thar tir leh eitur vur",
      "Thinlung damna leh ngilneihna pek",
      "Pialral pana thlarau duhsak",
    ],
    weaknessOrTaboo: "Fahrah leh hmeithai tihduhdah, inthlahdahna.",
    lore:
      "Pipute chuan Khuanu (Khuazingnu) hi mihringte chunga lainatna ngah em em, nuin a fate a duat ang maia min enkawltu niin an sawi ṭhin. 'Khuanu zarah dam takin kan awm e' tih thumal pawh hi aṭanga lo chhuak a ni a. Hmeichhiate'n nau an neih dawnin Khuanu duhsakna an ngen ṭhin a ni.",
    connectedEntityIds: [
      "lore-pu-vana",
      "lore-khuavang",
      "lore-lasi-chawngtinleri",
      "lore-mauruangi",
      "lore-thlanrawkpa",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 2, label: "Bung 2: Sakhaw Hlui leh Thlarau" },
      { bookId: "book-folktales-collection", chapterId: 2, label: "Bung 2: Mauruangi & Vamur" },
    ],
    secretClue:
      "Fahrah Mauruangi pawh khan Khuanu venhimna a dawn avangin nu hrawn sual tak lakah pawh van aṭanga malsawmna a dawng reng a ni.",
    riddleOrHlado: "> [!TALE]\n> Khuanu duhsakna chu lui tui luang ang a ni,\n> Rethei leh fahrah hnenah a thleng hmasa ṭhin.",
  },
  {
    id: "lore-khuavang",
    title: "Chung Khuavang",
    aliases: ["Khuavang Rual", "Van Thlarau Lian"],
    realm: "vanchung",
    rarity: "Mythic",
    tagline: "Leilung leh van inkara thlarau thiltihthei tak, lasi leh mihring roreltu.",
    iconName: "Sparkles",
    powers: [
      "Lasi mite chungah thu neihna",
      "Thlarau biakpawhna (Khuavang zawl)",
      "Khaw awmdan leh chhum thunun",
      "Dawi leh finna thuk tak pek",
    ],
    weaknessOrTaboo: "Sadawt inthawina thianghlim, kel pa lu leh vawk pa thau.",
    lore:
      "Khuavang hi van thlarau pawimawh tawpkhawk a ni a, Lasi mite aia chungnung zawk niin an sawi ṭhin. Mi ṭhenkhat chu 'Khuavang zawl' an ti a, hringnun piah lam thil hmu thei leh zualko hria an ni ṭhin. Pipute chuan khua an luh thar emaw ram an vah hian Khuavang thlarau an be ṭhin a ni.",
    connectedEntityIds: [
      "lore-pu-vana",
      "lore-lasi-chawngtinleri",
      "lore-chham-phuisam",
      "lore-dawithiam-lalruanga",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 2, label: "Bung 2: Bawlpu & Khuavang" },
      { bookId: "book-archival-records", chapterId: 2, label: "Bung 2: Hmanlai Sakhua" },
    ],
    secretClue:
      "Khuavang hian Lasi Lalnu Chawngtinleri hnenah ramsa enkawl mawhphurhna a pe a, Tan Tlang chhipah serh leh sang an siam dun ṭhin.",
    riddleOrHlado: "> [!HLADO]\n> Chung Khuavang van a mi, kan zawn damlo hi lo thlir la;\n> Vawk thau kan rawh e, aikal kan la e.",
  },
  {
    id: "lore-vanchung-nula-tlangval",
    title: "Vanchung Nula leh Tlangval",
    aliases: ["Van Mite", "Van Lawn Nula"],
    realm: "vanchung",
    rarity: "Mythic",
    tagline: "Vana cheng eng mawi tak, leilunga lo chhuk a dawi them kalsantu thianghlimte.",
    iconName: "Flame",
    powers: [
      "Vana lawn leh thlawh theihna",
      "Eng mawi tak chhuah leh rimtui",
      "Thilmak thlentu dawi them pek",
      "Mihring thinlung thunun theihna",
    ],
    weaknessOrTaboo: "Leilung bawlhhlawh, dawtsawi, hmawng lera hmanrua zeh.",
    lore:
      "Mizo thawnthuahte hian Vanchung Nula leh Tlangval chanchin hi a tam em em a. Vana cheng mah ni se, leilung duhawm an rawn tlawh ṭhin a. Chepahakhata thawnthu-ah phei chuan Vanchung Nula chu Changêl hmunah a lo chhuk a, Chepahakhata nupuiah tangin, a hnuah vana an lawn leh dan zozai chu titi ropui a ni.",
    connectedEntityIds: [
      "lore-chepahakhata",
      "lore-arsi-chanchin",
      "lore-pu-vana",
      "lore-dawi-bu-relics",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 3, label: "Bung 3: Kâ-a Inhlanchhawn Thawnthu" },
      { bookId: "book-folktales-collection", chapterId: 4, label: "Bung 4: Chepahakhata & Belte-phai-thei-lo" },
    ],
    secretClue:
      "Vanchung nula thawmhnaw hi hmawng lera zeh a nih chuan vana a thlawh chhoh theihna a bo thin a, leiah a tang hlen ṭhin.",
  },
  {
    id: "lore-arsi-chanchin",
    title: "Arsi Chanchin (Astronomy & Constellations)",
    aliases: ["Chawngmawii leh Hrangchhuana", "Siruk", "Arsi Buhsiep", "Zawnte"],
    realm: "vanchung",
    rarity: "Legendary",
    tagline: "Zofate van arsi thlir dan leh inhmangaihna avanga thla leh arsi a chang ta te.",
    iconName: "Compass",
    powers: [
      "Zan khawthim a kawng kawhhmuh",
      "Thlasik leh buh seng hun hriattir",
      "Inhmangaihna chatuan chhinchhiahna",
    ],
    weaknessOrTaboo: "Khawvar hma lohva liam theih lohna.",
    lore:
      "Pipute chuan van arsite hi hming leh thawnthu an lo pe vek ṭhin a:\n1. **Chawngmawii & Hrangchhuana**: Nula leh tlangval inhmangaih em em, an inkar an phal loh vanga vana thlawk chhoa Thla leh Arsi lo ni ta te.\n2. **Siruk (Pleiades)**: Arsi 6 inrem, thlasik lo thleng tur chhinchhiahtu.\n3. **Arsi Buhsiep (Orion's Belt)**: Buh siep ang maia tlar dal mai arsite.\n4. **Zawnte (Big Dipper)**: Hmar lam kawng kawhhmuhtu arsi rual.",
    connectedEntityIds: [
      "lore-vanchung-nula-tlangval",
      "lore-pu-vana",
      "lore-lasi-chawngtinleri",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 2, label: "Bung 2: Thlarau Khawvel" },
      { bookId: "book-folktales-collection", chapterId: 7, label: "Bung 7: Pipute Lunglen Thawnthu" },
    ],
    secretClue:
      "Siruk arsi a lo lan meuh chuan Zofate chuan favang buh seng a hun ta tih an hre ṭhin a ni.",
  },

  // =========================================================================
  // 2. LASI & NATURE SPIRITS REALM
  // =========================================================================
  {
    id: "lore-lasi-chawngtinleri",
    title: "Lasi Lalnu Chawngtinleri",
    aliases: ["Tan Tlang Lasi", "Sa Tinreng Vulhtu"],
    realm: "lasi_nature",
    rarity: "Legendary",
    tagline: "Tan Tlang chhipa cheng, ramsa zawng zawng thununtu leh pasaltha tlawmngaite sa pe tu.",
    iconName: "Sparkles",
    powers: [
      "Ramsa tinreng (sakhi, saza, sele) thunun",
      "Pasaltha tlawmngai sa tlan tir (Lasi zawl)",
      "Chapo leh mi hamsia hremna (Silai perh)",
      "Tlang chhip chhum leh rimtui zam tir",
    ],
    weaknessOrTaboo: "Chapo taka inngaihsak, ramsa sawisak, tlawmngaihna bawhchhiat.",
    lore:
      "Tan Tlang chhip chhengchhe takah Chawngtinleri hian a khua a din a. Ramsa zawng zawng hi a vawk leh ar ang maiin a vulh a. Pasaltha rilru thianghlim, hmeithai tana sa that duh te chauh ramsa a thlah ṭhin a. Pasaltha Khuangchera, Neuva, leh Manga te pawh kha Chawngtinleri duhsakna dawng nia an sawi an ni.",
    connectedEntityIds: [
      "lore-tan-tlang",
      "lore-dawithiam-lalruanga",
      "lore-keimi",
      "lore-khuavang",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 2, label: "Bung 2: Lasi Khawvel & Tan Tlang" },
      { bookId: "book-pasaltha-collection", chapterId: 4, label: "Bung 4: Pasaltha Neuva" },
    ],
    secretClue:
      "Chawngtinleri hian pasaltha a duhsak chuan ramchhuah zanah a mumangah a rawn inlar ṭhin a, 'Naktukah ka vawk thau ka thlah dawn e' a ti ṭhin.",
    riddleOrHlado: "> [!HLADO]\n> Tan Tlang chhipa Chawngtinler,\n> Saza rual leh sakhi min thlah rawh;\n> Tlawmngaihna chem chawi tlangval ka ni.",
  },
  {
    id: "lore-tan-tlang",
    title: "Tan Tlang",
    aliases: ["Lasi Tlang Serh", "Champhai Tlang"],
    realm: "lasi_nature",
    rarity: "Mythic",
    tagline: "Champhai daifema ding lurh mai, Lasi mite khawpui leh thlarau tlang serh.",
    iconName: "Mountain",
    powers: [
      "Chhum chhah mup hnuaia thuruk vawn",
      "Lasi dawi khawvel kawngkhar",
      "Ramsa kawlh venhimna",
    ],
    weaknessOrTaboo: "Meipui chheh, sa thah sual, bawlhhlawh paih.",
    lore:
      "Tan Tlang hi Mizoram tlang hmingthang ber zinga mi a ni a. Tlang chhip chhengchhe tak leh puk thuk tak tak awmah hian Lasi mite'n an khawpui an rem a. Pipute'n 'Tan Tlang Lasi' an tih chu an zah em em a, tlangvalte chuan zahder takin an thlir ṭhin a ni.",
    connectedEntityIds: [
      "lore-lasi-chawngtinleri",
      "lore-dawithiam-lalruanga",
      "lore-rih-dil",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 2, label: "Bung 2: Tan Tlang & Rih Dil" },
    ],
    secretClue:
      "Tan Tlang chhip aṭang hian khua a thianghlim chang chuan Rih Dil thlengin a thlir theih an ti ṭhin.",
  },
  {
    id: "lore-sih-huai",
    title: "Sih Huai",
    aliases: ["Chhimhruk Sih Huai", "Tui Hna Ramhuai"],
    realm: "lasi_nature",
    rarity: "Ancient",
    tagline: "Ramsate tui inna Sih leh Chhimhruk vawngtu ramhuai kawlh tak mai.",
    iconName: "Droplet",
    powers: [
      "Sih tui thunun leh natna thehdarh",
      "Tlangval leh sa petute hmuhsitna hrem",
      "Tui hna ti kang thei",
    ],
    weaknessOrTaboo: "Daibawl inthawina, Bawlpu phuisam, Arpa hring talh.",
    lore:
      "Ramsate'n chi an fiahna leh tui an inna 'Sih' (Salt lick / Marsh) bul velah hian ramhuai hlauhawm Sih Huai a cheng ṭhin a. Sa chang tura sih bula lo awm tlangvalte hian serh leh sang an bawhchhiat chuan khawsikpui leh natna rapthlak tak an kai phah ṭhin a ni.",
    connectedEntityIds: [
      "lore-ramhuai-ngawpui",
      "lore-chham-phuisam",
      "lore-lasi-chawngtinleri",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 2, label: "Bung 2: Sadawt & Bawlpu" },
      { bookId: "book-archival-records", chapterId: 2, label: "Bung 2: Hmanlai Sakhua" },
    ],
    secretClue:
      "Sih bulah sa an chan dawnin pasalthate chuan mau phel hmangin lei an vaw ṭhin a, chumi chuan Sih Huai mutthilh a tiharh lo an ti ṭhin.",
  },
  {
    id: "lore-ramhuai-ngawpui",
    title: "Ngawpui Ramhuai & Ṭhuami",
    aliases: ["Thingbul Ramhuai", "Ngaw Huai", "Ṭhuami"],
    realm: "lasi_nature",
    rarity: "Ancient",
    tagline: "Zoram ngawpui thim laia cheng, mi kal sual ti bo thin thlarau sualte.",
    iconName: "Trees",
    powers: [
      "Ram ngawah mihring tihbo (Ram ngaw kual)",
      "Thawm rapthlak chhuah",
      "Khawhring leh phung puihna",
    ],
    weaknessOrTaboo: "Meichher eng, chemsei, pasaltha hlado chham.",
    lore:
      "Ngawpui chhah mup karah hian thingbuk lian pui pui leh lungpui puka awm ramhuai an tam em em a. Mi an kal sual chuan ramhuai hian a hruai kual a, khaw hmu thei lovin an siam ṭhin a ni. 'Ṭhuami' phei chu ramhuai nula niin tlangvalte a hruai bo fo ṭhin an ti.",
    connectedEntityIds: [
      "lore-sih-huai",
      "lore-phungpuinu",
      "lore-chham-phuisam",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 2, label: "Bung 2: Thlarau Sualte" },
    ],
    secretClue:
      "Ramvah laia i bo palh chuan i kawr phelhin letling zawngin ha rawh, ramhuai dawi a phelh phah ang an ti ṭhin.",
  },

  // =========================================================================
  // 3. BEASTS, MONSTERS & WERE-TIGERS REALM
  // =========================================================================
  {
    id: "lore-keimi",
    title: "Keimi (Sakei-Mihring / Were-Tiger)",
    aliases: ["Keichala Thlah", "Puk Chhung Keimi", "Sakeia Chang Thei"],
    realm: "monsters_spirits",
    rarity: "Mythic",
    tagline: "Mihring ni chunga sakeia inthlak thei, ramsa kawlh leh mihring finna kawptu.",
    iconName: "ShieldAlert",
    powers: [
      "Sakei vuna inthlak (shapeshifting)",
      "Mihring finna leh sakei chakna kawp",
      "Zan thimah sa veh thiam",
      "Puk thuka mihring ruk bo",
    ],
    weaknessOrTaboo: "Meipui, chemsei, thir silai, sakei vun tihchhiatsak.",
    lore:
      "Keimi hi Mizo thawnthu rapthlak ber zinga mi a ni. Mihring taksa nei chunga sakei vun bih a sakeia chang thei an ni a. Kungawrhi puk keimite leh Keichala chanchin hi Zofate kâ-a inhlanchhawn thawnthu hlun ber a ni. Vankal pasalthate chuan he Keimi puk hi meipui hmangin an lo bei tawh a ni.",
    connectedEntityIds: [
      "lore-keichala",
      "lore-kungawrhi",
      "lore-dawithiam-lalruanga",
      "lore-rulpui-lian",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 2, label: "Bung 2: Lalruanga & Keichala" },
      { bookId: "book-master-zofate-sulhnu", chapterId: 3, label: "Bung 3: Kungawrhi & Keimi" },
      { bookId: "book-folktales-collection", chapterId: 6, label: "Bung 6: Kungawrhi leh Keimi" },
    ],
    secretClue:
      "Keimi hian an sakei vun hi thing kawrawngah emaw leiah an thup ṭhin a, chu vun chu i hal sak chuan an sakei thei tawh ngai lo.",
    riddleOrHlado: "> [!TALE]\n> Sakei vun bih chuan mihring thinlung a thunun a,\n> Tlangval huaisen chu puk thimah a chang ta a ni.",
  },
  {
    id: "lore-keichala",
    title: "Keichala",
    aliases: ["Lalruanga Ṭhianpa", "Keimi Pasaltha"],
    realm: "monsters_spirits",
    rarity: "Legendary",
    tagline: "Lalruanga ṭhian inkawmngeih, sakei rilru avanga a ṭhianpa meuh pawh beitu.",
    iconName: "Skull",
    powers: [
      "Sakei lianpui leh kawlh takah inthlak",
      "Lalruanga dawi do let theihna",
      "Sa kah thiam tawpkhawk",
    ],
    weaknessOrTaboo: "A riltam laia a rilru sual lanchhuah, Lalruanga dawi meipui.",
    lore:
      "Keichala hi Lalruanga nen ṭhianṭha tak an ni ṭhin a. Ramchhuah dunin sa tam tak an that dun ṭhin. Mahse Keichala chu a riltam tawh chuan sakei rilru sual a lo tho va, mihring sa a chak ta ṭhin a ni. A tawpah Lalruanga chuan a dawi them hmangin Keichala chu a man chhuak a, tualchhung pasalthate'n an that ta a ni.",
    connectedEntityIds: [
      "lore-keimi",
      "lore-dawithiam-lalruanga",
      "lore-lasi-chawngtinleri",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 2, label: "Bung 2: Lalruanga & Keichala" },
    ],
    secretClue:
      "Keichala sakei zia hi Lalruanga'n a hriatchhuah theih nan a dawi bu-a dawi phek hmasa ber a chhiar a ngai a ni.",
  },
  {
    id: "lore-phungpuinu",
    title: "Phung & Phungpuinu",
    aliases: ["Phungchawm", "Zan Delhtu"],
    realm: "monsters_spirits",
    rarity: "Folk",
    tagline: "Mutthilh laia mi delh rit em em tu, Chhura'n a zang a pawhsak tak hmelchhe pui mai.",
    iconName: "Ghost",
    powers: [
      "Mutthilh laia mihring delh hlum ṭep",
      "Mi thluak tihbual leh zang sei",
      "Thim hnuaia inlar thut",
    ],
    weaknessOrTaboo: "Fiamthu hriat, chemsei tat, Chhura finna, meipui alh.",
    lore:
      "Phungpuinu hi Mizo thawnthua hmelchhe ber leh nuihzatthlak ber zinga mi a ni. A zang a sei em em a, tlangvalte mutthilh laiin a delh ṭhin a. Ni khat chu Chhura chuan a zang chu chem hriam tak hmangin a lo pawh chhawk sak a, Phungpuinu chu te chungin a tlan bo ta a ni.",
    connectedEntityIds: [
      "lore-chhura",
      "lore-nahaia",
      "lore-ramhuai-ngawpui",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 3, label: "Bung 3: Chhura & Nahaia" },
      { bookId: "book-folktales-collection", chapterId: 1, label: "Bung 1: Chhura leh Nahaia" },
    ],
    secretClue:
      "Phung delh i tawh chuan i kut zungte chet la, zawi tein harh tum rawh, phungpuinu dawi a tlawm nghal ang.",
  },
  {
    id: "lore-khawhring",
    title: "Khawhring",
    aliases: ["Aikal", "Khawhring Hmeichhia"],
    realm: "monsters_spirits",
    rarity: "Ancient",
    tagline: "Mi dang taksaa lut a kâ-a ṭawng chhuak, sa leh buh heh em em thlarau sual.",
    iconName: "Eye",
    powers: [
      "Mihring taksa chhung luhchilha ṭawng tir",
      "Mi hrisel lai ti damlo",
      "Khawtlang inlungrualna tihchhiat",
    ],
    weaknessOrTaboo: "Bawlpu aikal lak, Theihai hnah, Zungbuh inthawi, zilh hau.",
    lore:
      "Khawhring hi hmanlai Mizo khawtlangin an hlauh em em pakhat a ni a. Hmeichhe ṭhenkhat chhungte zinga inthlahchhawn niin an ngai ṭhin. Mi a luhchilh meuh chuan chu damlo chuan a hma a mi chu a hming lamin a duh zawng (sa emaw zu) a dil ṭhin a, Bawlpu phuisam hmangin an umchhuak ṭhin a ni.",
    connectedEntityIds: [
      "lore-chham-phuisam",
      "lore-sih-huai",
      "lore-ramhuai-ngawpui",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 2, label: "Bung 2: Bawlpu & Sakhua" },
      { bookId: "book-archival-records", chapterId: 2, label: "Bung 2: Hmanlai Sakhua" },
    ],
    secretClue:
      "Bawlpu chuan theihai hnah ro leh ar hring kengin damlo chhipah a dah a, Khawhring chu tlan bo turin a hrilh ṭhin.",
  },
  {
    id: "lore-rulpui-lian",
    title: "Rulpui Lian",
    aliases: ["Puk Chhung Rulpui", "Chawngchilhi Pasaltha Rul"],
    realm: "monsters_spirits",
    rarity: "Mythic",
    tagline: "Puk thuk taka cheng, mihring lem vek thei rulpui hlauhawm leh kawlh.",
    iconName: "CircleDot",
    powers: [
      "Mihring leh sa pum hmawm",
      "Tur hlauhawm leh thli tleh tir",
      "Puk kawngkhar chhir khar",
    ],
    weaknessOrTaboo: "Meipui alh, Tlumtea chemsei, lu zai chhawk.",
    lore:
      "Rulpui lian hi Tlumtea thawnthu leh Chawngchilhi thawnthua thil rapthlak ber a ni. Tlumtea chuan a chemsei kengin rulpui kawrawng chhungah a lut a, a thinlung a zai sak ta a ni. Chawngchilhi pawh khan rulpui nupuiah neiin chhungkua an lo inbei phah hial a ni.",
    connectedEntityIds: [
      "lore-tlumtea",
      "lore-chawngchilhi",
      "lore-chemtatrawta",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 3, label: "Bung 3: Tlumtea & Rulpui" },
      { bookId: "book-folktales-collection", chapterId: 7, label: "Bung 7: Chawngchilhi & Rulpui" },
    ],
    secretClue:
      "Rulpui lian hi pawn lam aṭanga vih chuan a vun a sak lutuk a, a ka chhung aṭanga beih chauh a hlawhtling ṭhin.",
  },

  // =========================================================================
  // 4. DAWI, SORCERY & RELICS REALM
  // =========================================================================
  {
    id: "lore-dawithiam-lalruanga",
    title: "Dawithiam Ropui Lalruanga",
    aliases: ["Luangpawl Dawithiam", "Dawi Phek Neitu"],
    realm: "dawi_magic",
    rarity: "Legendary",
    tagline: "Zofate dawi thiam ropui ber, thingzar thunun a tui fawn tiding theitu.",
    iconName: "Wand2",
    powers: [
      "Dawi lehkha bu (dawi phek) chhiar",
      "Thingzar leh thingkung thunun",
      "Tui fawn leh luipui tiding",
      "Ramsa leh Lasi biakpawh",
    ],
    weaknessOrTaboo: "A dawi bu midangte'n an hriat, leiah dawi bu phum.",
    lore:
      "Lalruanga hi Luangpawl khuaa mi niin, Mizo dawi thiam ropui ber a ni. Lasi mite hnen aṭangin dawi them a zir a, khawvel dawi thiam berah a chhuak a. Mahse a thih dawnah a dawi bu chu midangte'n an chhuhsak hlauvin leiah a phum a, chu chuan amah ngei a la ei zo ta a ni an ti ṭhin.",
    connectedEntityIds: [
      "lore-keichala",
      "lore-lasi-chawngtinleri",
      "lore-dawi-bu-relics",
      "lore-tan-tlang",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 2, label: "Bung 2: Lalruanga Dawi" },
    ],
    secretClue:
      "Lalruanga Tuibur leh Lalruanga Dawi Lung hi vawiin thlengin Mizoram hmun ṭhenkhatah hmuh tur a la awm an ti.",
  },
  {
    id: "lore-dawi-bu-relics",
    title: "Dawi Relics: Sekibuhchhuak & Belte-phai-thei-lo",
    aliases: ["Sekibuhchhuak", "Belte-phai-thei-lo", "Dawi Phek"],
    realm: "dawi_magic",
    rarity: "Legendary",
    tagline: "Buh leh sa luan chhuah reng theihna sial ki leh belte dawi thilpek.",
    iconName: "Coins",
    powers: [
      "Buh leh sa chhuak reng eizawh theih loh",
      "Fahrah rethei hausa tura siam",
      "Dawi finna pek",
    ],
    weaknessOrTaboo: "Duham lutukna, Nahaia vervawkna, inthikna.",
    lore:
      "Zofate thawnthua dawi bungrua hmingthang berte chu:\n1. **Sekibuhchhuak**: Chhura & Nahaia sial ki dawi, buh leh sa a al lam leh a thlum lam lo chhuak thei.\n2. **Belte-phai-thei-lo**: Chepahakhata belte dawi, chaw chhum ṭum khata mi sang chuang hrai theitu.\n3. **Lalruanga Dawi Bu**: Dawi thuruk zawng zawng ziahna lehkha bu.",
    connectedEntityIds: [
      "lore-dawithiam-lalruanga",
      "lore-chhura",
      "lore-chepahakhata",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 3, label: "Bung 3: Finna Thawnthu" },
      { bookId: "book-folktales-collection", chapterId: 1, label: "Bung 1: Sekibuhchhuak" },
      { bookId: "book-folktales-collection", chapterId: 4, label: "Bung 4: Belte-phai-thei-lo" },
    ],
    secretClue:
      "Sekibuhchhuak hi Nahaia chuan bum hmangin a al lam (sa tuihnang) a chang a, Chhura chuan a thlum lam (chaw chhum) chauh a chang ṭhin.",
  },
  {
    id: "lore-chham-phuisam",
    title: "Chham, Phuisam, Hlado & Bawhhla",
    aliases: ["Sadawt Chham", "Bawlpu Phuisam", "Hlado", "Bawhhla"],
    realm: "dawi_magic",
    rarity: "Ancient",
    tagline: "Serh leh sang inthawina hla, ral do laia chakna pekna leh thlarau biakpawhna.",
    iconName: "Scroll",
    powers: [
      "Thlarau laka damlo tihdam",
      "Ral do hmaa pasalthate tih huaisen",
      "Sa kah laia Lasi lawmna siam",
    ],
    weaknessOrTaboo: "Thumal theihnghilh, serh bawhchhiat, sual zui.",
    lore:
      "Sadawt leh Bawlpu-te hian tawngkam satliah ni lo, kâ-a inhlanchhawn phuisam thuk tak an nei ṭhin a. Pasalthate pawhin sa an kah hian **Hlado** an chham a, ral an thah hian **Bawhhla** an chham ṭhin a ni.",
    connectedEntityIds: [
      "lore-pu-vana",
      "lore-khuavang",
      "lore-sih-huai",
      "lore-khawhring",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 2, label: "Bung 2: Sadawt & Bawlpu" },
      { bookId: "book-master-zofate-sulhnu", chapterId: 7, label: "Bung 7: Pasaltha Hlado" },
    ],
    secretClue:
      "Bawhhla hi ral lu lak hnuah chauh chham theih a ni a, tlangval dangte tana huaisenna khawkheng chhuah tirtu a ni.",
  },

  // =========================================================================
  // 5. THE SPIRIT REALM & AFTERLIFE (THLARAU KHAWVEL)
  // =========================================================================
  {
    id: "lore-rih-dil",
    title: "Rih Dil",
    aliases: ["Thinlung Dil", "Thlaraute Kalkawng Dil"],
    realm: "afterlife",
    rarity: "Legendary",
    tagline: "Tiau lui rala awm thinlung mawi tak, mithi thlarau zawng zawng chawlhhmun.",
    iconName: "Compass",
    powers: [
      "Thlarau khawvel kawngkhar hawn",
      "Mitthi thlarau zawng zawng hip khawm",
      "Hringnun leh thlarau khawvel inrina",
    ],
    weaknessOrTaboo: "Bawlhhlawh leh dawt laka thianghlim.",
    lore:
      "Rih Dil hi Zofate thlarau zinkawnga hmun serh ber a ni a. Hmanlai upate chuan mi an thih hian an thlarau chu Rih Dil panin an kal ṭhin tih an ring a ni. Rih Dil thinlung ang maia mawi leh fiah hi hnam pumhlum thinlung phu rual entirtu a lo ni ta a ni.",
    connectedEntityIds: [
      "lore-lunglo-tui-hawilopui",
      "lore-hringlang-tlang",
      "lore-mitthi-khua",
      "lore-pialral",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 2, label: "Bung 2: Rih Dil & Pialral" },
    ],
    secretClue:
      "Rih Dil piah lawkah hian Hawilopui par leh Lunglo tui an hmu ṭhin a, chuta chin chu hringnunah an let leh thei tawh ngai lo.",
  },
  {
    id: "lore-lunglo-tui-hawilopui",
    title: "Lunglo Tui & Hawilopui Par",
    aliases: ["Hawilopui Par", "Lunglo Tui"],
    realm: "afterlife",
    rarity: "Legendary",
    tagline: "Mitthi thlarauvin hringnun lunglenna an theihnghilh nana par an tawn leh tui an in.",
    iconName: "Sparkles",
    powers: [
      "Khawvel lunglenna leh ṭahna theihnghilh tir",
      "Thlarau hmalam chauh pan tir",
      "Thinlung thlak danglam vek",
    ],
    weaknessOrTaboo: "Hringnun lam hawi let theih tawh loh.",
    lore:
      "Mitthi thlarau chuan Hawilopui par mawi tak mai an tawn a, chuta chin chu an khawvel chhungte leh an fate pawh an ngai tawh ngai lo. Chumi hnuah Lunglo tui an in a, chu tui chuan an rilru hrehawmna leh lungngaihna zawng zawng a la bo vek ṭhin a ni.",
    connectedEntityIds: [
      "lore-rih-dil",
      "lore-hringlang-tlang",
      "lore-mitthi-khua",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 2, label: "Bung 2: Pialral Kalkawng" },
    ],
    secretClue:
      "Mizo novel hmasa ber L. Biakliana ziah 'Hawilopui' pawh he par hming chawi a phuah hi a ni.",
  },
  {
    id: "lore-hringlang-tlang",
    title: "Hringlang Tlang",
    aliases: ["Mitthi Thlirna Tlang", "Khawvel Hawikir Tlang"],
    realm: "afterlife",
    rarity: "Mythic",
    tagline: "Mitthi thlarauvin hringnun khawvel an thlir kir leh zawkna tlang sang.",
    iconName: "Mountain",
    powers: [
      "Khawvel hringnun thlir theihna",
      "Thlarau lunglen tawpkhawk chawh thawh",
    ],
    weaknessOrTaboo: "Lunglo tui in hnuah lunglen a bo vek.",
    lore:
      "Helai tlang sang tak aṭang hian mitthi thlarau chuan an khua, an in, leh an chhungkua ṭap thawm an thlir kir leh zawk ṭhin a. Mahse Lunglo tui an in tawh avangin an ṭap ve thei tawh lo va, hmalam panin an liam ta ṭhin a ni.",
    connectedEntityIds: [
      "lore-rih-dil",
      "lore-lunglo-tui-hawilopui",
      "lore-mitthi-khua",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 2, label: "Bung 2: Thlarau Kalkawng" },
    ],
    secretClue:
      "Hringlang tlang hi Rih Dil leh Mitthi khua inkara tlang ding sang ber a ni.",
  },
  {
    id: "lore-mitthi-khua",
    title: "Mitthi Khua",
    aliases: ["Mi Naran Chenna", "Thlarau Thim Khawvel"],
    realm: "afterlife",
    rarity: "Ancient",
    tagline: "Sedawi chhun lo leh mi naran thlarau chenna, rethei leh thim khawvel.",
    iconName: "Building2",
    powers: [
      "Thlarau naran kawl",
      "Rethei leh rilṭama awm reng",
    ],
    weaknessOrTaboo: "Pialral luhna nihna nei lote awmna.",
    lore:
      "Hmanlai Mizo rin danah chuan mi naran, Sedawi chhun ngai lo leh ramsa lian that lo tute chu thih hnuah Mitthi Khua-ah an cheng a. Buh thar ei tur an nei ve lova, thim hnuaiah rilṭamin an khawsa ṭhin an ti a ni.",
    connectedEntityIds: [
      "lore-rih-dil",
      "lore-pialral",
      "lore-hringlang-tlang",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 2, label: "Bung 2: Mitthi Khua" },
      { bookId: "book-archival-records", chapterId: 2, label: "Bung 2: Sakhaw Hlui" },
    ],
    secretClue:
      "Mitthi khua ata chhuah theihna awmchhun chu hringnun laia Sedawi chhun leh Khuangchawi a ni.",
  },
  {
    id: "lore-pialral",
    title: "Pialral",
    aliases: ["Huaisente Pialral", "Chatuan Hmun Nuam"],
    realm: "afterlife",
    rarity: "Legendary",
    tagline: "Pasaltha ramsa lian thattu, Sedawi chhun leh Khuangchawi tute tana khawvel nuam ber.",
    iconName: "Crown",
    powers: [
      "Chatuan lungmuanna leh hahsawlna",
      "Buh thar leh sa tuihnang eizawh theih loh",
      "Lasi mite nena lenzauna",
    ],
    weaknessOrTaboo: "Mi dawihzep leh kut tling lova nungte an lut thei lo.",
    lore:
      "Pialral chu Zofate beiseina sang ber a ni. Khuangchawi, Sedawi chhun, ramsa kawlh thattu, leh ral do laia tlawmngai taka nun hlantute chu Pialral-ah an lut a; chutah chuan buh thar leh sa tinreng an eiin, Lasi mite nen lungmuang takin an cheng kumkhua ṭhin a ni.",
    connectedEntityIds: [
      "lore-thlanrawkpa",
      "lore-pu-vana",
      "lore-lasi-chawngtinleri",
      "lore-mitthi-khua",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 2, label: "Bung 2: Pialral Ropui" },
      { bookId: "book-pasaltha-collection", chapterId: 1, label: "Bung 1: Taitesena" },
    ],
    secretClue:
      "Pialral luh nan hian in chhung khura inthawina mai tawk lovin, khawtlang hrai nana sial tam tak talh a ngai ṭhin a ni.",
  },

  // =========================================================================
  // 6. KINGS, RULERS & FEASTS (RENG & VAI LAL)
  // =========================================================================
  {
    id: "lore-thlanrawkpa",
    title: "Thlanrawkpa Khuangchawi",
    aliases: ["Thlanrawkpa", "Khawvel Ruai Ropui"],
    realm: "kings_rulers",
    rarity: "Legendary",
    tagline: "Hmanlai khawvel mihring leh ramsa inrem laia Khuangchawi ruai ropui buatsaihtu.",
    iconName: "PartyPopper",
    powers: [
      "Ramsa leh mihring inrem khawmtir",
      "Khawvel pum huapa ruai lian buatsaih",
      "Khuangchawi tobul din",
    ],
    weaknessOrTaboo: "Ruai zawh meuh chuan ṭiau a lo thleng.",
    lore:
      "Thlanrawkpa hi hmanlai pipute thawnthua mi ropui tak a ni a. Mihring leh sakei, sakhi, leh ramsa tinrengte chu inrem takin khuaah an cheng ho va. Thlanrawkpa chuan Khuangchawi ropui a buatsaih a, chu ruai zawhah chuan ramsa leh mihring chu an lo inṭhen darh ta a ni.",
    connectedEntityIds: [
      "lore-pialral",
      "lore-khuanu",
      "lore-lasi-chawngtinleri",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 2, label: "Bung 2: Sakhuana & Khuangchawi" },
      { bookId: "book-folktales-collection", chapterId: 3, label: "Bung 3: Liandova Khuangchawi" },
    ],
    secretClue:
      "Thlanrawkpa Khuangchawi aṭang hian Zofate chuan hla leh lam, khuang leh dar rimawi an zir chhuak a ni.",
  },
  {
    id: "lore-vai-lal",
    title: "Vai Lal (Kawr Lal / Phai Lal Finfiahna)",
    aliases: ["Kawr Lal", "Phai Lal", "Vai Lal Lian"],
    realm: "kings_rulers",
    rarity: "Ancient",
    tagline: "Phai zawl roreltu, Chepahakhata dawi leh finna fiah tute leh hmanlai ralthuam neitu.",
    iconName: "Landmark",
    powers: [
      "Phai zawla sipai rual leh rangkachak thunun",
      "Finfiahna (riddles) leh thutiam siam",
      "Chhiah khawn",
    ],
    weaknessOrTaboo: "Mizo finna, Chepahakhata Belte-phai-thei-lo, Vaiva & Vakul finna.",
    lore:
      "Mizo thawnthuahte hian Phai zawla 'Vai Lal' chanchin hi a tam em em a. Chepahakhata thawnthu-ah phei chuan Vai Lal chuan Chepahakhata chu buhfai hmui lo thliar tur te, sakei dawi hneh tur tein a fiah a; mahse Chepahakhata finna chuan Vai Lal chu a hneh ta vek a ni.",
    connectedEntityIds: [
      "lore-chepahakhata",
      "lore-reng-lal",
      "lore-dawi-bu-relics",
    ],
    chapterRefs: [
      { bookId: "book-folktales-collection", chapterId: 4, label: "Bung 4: Chepahakhata & Vai Lal" },
    ],
    secretClue:
      "Vai Lalte hian Chepahakhata belte chu chaw tlem chauh chhum theiah an ngai a, mahse a buh a lo phai thei ngai lo a ni.",
  },
  {
    id: "lore-reng-lal",
    title: "Reng Lal (Shan & Burma Reng Lalte)",
    aliases: ["Shan Lalte", "Burma Reng", "Khampat Lal"],
    realm: "kings_rulers",
    rarity: "Ancient",
    tagline: "Kabaw phai zawla Zofate nawr cheptu, Khampat Bungpui hun laia Shan lalte.",
    iconName: "Shield",
    powers: [
      "Thir chem leh sakawr sipai rual",
      "Chhiah rit tak khawn",
      "Khawpui lian tak din",
    ],
    weaknessOrTaboo: "Zofate tlangram chhengchhe luh ngam loh.",
    lore:
      "Kabaw phai zawl (Shan State) vela Zofate an chen lai khan Shan Lalte (Reng Lal) chuan chhiah rit tak an phut ṭhin a. Zofate chuan sal nih aiin zalenna an thlang a, Khampat Bungpui phunin tlangram lam an pan ta a ni.",
    connectedEntityIds: [
      "lore-vai-lal",
      "lore-thlanrawkpa",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 1, label: "Bung 1: Khampat Bungpui" },
      { bookId: "book-master-zofate-sulhnu", chapterId: 5, label: "Bung 5: Zahmuaka Thlahte" },
    ],
    secretClue:
      "Khampat Bungpui zar leh zung a lo chhuah a, lei a tawh leh hunah Zofate chuan he ram hi an la luah leh ang an ti ṭhin.",
  },

  // =========================================================================
  // 7. LEGENDARY FOLK HEROES & TALES (THAWNTHU HMINGTHANG)
  // =========================================================================
  {
    id: "lore-chhura",
    title: "Chhura",
    aliases: ["Chhurabura", "Chhura Farep"],
    realm: "heroes_folklore",
    rarity: "Legendary",
    tagline: "Mizo thawnthu hmingthang ber, mi lianpui chak em em leh rilru thianghlim mawl si.",
    iconName: "Swords",
    powers: [
      "Chak tawpkhawk (lungpui lian chawi)",
      "Chhura farep rem",
      "Phungpuinu leh sakei hneh",
    ],
    weaknessOrTaboo: "Nahaia fin vervawk bumna awlsam.",
    lore:
      "Chhura hi Zofate thinlung luahtu ber a ni. A chak em em a, lungpui a pho va, leilung a kual chhuak a. Mahse rilru thianghlim leh mawl a nih avangin Nahaia'n a bum fo ṭhin. A tawpah erawh chuan Chhura chakna leh huaisenna bawk hian khua a chhan chhuak leh ṭhin.",
    connectedEntityIds: [
      "lore-nahaia",
      "lore-phungpuinu",
      "lore-dawi-bu-relics",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 3, label: "Bung 3: Chhura & Nahaia" },
      { bookId: "book-folktales-collection", chapterId: 1, label: "Bung 1: Chhura leh Nahaia" },
    ],
    secretClue:
      "Chhura Farep Champhai daifem a mi hi Chhura'n a kut ngeia a rem nia an sawi a ni.",
  },
  {
    id: "lore-nahaia",
    title: "Nahaia",
    aliases: ["Fing Varpui", "Chhura Ṭhianpa"],
    realm: "heroes_folklore",
    rarity: "Folk",
    tagline: "Mi cher leh chak lo, mahse fin vervawk leh thil insem thluak vawrh thiam tawpkhawk.",
    iconName: "BrainCircuit",
    powers: [
      "Bum thiamna leh vervawkna",
      "Sekibuhchhuak a al lam hauh thiam",
      "Mawza lem hmanga Chhura bum",
    ],
    weaknessOrTaboo: "Chakna tak tak neih loh, ral hmaah tlanchhiat.",
    lore:
      "Nahaia chu Chhura ṭhianpa a ni a. Chhura mawlna chu remchangah lain Sekibuhchhuak insemnaah, vaivak lakah, leh sa kah insemnaah Chhura chu a bum ṭhin a ni.",
    connectedEntityIds: [
      "lore-chhura",
      "lore-dawi-bu-relics",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 3, label: "Bung 3: Chhura & Nahaia" },
      { bookId: "book-folktales-collection", chapterId: 1, label: "Bung 1: Sekibuhchhuak" },
    ],
    secretClue:
      "Nahaia hian Mawza lem a siam a, Chhura kuta a pek hnuah Chhura vawkin a chhuhsak daih a ni.",
  },
  {
    id: "lore-chepahakhata",
    title: "Chepahakhata",
    aliases: ["Changêl Fahrah", "Belte-phai-thei-lo Neitu"],
    realm: "heroes_folklore",
    rarity: "Legendary",
    tagline: "Changêl hmun fahrah, nupui van lawn nei a Vai Lalte riddles zawng zawng chhang chhuaktu.",
    iconName: "Sparkle",
    powers: [
      "Belte-phai-thei-lo thunun",
      "Vaiva leh Vakul finna hriat",
      "Vana lawn theihna",
      "Vai Lalte finfiahna hneh",
    ],
    weaknessOrTaboo: "Nupui van lawn hnuah lunglen tuar lohna.",
    lore:
      "Chepahakhata hi Mizo folklore-a finna lallukhum a ni. Changêl hmun aṭanga seilian fahrah niin, Vanchung nula nupuiah a nei a. Vai Lalte'n thilmak hrang hranga an fiahna zawng zawng chu a chhang chhuak vek a, Mizo finna chu phai lalte lakah a chawisang em em a ni.",
    connectedEntityIds: [
      "lore-vai-lal",
      "lore-vanchung-nula-tlangval",
      "lore-dawi-bu-relics",
    ],
    chapterRefs: [
      { bookId: "book-folktales-collection", chapterId: 4, label: "Bung 4: Chepahakhata & Finfiahna" },
    ],
    secretClue:
      "Chepahakhata hian vaiva leh vakul inbiakna a ngaithla ru a, chumi aṭang chuan Vai Lal riddles chhanna a hrechhuak ṭhin.",
  },
  {
    id: "lore-kungawrhi",
    title: "Kungawrhi",
    aliases: ["Vankal Nula Hmelṭha", "Keimi Man"],
    realm: "heroes_folklore",
    rarity: "Mythic",
    tagline: "Vankal khaw nula hmelṭha ber, puk thuka Keimi laka pasalthate chhan chhuah tak.",
    iconName: "Shield",
    powers: [
      "Hmelṭhatna chungchuang",
      "Puk thuk tawrhchhelna",
    ],
    weaknessOrTaboo: "Keimi dawi leh sakei rual.",
    lore:
      "Kungawrhi hi Vankal khuaa nula hmelṭha ber a ni a. Keimi-ho chuan an ruk bo va, puk thuk takah an khung a. Vankal pasaltha Phawthira leh Hrangchhuana te chuan an va zawng a, puk chhungah sakei rual chu chemsei leh meichher kengin an va bei a, an chhan chhuak ta a ni.",
    connectedEntityIds: [
      "lore-keimi",
      "lore-keichala",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 3, label: "Bung 3: Kungawrhi & Keimi" },
      { bookId: "book-folktales-collection", chapterId: 6, label: "Bung 6: Kungawrhi leh Keimi" },
    ],
    secretClue:
      "Phawthira chuan puk kawngkhar lungpui lianpui chu a chhir per a, chumi aṭang chuan meichher an vawm lut a ni.",
  },
  {
    id: "lore-mauruangi",
    title: "Mauruangi & Bingtaii",
    aliases: ["Mauruangi", "Nu Hrawn Tuartu"],
    realm: "heroes_folklore",
    rarity: "Folk",
    tagline: "Nu hrawn sual tawrhchhelna, Vamur thuruk leh phunchawng par mawi.",
    iconName: "Heart",
    powers: [
      "Vamur puihna dawn",
      "Phunchawng par mawi chhuah",
      "Tawrhchhelna ril",
    ],
    weaknessOrTaboo: "Nu hrawn Bingtaii nu tihduhdahna.",
    lore:
      "Mauruangi hi fahrah khawngaihthlak tak a ni a, a nu hrawn chuan a tihduhdah em em ṭhin. Mahse a nu thlarau chu Vamur-ah a chang a, buh ṭha a pek phah a. A tawpah chuan Phunchawng par mawi takah changin lalfanu ropui a lo ni ta a ni.",
    connectedEntityIds: [
      "lore-khuanu",
    ],
    chapterRefs: [
      { bookId: "book-folktales-collection", chapterId: 2, label: "Bung 2: Mauruangi & Vamur" },
    ],
    secretClue:
      "Mauruangi sam zai chu Vamur chuan a thla-ah kengin Phunchawng par mawi takah a chantir a ni.",
  },
  {
    id: "lore-liandova",
    title: "Liandova te Unau & Tuaisiala",
    aliases: ["Liandova", "Khuangchawi Fahrah"],
    realm: "heroes_folklore",
    rarity: "Legendary",
    tagline: "Fahrah khawngaihthlak ber aṭanga vawk thau vanga khawpui tana Khuangchawi tute.",
    iconName: "Award",
    powers: [
      "Fahrah tawrhchhelna",
      "Kumpinu/Lasi vawk vulh thau",
      "Khuangchawi ropui buatsaih",
    ],
    weaknessOrTaboo: "Khawtlang hmusitna tuar tlawk tlawk.",
    lore:
      "Liandova leh a nau Tuaisiala chu an rethei em em a, tlangvalte'n an hmusit ṭhin. Mahse Lasi mite duhsakna vawk an enkawl a, chu vawk chu a lian em em a. A tawpah chuan Khuangchawi ropui buatsaihin khaw pum an hrai a, Lalber hial an lo tluk ta a ni.",
    connectedEntityIds: [
      "lore-thlanrawkpa",
      "lore-lasi-chawngtinleri",
      "lore-pialral",
    ],
    chapterRefs: [
      { bookId: "book-folktales-collection", chapterId: 3, label: "Bung 3: Liandova te Unau" },
    ],
    secretClue:
      "Liandova te unau vawk lu chu an khaw lal in aia lianin kawtchhuahah an tar hial a ni.",
  },
  {
    id: "lore-tualvungi-zawlpala",
    title: "Tualvungi leh Zawlpala",
    aliases: ["Phulpui Romance", "Thlan Vual Khat"],
    realm: "heroes_folklore",
    rarity: "Legendary",
    tagline: "Phulpui Lal Zawlpala leh Tualvungi hmangaihna thianghlim, thih hnu pawha inthen lo.",
    iconName: "HeartHandshake",
    powers: [
      "Hmangaihna thianghlim",
      "Thlan khatah inphum dun",
      "Phengphehlep mawi taka chan dun",
    ],
    weaknessOrTaboo: "Tripura Lal Phuntiha tur hrai.",
    lore:
      "Phulpui Lal Zawlpala leh Tualvungi hmangaihna hi Mizo literature-a lungchhiatthlak ber a ni. Tripura Lal Phuntiha'n Zawlpala tur a hrai hlum hnuah, Tualvungi chuan a nghawng a inzai hlum ve a; thlan khatah zalh dunin Pialral panin an thlawk dun ta a ni.",
    connectedEntityIds: [
      "lore-rih-dil",
      "lore-pialral",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 4, label: "Bung 4: Tualvungi & Zawlpala" },
      { bookId: "book-folktales-collection", chapterId: 7, label: "Bung 7: Pipute Lunglen" },
    ],
    secretClue:
      "Phulpui khuaah Zawlpala leh Tualvungi thlan lung chu vawiin thlengin hmuh theihin a la awm a ni.",
  },
  {
    id: "lore-lianchhiari-chala",
    title: "Lianchhiari leh Chala",
    aliases: ["Lianchhiari Tlang", "Dungtlang Romance"],
    realm: "heroes_folklore",
    rarity: "Folk",
    tagline: "Dungtlang lalfanu leh rethei tlangval inhmangaihna, Lianchhiari lunglen hla ropui.",
    iconName: "Feather",
    powers: [
      "Hla phuah mawi tawpkhawk",
      "Lianchhiari tlang lunglen chawh thawh",
    ],
    weaknessOrTaboo: "Lal leh mi rethei inkar dan.",
    lore:
      "Dungtlang lalfanu Lianchhiari chuan mi rethei tlangval Chala a inhmangaih em em a. Upate'n an inzawm an phal loh vanga Chala umbo a nih hnuah, Lianchhiari chu tlang sangah ṭhuin mittui nen hla mawi tak tak a phuah zozai a ni.",
    connectedEntityIds: [
      "lore-pi-hmuaki",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 4, label: "Bung 4: Lianchhiari Lunglen" },
    ],
    secretClue:
      "Dungtlang khaw bula 'Lianchhiari Lunglen Tlang' hi vawiin thlengin tlawh hlawh ber pakhat a la ni reng a ni.",
  },
  {
    id: "lore-tlumtea",
    title: "Tlumtea (Rulpui Hnehtu)",
    aliases: ["Fahrah Huaisen", "Tlumtea"],
    realm: "heroes_folklore",
    rarity: "Folk",
    tagline: "Fahrah naupang chemsei leh meipui nena rulpui kawlh lianpui hnehtu ropui.",
    iconName: "Flame",
    powers: [
      "Huaisenna tawpkhawk",
      "Rulpui chhung luhchilhin zai hlum",
      "Khua leh tui chhan chhuak",
    ],
    weaknessOrTaboo: "Naupan leh chak loh em avanga hmusit tuar.",
    lore:
      "Khawtlangin rulpui lianpui an ngam loh laiin, naupang Tlumtea chuan a chemsei chawiin rulpui chhungah a lut a, a thinlung a zai hlum sak a, tualchhung a chhan chhuak ta a ni.",
    connectedEntityIds: [
      "lore-rulpui-lian",
      "lore-chemtatrawta",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 3, label: "Bung 3: Tlumtea Huaisenna" },
    ],
    secretClue:
      "Tlumtea hian meipui a chheh alh phawt a, rulpuiin a rawn lem laiin a chem a lo lek chhuak a ni.",
  },
  {
    id: "lore-chemtatrawta",
    title: "Chemtatrawta (Inthlunzawm Finna)",
    aliases: ["Chemtatrawlh", "Chain Tale Hero"],
    realm: "heroes_folklore",
    rarity: "Folk",
    tagline: "Vau-pangpar aṭanga rulpui seh lal fanu thlenga inthlunzawm (cause-and-effect) zirtirtu.",
    iconName: "Link",
    powers: [
      "Chem hriam tak tat",
      "Thil inthlunzawm (causality chain) lantir",
    ],
    weaknessOrTaboo: "Lal kuta mawhphurhna lak.",
    lore:
      "Chemtatrawta'n a chem a tat a, vau-pangpar a zai a, chingpiri bu a per a, sakei mitah a zung a, arpa, chepa, vawk, laikhur, rulpui thlengin a inthlung a, lal fanu a seh ta a. He thawnthu hian eng thiltih pawhin nghawng a nei vek a ni tih a zirtir a ni.",
    connectedEntityIds: [
      "lore-rulpui-lian",
      "lore-tlumtea",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 3, label: "Bung 3: Chemtatrawta" },
    ],
    secretClue:
      "Chemtatrawta thawnthu hi Mizo oral tradition-a 'Chain Tale' (inthlunzawm thawnthu) ber a ni.",
  },
  {
    id: "lore-sibuta-darlalpuii",
    title: "Sibuta & Darlalpuii (Sibuta Lung)",
    aliases: ["Sibuta", "Darlalpuii", "Sibuta Lungphun"],
    realm: "heroes_folklore",
    rarity: "Ancient",
    tagline: "Tachhip tlanga Sibuta lungphun rapthlak leh nung chunga phum hlum sal nula Darlalpuii.",
    iconName: "Monument",
    powers: [
      "Lungphun lian ding kumkhua",
      "Sal leh hmeichhiate tawrhna chhinchhiahna",
    ],
    weaknessOrTaboo: "Sibuta nunrawngna leh a hnu lama a inchhirna.",
    lore:
      "Sibuta fahrah aṭanga Lal a nih hnuah, a hmusittute lakah phuba la turin lungphun lianpui a pawt a. Chu a lung phun nan chuan sal nula hmelṭha Darlalpuii chu nung chungin a phum hlum tir ta tlat mai a. Tachhip tlang dungah he lung hi vawiin thlengin a la ding lurh a ni.",
    connectedEntityIds: [
      "lore-pi-hmuaki",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 4, label: "Bung 4: Sibuta Lung & Darlalpuii" },
    ],
    secretClue:
      "Sibuta Lung bul velah hian zan thimah Darlalpuii ṭap thawm an hre ṭhin tiin Tachhip upate chuan an sawi ṭhin.",
  },
  {
    id: "lore-pi-hmuaki",
    title: "Pi Hmuaki",
    aliases: ["Hla Phuahtu Hmasa", "Phum Hlum Nu"],
    realm: "heroes_folklore",
    rarity: "Ancient",
    tagline: "Zofate hla phuah thiam hmasa ber, a aw mawi thik vanga leiah nung dama an phum hlum tak.",
    iconName: "Mic2",
    powers: [
      "Hla mawi tawpkhawk phuah",
      "Leilung chhung ata zai thangkhawk",
      "Hnam hla zinkawng sulsutu",
    ],
    weaknessOrTaboo: "Lalte leh upate thikna rapthlak.",
    lore:
      "Pi Hmuaki hian hla mawi tak tak a phuah a, mipui lung a tihlurh em avangin lalte'n an thik a, nung chungin leiah an phum hlum ta a ni. Lei an vur lai pawhin a aw a chhuah reng a, Mizo hla thlarau a thi ngai lo vang tih a nemnghet a ni.",
    connectedEntityIds: [
      "lore-lianchhiari-chala",
      "lore-sibuta-darlalpuii",
    ],
    chapterRefs: [
      { bookId: "book-master-zofate-sulhnu", chapterId: 4, label: "Bung 4: Pi Hmuaki" },
    ],
    secretClue:
      "Pi Hmuaki phum hlum a nihna hmun hi Lalthangvunga khua nia an sawi a ni a, Mizo literature lungphun hmasa ber a ni.",
  },
];

export const LORE_REALM_METADATA: Record<
  string,
  { label: string; icon: string; description: string; badgeColor: string }
> = {
  all: {
    label: "A Vaiin (All Lore)",
    icon: "Globe",
    description: "Mizo dawi, thlarau, lasi, arsi leh thawnthu zawng zawng",
    badgeColor: "bg-stone-500/10 text-stone-700 dark:text-stone-300 border-stone-500/20",
  },
  vanchung: {
    label: "Vanchung & Pathian (Celestial)",
    icon: "Sun",
    description: "Pu Vana, Khuanu, Chung Khuavang, Vanchung Nula & Arsite",
    badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  },
  lasi_nature: {
    label: "Lasi & Ngawpui (Nature Spirits)",
    icon: "Sparkles",
    description: "Chawngtinleri, Tan Tlang, Sih Huai & Ngawpui Ramhuai",
    badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  },
  monsters_spirits: {
    label: "Keimi & Ramsa (Beasts & Were-Tigers)",
    icon: "Skull",
    description: "Keimi, Keichala, Phungpuinu, Khawhring & Rulpui Lian",
    badgeColor: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
  },
  dawi_magic: {
    label: "Dawi & Relics (Sorcery & Relics)",
    icon: "Wand2",
    description: "Lalruanga, Dawi Bu, Chham & Phuisam, Sekibuhchhuak",
    badgeColor: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
  },
  afterlife: {
    label: "Thlarau Khawvel (The Afterlife)",
    icon: "Compass",
    description: "Rih Dil, Lunglo Tui, Hawilopui Par, Mitthi Khua & Pialral",
    badgeColor: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
  },
  kings_rulers: {
    label: "Reng & Vai Lal (Rulers & Feasts)",
    icon: "Landmark",
    description: "Thlanrawkpa Khuangchawi, Shan Reng Lalte & Vai Lal",
    badgeColor: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30",
  },
  heroes_folklore: {
    label: "Thawnthu Hmingthang (Folklore Heroes)",
    icon: "Swords",
    description: "Chhura, Nahaia, Chepahakhata, Kungawrhi, Mauruangi, etc.",
    badgeColor: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
  },
};
