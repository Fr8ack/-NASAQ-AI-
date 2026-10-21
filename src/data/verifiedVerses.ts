import { Verse } from '../types/quran';

/**
 * Verified offline Quranic verse repository (Hafs from Asim, Tanzil verified)
 * Each verse has pristine Uthmani text, normalized search text, and verified coordinates.
 */
export const VERIFIED_VERSES_DB: Record<string, Verse> = {
  // --- Test Case 1: Al-Ahzab 72 (الأمانة) ---
  "33:72": {
    verse_key: "33:72",
    surah_id: 33,
    ayah_number: 72,
    surah_name_ar: "الأحزاب",
    uthmani_text: "إِنَّا عَرَضْنَا الْأَمَانَةَ عَلَى السَّمَاوَاتِ وَالْأَرْضِ وَالْجِبَالِ فَأَبَيْنَ أَن يَحْمِلْنَهَا وَأَشْفَقْنَ مِنْهَا وَحَمَلَهَا الْإِنسَانُ ۖ إِنَّهُ كَانَ ظَلُومًا جَهُولًا",
    normalized_text: "إنا عرضنا الأمانة على السماوات والأرض والجبال فأبين أن يحملنها وأشفقن منها وحملها الإنسان إنه كان ظلوما جهولا",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "33:73": {
    verse_key: "33:73",
    surah_id: 33,
    ayah_number: 73,
    surah_name_ar: "الأحزاب",
    uthmani_text: "لِّيُعَذِّبَ اللَّهُ الْمُنَافِقِينَ وَالْمُنَافِقَاتِ وَالْمُشْرِكِينَ وَالْمُشْرِكَاتِ وَيَتُوبَ اللَّهُ عَلَى الْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ ۗ وَكَانَ اللَّهُ غَفُورًا رَّحِيمًا",
    normalized_text: "ليعذب الله المنافقين والمنافقات والمشركين والمشركات ويتوب الله على المؤمنين والمؤمنات وكان الله غفورا رحيما",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },

  // --- Test Case 2: Az-Zukhruf 81 (الشرط والعبادة) ---
  "43:81": {
    verse_key: "43:81",
    surah_id: 43,
    ayah_number: 81,
    surah_name_ar: "الزخرف",
    uthmani_text: "قُلْ إِن كَانَ لِلرَّحْمَٰنِ وَلَدٌ فَأَنَا أَوَّلُ الْعَابِدِينَ",
    normalized_text: "قل إن كان للرحمن ولد فأنا أول العابدين",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "43:82": {
    verse_key: "43:82",
    surah_id: 43,
    ayah_number: 82,
    surah_name_ar: "الزخرف",
    uthmani_text: "سُبْحَانَ رَبِّ السَّمَاوَاتِ وَالْأَرْضِ رَبِّ الْعَرْشِ عَمَّا يَصِفُونَ",
    normalized_text: "سبحان رب السماوات والأرض رب العرش عما يصفون",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },

  // --- Test Case 3: Adh-Dhariyat 56 (معنى العبادة) ---
  "51:56": {
    verse_key: "51:56",
    surah_id: 51,
    ayah_number: 56,
    surah_name_ar: "الذاريات",
    uthmani_text: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ",
    normalized_text: "وما خلقت الجن والإنس إلا ليعبدون",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "51:57": {
    verse_key: "51:57",
    surah_id: 51,
    ayah_number: 57,
    surah_name_ar: "الذاريات",
    uthmani_text: "مَا أُرِيدُ مِنْهُم مِّن رِّزْقٍ وَمَا أُرِيدُ أَن يُطْعِمُونِ",
    normalized_text: "ما أريد منهم من رزق وما أريد أن يطعمون",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "51:58": {
    verse_key: "51:58",
    surah_id: 51,
    ayah_number: 58,
    surah_name_ar: "الذاريات",
    uthmani_text: "إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ",
    normalized_text: "إن الله هو الرزاق ذو القوة المتين",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },

  // --- Test Case 4: Ya-Sin 60-61 (العبادة والطاعة) ---
  "36:60": {
    verse_key: "36:60",
    surah_id: 36,
    ayah_number: 60,
    surah_name_ar: "يس",
    uthmani_text: "أَلَمْ أَعْهَدْ إِلَيْكُمْ يَا بَنِي آدَمَ أَن لَّا تَعْبُدُوا الشَّيْطَانَ ۖ إِنَّهُ لَكُمْ عَدُوٌّ مُّبِينٌ",
    normalized_text: "ألم أعهد إليكم يا بني آدم أن لا تعبدوا الشيطان إنه لكم عدو مبين",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "36:61": {
    verse_key: "36:61",
    surah_id: 36,
    ayah_number: 61,
    surah_name_ar: "يس",
    uthmani_text: "وَأَنِ اعْبُدُونِي ۚ هَٰذَا صِرَاطٌ مُّسْتَقِيمٌ",
    normalized_text: "وأن اعبدوني هذا صراط مستقيم",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },

  // --- Test Case 5: Ad-Dukhan 54 & parallel verses (حور عين) ---
  "44:54": {
    verse_key: "44:54",
    surah_id: 44,
    ayah_number: 54,
    surah_name_ar: "الدخان",
    uthmani_text: "كَذَٰلِكَ وَزَوَّجْنَاهُم بِحُورٍ عِينٍ",
    normalized_text: "كذلك وزوجناهم بحور عين",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "52:20": {
    verse_key: "52:20",
    surah_id: 52,
    ayah_number: 20,
    surah_name_ar: "الطور",
    uthmani_text: "مُتَّكِئِينَ عَلَىٰ سُرُرٍ مَّصْفُوفَةٍ ۖ وَزَوَّجْنَاهُم بِحُورٍ عِينٍ",
    normalized_text: "متكئين على سرر مصفوفة وزوجناهم بحور عين",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "56:22": {
    verse_key: "56:22",
    surah_id: 56,
    ayah_number: 22,
    surah_name_ar: "الواقعة",
    uthmani_text: "وَحُورٌ عِينٌ",
    normalized_text: "وحور عين",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "56:23": {
    verse_key: "56:23",
    surah_id: 56,
    ayah_number: 23,
    surah_name_ar: "الواقعة",
    uthmani_text: "كَأَمْثَالِ اللُّؤْلُؤِ الْمَكْنُونِ",
    normalized_text: "كأمثال اللؤلؤ المكنون",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "55:72": {
    verse_key: "55:72",
    surah_id: 55,
    ayah_number: 72,
    surah_name_ar: "الرحمن",
    uthmani_text: "حُورٌ مَّقْصُورَاتٌ فِي الْخِيَامِ",
    normalized_text: "حور مقصورات في الخيام",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },

  // --- Test Case 6: Al-Hijr 36-38 (طلب الإنظار والوقت المعلوم) ---
  "15:36": {
    verse_key: "15:36",
    surah_id: 15,
    ayah_number: 36,
    surah_name_ar: "الحجر",
    uthmani_text: "قَالَ رَبِّ فَأَنظِرْنِي إِلَىٰ يَوْمِ يُبْعَثُونَ",
    normalized_text: "قال رب فأنظرني إلى يوم يبعثون",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "15:37": {
    verse_key: "15:37",
    surah_id: 15,
    ayah_number: 37,
    surah_name_ar: "الحجر",
    uthmani_text: "قَالَ فَإِنَّكَ مِنَ الْمُنظَرِينَ",
    normalized_text: "قال فإنك من المنظرين",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "15:38": {
    verse_key: "15:38",
    surah_id: 15,
    ayah_number: 38,
    surah_name_ar: "الحجر",
    uthmani_text: "إِلَىٰ يَوْمِ الْوَقْتِ الْمَعْلُومِ",
    normalized_text: "إلى يوم الوقت المعلوم",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "38:79": {
    verse_key: "38:79",
    surah_id: 38,
    ayah_number: 79,
    surah_name_ar: "ص",
    uthmani_text: "قَالَ رَبِّ فَأَنظِرْنِي إِلَىٰ يَوْمِ يُبْعَثُونَ",
    normalized_text: "قال رب فأنظرني إلى يوم يبعثون",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "38:80": {
    verse_key: "38:80",
    surah_id: 38,
    ayah_number: 80,
    surah_name_ar: "ص",
    uthmani_text: "قَالَ فَإِنَّكَ مِنَ الْمُنظَرِينَ",
    normalized_text: "قال فإنك من المنظرين",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "38:81": {
    verse_key: "38:81",
    surah_id: 38,
    ayah_number: 81,
    surah_name_ar: "ص",
    uthmani_text: "إِلَىٰ يَوْمِ الْوَقْتِ الْمَعْلُومِ",
    normalized_text: "إلى يوم الوقت المعلوم",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },

  // --- Test Case 7: Ya-Sin 20 & Al-Qasas 20 (اختلاف ترتيب الكلمات) ---
  "36:20": {
    verse_key: "36:20",
    surah_id: 36,
    ayah_number: 20,
    surah_name_ar: "يس",
    uthmani_text: "وَجَاءَ مِنْ أَقْصَى الْمَدِينَةِ رَجُلٌ يَسْعَىٰ قَالَ يَا قَوْمِ اتَّبِعُوا الْمُرْسَلِينَ",
    normalized_text: "وجاء من أقصى المدينة رجل يسعى قال يا قوم اتبعوا المرسلين",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "28:20": {
    verse_key: "28:20",
    surah_id: 28,
    ayah_number: 20,
    surah_name_ar: "القصص",
    uthmani_text: "وَجَاءَ رَجُلٌ مِّنْ أَقْصَى الْمَدِينَةِ يَسْعَىٰ قَالَ يَا مُوسَىٰ إِنَّ الْمَلَأَ يَأْتَمِرُونَ بِكَ لِيَقْتُلُوكَ فَاخْرُجْ إِنِّي لَكَ مِنَ النَّاصِحِينَ",
    normalized_text: "وجاء رجل من أقصى المدينة يسعى قال يا موسى إن الملأ يأتمرون بك ليقتلوك فاخرج إني لك من الناصحين",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },

  // --- Surah Al-Fatihah (1:1 - 1:7) ---
  "1:1": {
    verse_key: "1:1",
    surah_id: 1,
    ayah_number: 1,
    surah_name_ar: "الفاتحة",
    uthmani_text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    normalized_text: "بسم الله الرحمن الرحيم",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "1:2": {
    verse_key: "1:2",
    surah_id: 1,
    ayah_number: 2,
    surah_name_ar: "الفاتحة",
    uthmani_text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    normalized_text: "الحمد لله رب العالمين",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "1:3": {
    verse_key: "1:3",
    surah_id: 1,
    ayah_number: 3,
    surah_name_ar: "الفاتحة",
    uthmani_text: "الرَّحْمَٰنِ الرَّحِيمِ",
    normalized_text: "الرحمن الرحيم",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "1:4": {
    verse_key: "1:4",
    surah_id: 1,
    ayah_number: 4,
    surah_name_ar: "الفاتحة",
    uthmani_text: "مَالِكِ يَوْمِ الدِّينِ",
    normalized_text: "مالك يوم الدين",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "1:5": {
    verse_key: "1:5",
    surah_id: 1,
    ayah_number: 5,
    surah_name_ar: "الفاتحة",
    uthmani_text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    normalized_text: "إياك نعبد وإياك نستعين",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "1:6": {
    verse_key: "1:6",
    surah_id: 1,
    ayah_number: 6,
    surah_name_ar: "الفاتحة",
    uthmani_text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    normalized_text: "اهدنا الصراط المستقيم",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "1:7": {
    verse_key: "1:7",
    surah_id: 1,
    ayah_number: 7,
    surah_name_ar: "الفاتحة",
    uthmani_text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    normalized_text: "صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },

  // --- Surah Al-Baqarah Highlights ---
  "2:21": {
    verse_key: "2:21",
    surah_id: 2,
    ayah_number: 21,
    surah_name_ar: "البقرة",
    uthmani_text: "يَا أَيُّهَا النَّاسُ اعْبُدُوا رَبَّكُمُ الَّذِي خَلَقَكُمْ وَالَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
    normalized_text: "يا أيها الناس اعبدوا ربكم الذي خلقكم والذين من قبلكم لعلكم تتقون",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "2:255": {
    verse_key: "2:255",
    surah_id: 2,
    ayah_number: 255,
    surah_name_ar: "البقرة",
    uthmani_text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    normalized_text: "الله لا إله إلا هو الحي القيوم لا تأخذه سنة ولا نوم له ما في السماوات وما في الأرض من ذا الذي يشفع عنده إلا بإذنه يعلم ما بين أيديهم وما خلفهم ولا يحيطون بشيء من علمه إلا بما شاء وسع كرسيه السماوات والأرض ولا يئوده حفظهما وهو العلي العظيم",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },

  // --- Al-Isra 85 (الروح) ---
  "17:85": {
    verse_key: "17:85",
    surah_id: 17,
    ayah_number: 85,
    surah_name_ar: "الإسراء",
    uthmani_text: "وَيَسْأَلُونَكَ عَنِ الرُّوحِ ۖ قُلِ الرُّوحُ مِنْ أَمْرِ رَبِّي وَمَا أُوتِيتُم مِّنَ الْعِلْمِ إِلَّا قَلِيلًا",
    normalized_text: "ويسألونك عن الروح قل الروح من أمر ربي وما أوتيتم من العلم إلا قليلا",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "97:4": {
    verse_key: "97:4",
    surah_id: 97,
    ayah_number: 4,
    surah_name_ar: "القدر",
    uthmani_text: "تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ",
    normalized_text: "تنزل الملائكة والروح فيها بإذن ربهم من كل أمر",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "78:38": {
    verse_key: "78:38",
    surah_id: 78,
    ayah_number: 38,
    surah_name_ar: "النبأ",
    uthmani_text: "يَوْمَ يَقُومُ الرُّوحُ وَالْمَلَائِكَةُ صَفًّا ۖ لَّا يَتَكَلَّمُونَ إِلَّا مَنْ أَذِنَ لَهُ الرَّحْمَٰنُ وَقَالَ صَوَابًا",
    normalized_text: "يوم يقوم الروح والملائكة صفا لا يتكلمون إلا من أذن له الرحمن وقال صوابا",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "26:193": {
    verse_key: "26:193",
    surah_id: 26,
    ayah_number: 193,
    surah_name_ar: "الشعراء",
    uthmani_text: "نَزَلَ بِهِ الرُّوحُ الْأَمِينُ",
    normalized_text: "نزل به الروح الأمين",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "16:102": {
    verse_key: "16:102",
    surah_id: 16,
    ayah_number: 102,
    surah_name_ar: "النحل",
    uthmani_text: "قُلْ نَزَّلَهُ رُوحُ الْقُدُسِ مِن رَّبِّكَ بِالْحَقِّ لِيُثَبِّتَ الَّذِينَ آمَنُوا وَهُدًى وَبُشْرَىٰ لِلْمُسْلِمِينَ",
    normalized_text: "قل نزله روح القدس من ربك بالحق ليثبت الذين آمنوا وهدى وبشرى للمسلمين",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },

  // --- Surah Al-Ikhlas (112:1 - 112:4) ---
  "112:1": {
    verse_key: "112:1",
    surah_id: 112,
    ayah_number: 1,
    surah_name_ar: "الإخلاص",
    uthmani_text: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    normalized_text: "قل هو الله أحد",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "112:2": {
    verse_key: "112:2",
    surah_id: 112,
    ayah_number: 2,
    surah_name_ar: "الإخلاص",
    uthmani_text: "اللَّهُ الصَّمَدُ",
    normalized_text: "الله الصمد",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "112:3": {
    verse_key: "112:3",
    surah_id: 112,
    ayah_number: 3,
    surah_name_ar: "الإخلاص",
    uthmani_text: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
    normalized_text: "لم يلد ولم يولد",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "112:4": {
    verse_key: "112:4",
    surah_id: 112,
    ayah_number: 4,
    surah_name_ar: "الإخلاص",
    uthmani_text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    normalized_text: "ولم يكن له كفوا أحد",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },

  // --- Ali 'Imran 7 (محكم ومتشابه) ---
  "3:7": {
    verse_key: "3:7",
    surah_id: 3,
    ayah_number: 7,
    surah_name_ar: "آل عمران",
    uthmani_text: "هُوَ الَّذِي أَنزَلَ عَلَيْكَ الْكِتَابَ مِنْهُ آيَاتٌ مُّحْكَمَاتٌ هُنَّ أُمُّ الْكِتَابِ وَأُخَرُ مُتَشَابِهَاتٌ ۖ فَأَمَّا الَّذِينَ فِي قُلُوبِهِمْ زَيْغٌ فَيَتَّبِعُونَ مَا تَشَابَهَ مِنْهُ ابْتِغَاءَ الْفِتْنَةِ وَابْتِغَاءَ تَأْوِيلِهِ ۗ وَمَا يَعْلَمُ تَأْوِيلَهُ إِلَّا اللَّهُ ۗ وَالرَّاسِخُونَ فِي الْعِلْمِ يَقُولُونَ آمَنَّا بِهِ كُلٌّ مِّنْ عِندِ رَبِّنَا ۗ وَمَا يَذَّكَّرُ إِلَّا أُولُو الْأَلْبَابِ",
    normalized_text: "هو الذي أنزل عليك الكتاب منه آيات محكمات هن أم الكتاب وأخر متشابهات فأما الذين في قلوبهم زيغ فيتبعون ما تشابه منه ابتغاء الفتنة وابتغاء تأويله وما يعلم تأويله إلا الله والراسخون في العلم يقولون آمنا به كل من عند ربنا وما يذكر إلا أولو الألباب",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },

  // --- Al-Furqan 32-33 (تنزيل القرآن وترتيله وتبيينه) ---
  "25:32": {
    verse_key: "25:32",
    surah_id: 25,
    ayah_number: 32,
    surah_name_ar: "الفرقان",
    uthmani_text: "وَقَالَ الَّذِينَ كَفَرُوا لَوْلَا نُزِّلَ عَلَيْهِ الْقُرْآنُ جُمْلَةً وَاحِدَةً ۚ كَذَٰلِكَ لِنُثَبِّتَ بِهِ فُؤَادَكَ ۖ وَرَتَّلْنَاهُ تَرْتِيلًا",
    normalized_text: "وقال الذين كفروا لولا نزل عليه القرآن جملة واحدة كذلك لنثبت به فؤادك ورتلناه ترتيلا",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  },
  "25:33": {
    verse_key: "25:33",
    surah_id: 25,
    ayah_number: 33,
    surah_name_ar: "الفرقان",
    uthmani_text: "وَلَا يَأْتُونَكَ بِمَثَلٍ إِلَّا جِئْنَاكَ بِالْحَقِّ وَأَحْسَنَ تَفْسِيرًا",
    normalized_text: "ولا يأتونك بمثل إلا جئناك بالحق وأحسن تفسيرا",
    source_version: "Tanzil-Hafs-Uthmani-v1.0"
  }
};
