import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Image as ImageIcon,
  Compass,
  Sparkles,
  Shield,
  BookOpen,
  X,
  Maximize2,
  ZoomIn,
  ArrowRight,
  Filter,
} from "lucide-react";

export interface GalleryArtwork {
  id: string;
  title: string;
  category: "history" | "pasaltha" | "folklore" | "mythology";
  categoryLabel: string;
  era: string;
  imageUrl: string;
  captionMizo: string;
  descriptionMizo: string;
  relatedBookId: string;
  relatedChapterId: number;
}

export const MASTER_GALLERY_ARTWORKS: GalleryArtwork[] = [
  {
    id: "art-chhinlung",
    title: "Chhinlung Chhuahsan & Khawpui Pan",
    category: "history",
    categoryLabel: "Zofate Sulhnu",
    era: "Tobul Hun Lai",
    imageUrl: "/illustrations/bung1_chhinlung_migration.jpg",
    captionMizo: "Zofate thlahtute lungpui khuhna (Chhinlung) aṭanga khawvel eng lo hmuh chhuah dan.",
    descriptionMizo:
      "Mizo thawnthu leh hla hlui berte zinga mi 'Chhinlung chhuak kan ni e, tin saw tlang kan rel e' tih ang ngeiin, Zofate thlahtute chuan khawvel thim ata lungpui kâ aṭangin khawvel eng an rawn rap a. Shan tlang leh Chindwin phai zawl panin an pem chhuak a ni.",
    relatedBookId: "book-master-zofate-sulhnu",
    relatedChapterId: 1,
  },
  {
    id: "art-khampat",
    title: "Khampat Bungpui & Inṭhen Darh",
    category: "history",
    categoryLabel: "Zofate Sulhnu",
    era: "c. 1400–1500",
    imageUrl: "/illustrations/bung1_khampat_bungpui.jpg",
    captionMizo: "Khampat khawpui hmunah Bungpui phun a, 'A zung a lo chhuah leh hunah kan la inhmukhawm leh ang' tia thutiam.",
    descriptionMizo:
      "Upper Burma (Kabaw Valley) Khampat khuaa Zofate an awm khawm laiin, hnam peng hrang hrangte inṭhen darh a lo ngai ta a. An inṭhen hmain Bungpui an phun a, 'He bung zar hian lei a siam leh hunah Zofate chu kan inhmukhawm leh ang' tiin thutiam ropui an siam a ni.",
    relatedBookId: "book-master-zofate-sulhnu",
    relatedChapterId: 1,
  },
  {
    id: "art-tiau",
    title: "Tiau Lui Kan & Zoram Luhluh",
    category: "history",
    categoryLabel: "Zofate Sulhnu",
    era: "c. 1700",
    imageUrl: "/illustrations/bung1_tiau_crossing.jpg",
    captionMizo: "Chin Hills aṭanga Tiau lui kanin tunlai Mizoram tlangramah an pem lut.",
    descriptionMizo:
      "Tiau lui ral leh Chin Hills chhung khua (Seipui, Tlanghua) aṭangin Lusei, Lai, Mara, Hmar, Ralte leh Paite hnam pengte chuan Tiau lui an kan a. Tlang chhip sâng leh zawl zau zawngin Zoram dung leh vangah in an khuar ta a ni.",
    relatedBookId: "book-master-zofate-sulhnu",
    relatedChapterId: 1,
  },
  {
    id: "art-rih-dil",
    title: "Tan Tlang & Rih Dil (A Tak Topography & Thlarau Khawvel)",
    category: "mythology",
    categoryLabel: "Dawi & Thlarau",
    era: "Sakhaw Hlui Hun",
    imageUrl: "/illustrations/bung2_rih_dil_tan_tlang.jpg",
    captionMizo: "Google Earth satellite coordinate (23°20'24\"N 93°23'06\"E) mil thlap Rih Dil lung-hmel (heart-shaped) mawi leh Tan Tlang (1,837m).",
    descriptionMizo:
      "Rih Dil hi Chin Hills (Myanmar) leh Mizoram inrina Tiau lui piah lawka awm, a takah pawh lung-hmel (heart-shaped) dik tak pu a ni. Chhim-hmar zawnga tui fim tak leh tlang ngaw hring nghalh karah a awm a; Mizo thawnthu leh sakhaw hlui-ah chuan mitthi thlaraute Pialral kalkawng leh Lasi Lalnu Chawngtinleri chenna Tan Tlang sâng thlirtu hmun thianghlim a ni.",
    relatedBookId: "book-master-zofate-sulhnu",
    relatedChapterId: 2,
  },
  {
    id: "art-zawlbuk",
    title: "Zawlbuk Meipui & Thawnthu Hrilh",
    category: "folklore",
    categoryLabel: "Pi-Pu Thawnthu",
    era: "Zawlbuk Hun Lai",
    imageUrl: "/illustrations/bung3_zawlbuk_storyteller.jpg",
    captionMizo: "Zawlbuk meipui bula Val Upa leh tlangvalte kâ-a inhlanchhawn thawnthu ngaithla.",
    descriptionMizo:
      "Zan thim hnuaiah Zawlbuk thing lianpui hal alh chungah Val Upa-in Chhura leh Nahaia, Chemtatrawta, Tlumtea leh Kungawrhi te thawnthu zirtir nei thuk tak a hrilh a, Mizo tlawmngaihna lungphum an chher chho a ni.",
    relatedBookId: "book-master-zofate-sulhnu",
    relatedChapterId: 3,
  },
  {
    id: "art-sibuta",
    title: "Sibuta Lung & Darlalpuii Lungchhiatthlak",
    category: "history",
    categoryLabel: "Zofate Sulhnu",
    era: "c. 1750",
    imageUrl: "/illustrations/bung4_sibuta_lung_darlalpuii.jpg",
    captionMizo: "Tachhip khaw daia Sibuta Lungphun lianpui (ft 12 megalithic standing stone) leh sal nula Darlalpuii phum thu.",
    descriptionMizo:
      "Palian lal Sibuta chapona avanga a lungphun ropui tak tana nung chunga sal nula Darlalpuii an phum tak chanchin; hmeichhiate tawrhna leh vanram chawimawi thawnthu lungchhiatthlak ber a ni.",
    relatedBookId: "book-master-zofate-sulhnu",
    relatedChapterId: 4,
  },
  {
    id: "art-sailo-lalte",
    title: "Sailo Lalte Rorelna & Selesih Khawpui",
    category: "history",
    categoryLabel: "Zofate Sulhnu",
    era: "c. 1700–1780",
    imageUrl: "/illustrations/bung5_sailo_lalte_council.jpg",
    captionMizo: "Selesih in 7,000 khawpui ropui dintu Zahmuaka thlah Lusei lal hnam 6-te inrawnkhawm.",
    descriptionMizo:
      "Zahmuaka fapate aṭanga lo chhuak Zadeng, Palian, Thangluah, Rivung, Rokhum leh Sailo lalte chuan Selesih in 7,000 khawpui an din a, Zoram chhim leh hmar awptu rorelna nghet tak an kengkawh a ni.",
    relatedBookId: "book-master-zofate-sulhnu",
    relatedChapterId: 5,
  },
  {
    id: "art-lai-mara",
    title: "Chhim Lam Lalte — Lai & Mara Pasalthate",
    category: "pasaltha",
    categoryLabel: "Pasalthate & Indona",
    era: "c. 1800–1870",
    imageUrl: "/illustrations/bung6_lai_mara_warriors.jpg",
    captionMizo: "Chhim lam tlangram huaisen taka awptu Lai (Pawi) leh Mara pasalthate ralthuam.",
    descriptionMizo:
      "Lai lal Hengmanga leh Sangchema, Mara lal Tlohsai leh Hawthai khua te, leh Fanai lalte chuan chhim lam ramri humhim nan huaisen takin indo an hmachhawn ṭhin a ni.",
    relatedBookId: "book-master-zofate-sulhnu",
    relatedChapterId: 6,
  },
  {
    id: "art-khuangchera",
    title: "Pasaltha Khuangchera & Changsil Kulh",
    category: "pasaltha",
    categoryLabel: "Pasalthate & Indona",
    era: "September 13, 1890",
    imageUrl: "/illustrations/bung7_pasaltha_khuangchera.jpg",
    captionMizo: "Changsil kulh beihnaa nun hlantu Pasaltha Khuangchera leh a ṭhian Ngurbawnga.",
    descriptionMizo:
      "September 13, 1890-a British sipai kulh Changsil beihnaah Khuangchera leh Ngurbawnga chuan an ram leh zalenna hum nan tlawmngaihna tawpkhawk lantirin hmelma an hmachhawn a, Ram Chhan Martyr ropuiah an chang ta a ni.",
    relatedBookId: "book-master-zofate-sulhnu",
    relatedChapterId: 7,
  },
  {
    id: "art-thlanrawn",
    title: "Thlanrawn Rawtna — Lallula Phuba",
    category: "pasaltha",
    categoryLabel: "Pasalthate & Indona",
    era: "c. 1790",
    imageUrl: "/illustrations/bung8_thlanrawn_rawt_battle.jpg",
    captionMizo: "Zopui leh Chawngtlai vela Sukte leh Pawi laka phuba lakna indona rapthlak.",
    descriptionMizo:
      "Sailo lal Lallula hovin Sukte leh Pawi ralho laka Zofate tihduhdahna phuba la tura ruahmanna an siam a, Zoram khawchhak invenna kulhpui ber a lo ni ta a ni.",
    relatedBookId: "book-master-zofate-sulhnu",
    relatedChapterId: 8,
  },
  {
    id: "art-vailian",
    title: "Mary Winchester (Zoluti) & Vailian 1871",
    category: "history",
    categoryLabel: "Zofate Sulhnu",
    era: "1871–1872",
    imageUrl: "/illustrations/bung9_mary_winchester_expedition.jpg",
    captionMizo: "Alexandrapur runnaa Bengkhuaia'n Zoluti a lak hnu leh British Lushai Expedition lo thlen dan.",
    descriptionMizo:
      "Kum ruk mi Zoluti (Mary Winchester) chu Bengkhuaia'n Sailam khuaah a enkawl a, chu thil avang chuan British sorkarin 1871–1872 First Lushai Expedition lianpui an rawn tir a ni.",
    relatedBookId: "book-master-zofate-sulhnu",
    relatedChapterId: 9,
  },
  {
    id: "art-rambuai",
    title: "Zoram Buai 1966 & Aizawl Khawpui",
    category: "history",
    categoryLabel: "Zofate Sulhnu",
    era: "March 1966",
    imageUrl: "/illustrations/bung10_rambuai_aizawl_1966.jpg",
    captionMizo: "Operation Jericho, 1966 Zoram Buai thim, Grouping tawrhna leh 1986 Remna Zoram Thar.",
    descriptionMizo:
      "Kum 1966 March ni 1-a zalenna puan a nih hnu leh kum 20 chhung Zoram Buai tawrhna karah, 1986 Peace Accord hmangin remna a lo thleng a, Zoram Thar a lo piang chhuak ta a ni.",
    relatedBookId: "book-master-zofate-sulhnu",
    relatedChapterId: 10,
  },
  {
    id: "art-taitesena",
    title: "Pasaltha Taitesena (Ralthatchhûnga)",
    category: "pasaltha",
    categoryLabel: "Pasalthate & Indona",
    era: "c. 1880",
    imageUrl: "/illustrations/pasaltha_taitesena_hero.jpg",
    captionMizo: "Khawrihnim pasaltha huaisen Taitesena, Mizo tlawmngaihna entirna ropui ber.",
    descriptionMizo:
      "Taitesena chuan fahrah leh hmeithai tan a nun a hlan a, khaw chhiat leh ral lakah a tlangvalte hruaiin a khua leh tui a veng him a. 'Taitesena a dam chhung chuan ka khua a ralmuang e' tia lalten an chhal pasaltha a ni.",
    relatedBookId: "book-story-mizo-pasalthate",
    relatedChapterId: 1,
  },
  {
    id: "art-chhura",
    title: "Chhura & Sekibuhchhuak",
    category: "folklore",
    categoryLabel: "Pi-Pu Thawnthu",
    era: "Pi-Pu Hun Lai",
    imageUrl: "/illustrations/folk_chhura_sekibuhchhuak.jpg",
    captionMizo: "Chhura'n a Sekibuhchhuak dawi hmanga chaw tuihnang a phuh chhuah tir lai leh Nahaia vertherna.",
    descriptionMizo:
      "Chhura tha chak leh rilru thianghlim, Sekibuhchhuak neitu leh Mawngping khua verhtu thawnthu; Nahaia vertherna karah pawh Chhura bawk chu a vannei zawkah a ṭang zel a ni.",
    relatedBookId: "book-story-mizo-folktales",
    relatedChapterId: 1,
  },
  {
    id: "art-mauruangi",
    title: "Mauruangi leh Vamur Sava",
    category: "folklore",
    categoryLabel: "Pi-Pu Thawnthu",
    era: "Folk Legend",
    imageUrl: "/illustrations/folk_mauruangi_vamur.jpg",
    captionMizo: "Fahrah nula Mauruangi Phunchawng par hnuaia Vamur sava nena an inbiak lai.",
    descriptionMizo:
      "Nuhrawn duhdah tuartu Mauruangi, a nu thlarau sangha leh Phunchawng par mawi, leh Vamur sava tanpuina hmanga Tuipui rala Vai Lal nupui ropuia a chhuah dan thawnthu ngaihnawm.",
    relatedBookId: "book-story-mizo-folktales",
    relatedChapterId: 2,
  },
  {
    id: "art-kungawrhi",
    title: "Kungawrhi leh Keimi Puk Thuk",
    category: "folklore",
    categoryLabel: "Pi-Pu Thawnthu",
    era: "Folk Legend",
    imageUrl: "/illustrations/folk_kungawrhi_keimi_cave.jpg",
    captionMizo: "Phawngpui Blue Mountain puk thuka Kungawrhi Keimi hovin an hual vel lai.",
    descriptionMizo:
      "Nula hmelṭha Kungawrhi chu Keimi (sakeia inthlak thei) hovin an ruk bo hnuin, pasaltha Hranga leh Phunga ten dawi chem leh huaisenna hmanga an va chhan chhuah dan.",
    relatedBookId: "book-story-mizo-folktales",
    relatedChapterId: 6,
  },
  {
    id: "art-chepahakhata",
    title: "Chepahakhata & Vakul Finna",
    category: "folklore",
    categoryLabel: "Pi-Pu Thawnthu",
    era: "Folk Legend",
    imageUrl: "/illustrations/chepahakhata_hornbill_wit.jpg",
    captionMizo: "Chepahakhata'n Changêl hmun, Belte-phai-thei-lo leh Vakul finna hmanga Vai Lal a hneh dan.",
    descriptionMizo:
      "Mizo finna leh thluak hman dan entirna ropui ber Chepahakhata thawnthu; mahni inngaitlawm leh nungchang mawiin lal thiltithei tak a hneh theih zia a tarlang a ni.",
    relatedBookId: "book-story-mizo-folktales",
    relatedChapterId: 4,
  },
  {
    id: "art-lasi-chawngtinleri",
    title: "Tan Tlang Lasi Lalnu Chawngtinleri",
    category: "mythology",
    categoryLabel: "Dawi & Thlarau",
    era: "Dawi Khawvel",
    imageUrl: "/illustrations/lasi_chawngtinleri_tantlang.jpg",
    captionMizo: "Tan Tlang sâng tak maia Lasi Lalnu Chawngtinleri ramngaw sa tinreng nena an chawlh lai.",
    descriptionMizo:
      "Mizo thawnthua Lasi Lalnu ber Chawngtinleri chu Tan Tlang chhipah cheng zelin, pasaltha tlawmngai leh rilru thianghlimte hnenah sa-kah vanneihna a vur ṭhin a ni.",
    relatedBookId: "book-master-zofate-sulhnu",
    relatedChapterId: 2,
  },
  {
    id: "art-pialral",
    title: "Rih Dil Kam aṭanga Pialral Pan Zinkawng",
    category: "mythology",
    categoryLabel: "Dawi & Thlarau",
    era: "Thlarau Khawvel",
    imageUrl: "/illustrations/afterlife_rih_dil_pialral.jpg",
    captionMizo: "Rih Dil heart-shaped lake tui fawn vel leh mitthi thlarauten Lunglo Tui an in a Hawilopar an tawnna.",
    descriptionMizo:
      "Hmanlai Mizo sakhuaah thlarau thianghlim leh Thangchhuah lalte chauh luh theihna Pialral; Rih Dil heart-shaped lake kam aṭanga thlarau zinkawng, Lunglo tui fimin lunglen a tireh a, Hawilopar an tawn hnuah Pialral an pan ṭhin.",
    relatedBookId: "book-master-zofate-sulhnu",
    relatedChapterId: 2,
  },
  {
    id: "art-ropuiliani-defiance",
    title: "Lalnu Ropuiliani — Denlung Kulh Zalenna",
    category: "history",
    categoryLabel: "Zofate Sulhnu",
    era: "1893–1895",
    imageUrl: "/illustrations/lalnu_ropuiliani_defiance.jpg",
    captionMizo: "Chhim lam Lalnu huaisen Ropuiliani'n British sorkar chhiah pek a hnawl lai.",
    descriptionMizo:
      "Ralvawng khaw lal Vandula nupui Lalnu Ropuiliani chuan Denlung khua aṭangin British sorkar thuneihna chu a dodal tlat a, Chittagong jail thleng pawhin tlawm lovin Mizo zalenna a humhim a ni.",
    relatedBookId: "book-master-zofate-sulhnu",
    relatedChapterId: 8,
  },
];

interface MizoArtGalleryStudioProps {
  onSelectChapter: (bookId: string, chapterId: number) => void;
}

export const MizoArtGalleryStudio: React.FC<MizoArtGalleryStudioProps> = ({
  onSelectChapter,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeModalArtwork, setActiveModalArtwork] =
    useState<GalleryArtwork | null>(null);

  const filteredArtworks = MASTER_GALLERY_ARTWORKS.filter((art) => {
    if (selectedCategory === "all") return true;
    return art.category === selectedCategory;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Studio Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-ink)]/15 border border-[var(--accent-ink)]/30 text-[var(--accent-ink)] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mizo Sulhnu &amp; Thawnthu Milem Studio</span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-[var(--text-ink)] tracking-tight">
            Zofate Milem, Animation &amp; Sulhnu Gallery
          </h1>

          <p className="font-book text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            Chhinlung tobul aṭanga tunlai Zoram thleng, Pasalthate huaisenna, Lasi leh thlarau khawvel, leh pi-pu thawnthu ropuite milem leh visual animation hmanga tarlan a ni.
          </p>

          {/* Category Filter Pills */}
          <div className="pt-3 flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-[var(--accent-ink)] text-[var(--accent-contrast)] shadow-md"
                  : "bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              A Vaiin ({MASTER_GALLERY_ARTWORKS.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("history")}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors ${
                selectedCategory === "history"
                  ? "bg-[var(--accent-ink)] text-[var(--accent-contrast)] shadow-md"
                  : "bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              Zofate Sulhnu
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("pasaltha")}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors ${
                selectedCategory === "pasaltha"
                  ? "bg-[var(--accent-ink)] text-[var(--accent-contrast)] shadow-md"
                  : "bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              Pasalthate &amp; Indona
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("folklore")}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors ${
                selectedCategory === "folklore"
                  ? "bg-[var(--accent-ink)] text-[var(--accent-contrast)] shadow-md"
                  : "bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              Pi-Pu Thawnthu
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("mythology")}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors ${
                selectedCategory === "mythology"
                  ? "bg-[var(--accent-ink)] text-[var(--accent-contrast)] shadow-md"
                  : "bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-[var(--text-ink)]"
              }`}
            >
              Dawi &amp; Thlarau
            </button>
          </div>
        </div>
      </div>

      {/* Artworks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtworks.map((art) => (
          <motion.div
            key={art.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveModalArtwork(art)}
            className="group cursor-pointer rounded-2xl overflow-hidden border border-[var(--border-hairline)] bg-[var(--bg-elevated)] shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col"
          >
            {/* Image Frame with Ken Burns Hover */}
            <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
              <img
                src={art.imageUrl}
                alt={art.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

              {/* Badges Overlay */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium">
                  {art.categoryLabel}
                </span>
                <span className="p-1.5 rounded-full bg-black/50 backdrop-blur-md text-white/80 group-hover:text-white group-hover:bg-black/70 transition-colors">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Era pill */}
              <div className="absolute bottom-3 left-3">
                <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-stone-300 text-[10px] font-mono">
                  {art.era}
                </span>
              </div>
            </div>

            {/* Caption & Title */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-[var(--text-ink)] group-hover:text-[var(--accent-ink)] transition-colors leading-snug">
                  {art.title}
                </h3>
                <p className="mt-1 font-book text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                  {art.captionMizo}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-[var(--accent-ink)] font-semibold border-t border-[var(--border-hairline)]/60">
                <span>En Chianna &amp; Thawnthu</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Dossier Modal */}
      <AnimatePresence>
        {activeModalArtwork && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
            onClick={() => setActiveModalArtwork(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-hairline)] shadow-2xl flex flex-col"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalArtwork(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Full-Size Artwork Banner */}
              <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-black overflow-hidden shrink-0">
                <img
                  src={activeModalArtwork.imageUrl}
                  alt={activeModalArtwork.title}
                  className="w-full h-full object-contain sm:object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-elevated)] via-transparent to-transparent opacity-80" />
              </div>

              {/* Modal Body Narrative */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-[var(--accent-ink)] text-[var(--accent-contrast)] font-bold">
                    {activeModalArtwork.categoryLabel}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-muted)] font-mono">
                    {activeModalArtwork.era}
                  </span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-ink)] leading-tight">
                  {activeModalArtwork.title}
                </h2>

                <p className="font-book text-sm sm:text-base text-[var(--text-ink)]/90 leading-relaxed italic border-l-4 border-[var(--accent-ink)] pl-4 py-1 bg-[var(--bg-canvas)]/50 rounded-r-xl">
                  {activeModalArtwork.captionMizo}
                </p>

                <div className="font-book text-sm sm:text-base text-[var(--text-muted)] leading-relaxed pt-2">
                  {activeModalArtwork.descriptionMizo}
                </div>

                {/* Quick Action: Navigate to Book Chapter */}
                <div className="pt-6 border-t border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectChapter(
                        activeModalArtwork.relatedBookId,
                        activeModalArtwork.relatedChapterId
                      );
                      setActiveModalArtwork(null);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent-ink)] text-[var(--accent-contrast)] font-semibold text-xs sm:text-sm shadow-lg hover:bg-[var(--accent-hover)] transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>A Bung Pumin Chhiar Rawh</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModalArtwork(null)}
                    className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-ink)]"
                  >
                    Kharna
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
