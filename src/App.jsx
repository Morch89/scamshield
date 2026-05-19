import { useEffect, useState } from "react";

const UI_TEXT = {
  en: {
    home: "Home",
    learn: "Learn More About Scams",
    headline: "Check suspicious messages before you click.",
    subtitle: "ScamShield Malaysia helps you check suspicious SMS, WhatsApp messages, bank alerts, parcel links, OTP requests, and fake prize claims.",
    responseLanguage: "Language",
    placeholder: "Paste the suspicious message or URL here...",
    checkButton: "Check for Scam",
    analysing: "Analysing...",
    counter: "Scam checks performed",
    privacy: "Privacy Policy",
    disclaimer: "Disclaimer",
    educationTitle: "Scam Education Centre",
    educationSubtitle: "Learn about common scams affecting Malaysians.",
    example: "Example:"
    feature1: "Malaysia-focused",
feature2: "Instant check",
feature3: "No login needed",
feature4: "Official resources",

step1Title: "Paste",
step1Desc: "Copy the suspicious message or link.",

step2Title: "Analyse",
step2Desc: "Check for scam warning signs.",

step3Title: "Act",
step3Desc: "Get clear next steps.",
  },
  ms: {
    home: "Laman Utama",
    learn: "Ketahui Lebih Lanjut Tentang Scam",
    headline: "Semak mesej mencurigakan sebelum anda klik.",
    subtitle: "ScamShield Malaysia membantu anda menyemak SMS, mesej WhatsApp, amaran bank, pautan parcel, permintaan OTP dan tuntutan hadiah palsu.",
    responseLanguage: "Bahasa",
    placeholder: "Tampal mesej atau pautan yang mencurigakan di sini...",
    checkButton: "Semak Scam",
    analysing: "Sedang menganalisis...",
    counter: "Semakan scam dibuat",
    privacy: "Polisi Privasi",
    disclaimer: "Penafian",
    educationTitle: "Pusat Pendidikan Scam",
    educationSubtitle: "Ketahui jenis scam biasa yang menyasarkan rakyat Malaysia.",
    example: "Contoh:"
  feature1: "Fokus Malaysia",
feature2: "Semakan segera",
feature3: "Tiada login diperlukan",
feature4: "Sumber rasmi",

step1Title: "Tampal",
step1Desc: "Salin mesej atau pautan mencurigakan.",

step2Title: "Analisis",
step2Desc: "Semak tanda amaran scam.",

step3Title: "Bertindak",
step3Desc: "Dapatkan langkah seterusnya.",
  },
  zh: {
    home: "主页",
    learn: "了解更多诈骗类型",
    headline: "点击之前，先检查可疑信息。",
    subtitle: "ScamShield Malaysia 可帮助你检查可疑短信、WhatsApp 信息、银行提醒、包裹链接、OTP 请求和虚假中奖信息。",
    responseLanguage: "语言",
    placeholder: "在这里粘贴可疑信息或链接...",
    checkButton: "检查诈骗",
    analysing: "分析中...",
    counter: "已完成诈骗检查",
    privacy: "隐私政策",
    disclaimer: "免责声明",
    educationTitle: "诈骗教育中心",
    educationSubtitle: "了解常见的马来西亚诈骗类型。",
    example: "例子："
    feature1: "马来西亚专属",
feature2: "即时检测",
feature3: "无需登录",
feature4: "官方资源",

step1Title: "粘贴",
step1Desc: "复制可疑信息或链接。",

step2Title: "分析",
step2Desc: "检查诈骗风险迹象。",

step3Title: "行动",
step3Desc: "获取清晰的下一步建议。",
  }
};

const VERDICTS = {
  "LIKELY SCAM": { bg: "#FF3B30", light: "#FFF0EF", text: "#CC0000", icon: "⚠️" },
  "POSSIBLE SCAM": { bg: "#FF9500", light: "#FFF8EE", text: "#B35900", icon: "🔶" },
  "LOOKS SAFE": { bg: "#34C759", light: "#F0FFF4", text: "#1A7A33", icon: "✅" },
};

const scamCardStyle = {
  background: "rgba(255,255,255,0.04)",
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,0.07)",
  padding: 24
};

const detailBoxStyle = {
  background: "rgba(0,0,0,0.24)",
  borderRadius: 16,
  padding: 18,
  marginBottom: 14
};

const footerButtonStyle = {
  background: "transparent",
  border: "none",
  color: "#7A8FA6",
  cursor: "pointer",
  fontSize: 12,
  textDecoration: "none"
};

const SCAM_TYPES = {
  en: [
    {
      title: "💰 Fake Investment Schemes",
      desc: "Fake investment scams promise unrealistically high returns within a short period of time. Scammers often pose as investment agents, crypto experts, forex traders, or representatives of legitimate-looking companies.\n\nThey may use fake profit screenshots, testimonials, celebrity impersonations, WhatsApp groups, Telegram channels, and professional-looking websites to build trust. Victims may receive small early payouts before being encouraged to invest larger amounts.\n\nOnce larger sums are transferred, withdrawals become impossible, extra fees are demanded, or the scammers disappear.",
      example: "Earn RM15,000 in 7 days with our AI crypto trading platform. Limited slots available."
    },
    {
      title: "👮 Macau Scam",
      desc: "Macau scams involve scammers impersonating police officers, Bank Negara Malaysia officers, customs, courts, or courier companies. Victims are falsely accused of being linked to crimes such as money laundering, drug trafficking, tax evasion, or illegal transactions.\n\nScammers create fear and urgency, often telling victims not to inform family members because the case is confidential. They may transfer calls between fake departments to appear more convincing.\n\nVictims are eventually instructed to transfer money into so-called safe accounts for investigation, but the accounts are controlled by scammers.",
      example: "Your bank account is linked to money laundering activities. Transfer your funds immediately for investigation."
    },
    {
      title: "📱 SMS & Email Phishing Scams",
      desc: "Phishing scams use fake SMS messages or emails to steal banking logins, passwords, OTP codes, credit card details, or identity information.\n\nThese messages often appear to come from banks, e-wallets, courier companies, government agencies, or online platforms. Victims are directed to fake websites that look similar to official login pages.\n\nOnce victims enter their details, scammers can access accounts, approve transactions, or steal identities.",
      example: "Your CIMB account has been suspended. Verify immediately at cimb-secure-login.com"
    },
    {
      title: "💳 Non-Existent Loan Scams",
      desc: "These scams target people who urgently need money by offering fast loan approvals with low interest rates and minimal requirements.\n\nVictims are told their loan has been approved, but they must first pay processing fees, legal fees, stamp duty, insurance charges, or deposits before the funds can be released.\n\nAfter payment, no loan is issued. The scammer may disappear or continue demanding more payments.",
      example: "Your RM50,000 loan has been approved. Please pay RM800 processing fee to release funds."
    },
    {
      title: "❤️ Love Scam",
      desc: "Love scams happen when scammers build fake romantic relationships online through dating apps or social media. They spend time gaining emotional trust before asking for money.\n\nThe scammer may claim to need help with medical bills, travel costs, business problems, customs fees, or family emergencies.\n\nSome claim to have sent expensive gifts or cash parcels that are supposedly held by Customs, requiring the victim to pay release fees.",
      example: "I need help paying customs fees so I can send you the gifts and money parcel."
    },
    {
      title: "💼 Fake Job Scams",
      desc: "Fake job scams advertise attractive work-from-home jobs, simple online tasks, or high-income opportunities with little experience required.\n\nVictims may be asked to pay registration fees, training fees, deposits, or money to unlock higher-paying tasks. Some scams pay small amounts at first to build trust.\n\nEventually, victims are asked to deposit larger sums, withdrawals are blocked, or the scammer disappears.",
      example: "Earn RM300 daily from home with simple online tasks. Limited vacancies available."
    },
    {
      title: "🏦 Online Loan App Scams",
      desc: "Online loan app scams use fake websites or mobile apps that look like legitimate lenders. Victims are promised instant approval and fast cash disbursement.\n\nThey may be asked to submit identity cards, selfies, bank statements, or payslips. These documents can later be misused for identity theft, fraud, or blackmail.\n\nVictims may also be asked to pay upfront fees before the loan is released, but the loan never arrives.",
      example: "Instant approval loan app. No documents required. Receive cash within 10 minutes."
    },
    {
      title: "📦 Parcel Scam",
      desc: "Parcel scams usually begin with calls, SMS, or WhatsApp messages claiming a parcel has been held by Customs, courier services, or authorities.\n\nScammers may claim the parcel contains illegal items, unpaid customs fees, or suspicious goods. Victims are pressured to pay fines, provide banking details, or cooperate with fake officers.\n\nSome parcel scams escalate into Macau scams where victims are accused of criminal activity.",
      example: "Your parcel contains prohibited items. Pay immediately to avoid police investigation."
    },
    {
      title: "🏢 Organisation Impersonation Scams",
      desc: "Scammers pretend to represent banks, telcos, e-wallet providers, government agencies, delivery companies, or customer service departments.\n\nThey claim there is an issue with an account, subscription, refund, delivery, or verification process. Victims are then asked for passwords, OTP codes, banking details, or identity information.\n\nThe information is later used to access accounts, steal money, or commit identity fraud.",
      example: "Touch 'n Go eWallet account verification required. Submit your OTP now."
    },
    {
      title: "⚠️ Bank Account Threat Scams",
      desc: "These scams rely on fear and urgency. Victims are told their bank accounts are linked to suspicious transactions, illegal activity, unpaid taxes, or criminal investigations.\n\nScammers threaten account freezes, arrests, legal action, or court proceedings unless the victim acts immediately.\n\nVictims may be told to transfer money into temporary or safe accounts, which actually belong to the scammers.",
      example: "Your account will be frozen within 2 hours unless you verify your funds immediately."
    },
    {
      title: "🎁 Government Aid Scams",
      desc: "Government aid scams exploit financial assistance programs, subsidies, grants, or relief payments. Victims receive fake messages claiming they qualify for special aid.\n\nThe message may include a fake link that imitates an official portal. Victims may be asked to provide banking details, identity information, or pay a small processing fee.\n\nThese scams often increase during economic hardship, disasters, or when real government aid programs are in the news.",
      example: "You qualify for RM1,500 bantuan khas. Verify now to receive payment."
    },
    {
      title: "🔐 OTP Scams",
      desc: "OTP scams happen when scammers trick victims into revealing one-time passwords or TAC codes sent by banks, e-wallets, or online services.\n\nScammers may pretend to be bank officers, customer support agents, or refund teams. They claim the OTP is needed for verification, cancellation, refund processing, or account security.\n\nOnce the victim shares the OTP, scammers can approve transactions, reset passwords, or access accounts.",
      example: "We sent an OTP to verify your refund. Please provide the code immediately."
    },
    {
      title: "💸 Fake Fund Transfer Scam",
      desc: "In this scam, scammers claim they accidentally transferred money into the victim’s account and ask for it to be returned urgently.\n\nThey may send fake bank screenshots or manipulated transaction receipts to make the transfer appear real.\n\nVictims who do not verify their actual bank balance may end up sending their own money to the scammer.",
      example: "I accidentally transferred RM2,000 into your account. Please return it urgently."
    },
    {
      title: "🖥️ Tech Support Scams",
      desc: "Tech support scammers pretend to be from Microsoft, antivirus companies, internet providers, or technical support teams.\n\nThey claim the victim’s computer, phone, or internet connection has been infected, hacked, or compromised. Victims may be asked to install remote access software.\n\nOnce access is granted, scammers can steal files, passwords, banking information, or install malware.",
      example: "Your computer has been infected with dangerous malware. Call support immediately."
    },
    {
      title: "🎫 Fake Ticket Scams",
      desc: "Fake ticket scams involve the sale of non-existent or invalid tickets for concerts, sports events, theme parks, flights, or popular entertainment events.\n\nScammers often advertise through social media, messaging apps, or resale groups, claiming they have limited tickets at discounted prices.\n\nAfter payment, victims may receive fake tickets, duplicated tickets, or nothing at all. The scammer usually blocks contact after receiving payment.",
      example: "Taylor Swift VIP tickets available cheap. Limited quantity, bank transfer only."
    }
  ],

  ms: [
    {
      title: "💰 Skim Pelaburan Palsu",
      desc: "Skim pelaburan palsu menjanjikan pulangan yang tidak realistik dalam masa yang singkat. Scammer biasanya menyamar sebagai ejen pelaburan, pakar kripto, pedagang forex atau wakil syarikat yang kelihatan sah.\n\nMereka mungkin menggunakan tangkap layar keuntungan palsu, testimoni rekaan, penyamaran selebriti, kumpulan WhatsApp, saluran Telegram dan laman web profesional untuk membina kepercayaan. Mangsa kadang-kadang menerima keuntungan kecil pada awalnya sebelum digalakkan melabur jumlah yang lebih besar.\n\nSelepas jumlah besar dipindahkan, pengeluaran biasanya menjadi mustahil, bayaran tambahan diminta, atau scammer terus menghilang.",
      example: "Jana RM15,000 dalam 7 hari melalui platform dagangan kripto AI kami. Slot terhad."
    },
    {
      title: "👮 Macau Scam",
      desc: "Macau scam berlaku apabila scammer menyamar sebagai polis, pegawai Bank Negara Malaysia, kastam, mahkamah atau syarikat kurier. Mangsa dituduh terlibat dalam jenayah seperti pengubahan wang haram, dadah, cukai tertunggak atau transaksi haram.\n\nScammer menggunakan ugutan dan tekanan supaya mangsa bertindak segera. Mangsa juga sering diberitahu supaya tidak memberitahu keluarga kerana kononnya kes itu sulit. Panggilan mungkin dipindahkan antara beberapa jabatan palsu untuk kelihatan lebih meyakinkan.\n\nAkhirnya, mangsa diarahkan memindahkan wang ke akaun selamat untuk siasatan, tetapi akaun itu sebenarnya dikawal oleh scammer.",
      example: "Akaun bank anda dikaitkan dengan aktiviti pengubahan wang haram. Pindahkan wang anda sekarang untuk siasatan."
    },
    {
      title: "📱 Scam SMS & Emel Phishing",
      desc: "Scam phishing menggunakan SMS atau emel palsu untuk mencuri nama pengguna perbankan, kata laluan, OTP, maklumat kad kredit atau butiran identiti.\n\nMesej ini biasanya kelihatan seperti datang daripada bank, e-wallet, syarikat kurier, agensi kerajaan atau platform dalam talian. Mangsa diarahkan ke laman web palsu yang menyerupai laman rasmi.\n\nApabila mangsa memasukkan maklumat, scammer boleh mengakses akaun, meluluskan transaksi atau mencuri identiti.",
      example: "Akaun CIMB anda telah digantung. Sahkan segera di cimb-secure-login.com"
    },
    {
      title: "💳 Scam Pinjaman Tidak Wujud",
      desc: "Scam ini menyasarkan individu yang memerlukan wang segera dengan menawarkan pinjaman mudah lulus, kadar faedah rendah dan syarat minimum.\n\nMangsa diberitahu pinjaman telah diluluskan, tetapi perlu membayar yuran pemprosesan, yuran guaman, duti setem, insurans atau deposit sebelum wang dilepaskan.\n\nSelepas bayaran dibuat, pinjaman tidak diberikan. Scammer mungkin menghilang atau terus meminta bayaran tambahan.",
      example: "Pinjaman RM50,000 anda telah diluluskan. Sila bayar RM800 yuran pemprosesan untuk pelepasan dana."
    },
    {
      title: "❤️ Love Scam",
      desc: "Love scam berlaku apabila scammer membina hubungan romantik palsu melalui aplikasi dating atau media sosial. Mereka mengambil masa untuk membina kepercayaan emosi sebelum meminta wang.\n\nScammer mungkin mendakwa memerlukan bantuan untuk kos perubatan, perjalanan, masalah perniagaan, caj kastam atau kecemasan keluarga.\n\nAda juga yang mendakwa telah menghantar hadiah mahal atau bungkusan wang tunai yang ditahan kastam dan memerlukan bayaran pelepasan.",
      example: "Saya perlukan bantuan bayar caj kastam supaya hadiah dan wang tunai boleh dihantar kepada awak."
    },
    {
      title: "💼 Scam Kerja Palsu",
      desc: "Scam kerja palsu mengiklankan kerja dari rumah, tugasan mudah atau peluang pendapatan tinggi dengan pengalaman minimum.\n\nMangsa mungkin diminta membayar yuran pendaftaran, latihan, deposit atau wang untuk membuka tugasan yang lebih tinggi. Sesetengah scam membayar jumlah kecil pada awalnya untuk membina kepercayaan.\n\nAkhirnya, mangsa diminta memasukkan jumlah lebih besar, pengeluaran disekat, atau scammer menghilang.",
      example: "Jana RM300 sehari dari rumah dengan tugasan mudah. Kekosongan terhad."
    },
    {
      title: "🏦 Scam Aplikasi Pinjaman Dalam Talian",
      desc: "Scam aplikasi pinjaman dalam talian menggunakan laman web atau aplikasi palsu yang kelihatan seperti pemberi pinjaman sah. Mangsa dijanjikan kelulusan segera dan wang tunai cepat.\n\nMangsa mungkin diminta menyerahkan kad pengenalan, swafoto, penyata bank atau slip gaji. Dokumen ini boleh disalahgunakan untuk kecurian identiti, penipuan atau ugutan.\n\nMangsa juga mungkin diminta membayar yuran awal sebelum pinjaman dilepaskan, tetapi wang pinjaman tidak pernah diterima.",
      example: "Aplikasi pinjaman segera. Tiada dokumen diperlukan. Terima tunai dalam 10 minit."
    },
    {
      title: "📦 Scam Parcel",
      desc: "Scam parcel biasanya bermula dengan panggilan, SMS atau WhatsApp yang mendakwa bungkusan mangsa ditahan oleh kastam, syarikat kurier atau pihak berkuasa.\n\nScammer mungkin mendakwa bungkusan mengandungi barang terlarang, caj kastam belum dibayar atau barangan mencurigakan. Mangsa ditekan untuk membayar denda, memberi maklumat bank atau bekerjasama dengan pegawai palsu.\n\nSesetengah scam parcel boleh berkembang menjadi Macau scam apabila mangsa dituduh terlibat dalam jenayah.",
      example: "Parcel anda mengandungi barang terlarang. Bayar segera untuk elak siasatan polis."
    },
    {
      title: "🏢 Scam Penyamaran Organisasi",
      desc: "Scammer menyamar sebagai wakil bank, telco, e-wallet, agensi kerajaan, syarikat penghantaran atau jabatan khidmat pelanggan.\n\nMereka mendakwa terdapat masalah dengan akaun, langganan, bayaran balik, penghantaran atau proses pengesahan. Mangsa kemudian diminta memberikan kata laluan, OTP, butiran bank atau maklumat identiti.\n\nMaklumat tersebut kemudian digunakan untuk mengakses akaun, mencuri wang atau melakukan penipuan identiti.",
      example: "Pengesahan akaun Touch 'n Go eWallet diperlukan. Sila hantar OTP anda sekarang."
    },
    {
      title: "⚠️ Scam Ugutan Akaun Bank",
      desc: "Scam ini menggunakan ketakutan dan tekanan masa. Mangsa diberitahu bahawa akaun bank mereka dikaitkan dengan transaksi mencurigakan, aktiviti haram, cukai tertunggak atau siasatan jenayah.\n\nScammer mengugut akaun akan dibekukan, mangsa akan ditangkap, dikenakan tindakan undang-undang atau dibawa ke mahkamah jika tidak bertindak segera.\n\nMangsa mungkin diarahkan memindahkan wang ke akaun sementara atau akaun selamat, yang sebenarnya dimiliki oleh scammer.",
      example: "Akaun anda akan dibekukan dalam 2 jam jika anda tidak mengesahkan dana sekarang."
    },
    {
      title: "🎁 Scam Bantuan Kerajaan",
      desc: "Scam bantuan kerajaan mengambil kesempatan daripada program bantuan kewangan, subsidi, geran atau bayaran khas. Mangsa menerima mesej palsu yang mendakwa mereka layak menerima bantuan.\n\nMesej mungkin mengandungi pautan palsu yang menyerupai portal rasmi. Mangsa diminta memberi maklumat bank, maklumat identiti atau membayar yuran pemprosesan kecil.\n\nScam ini sering meningkat ketika keadaan ekonomi sukar, bencana atau apabila program bantuan sebenar sedang mendapat perhatian.",
      example: "Anda layak menerima RM1,500 bantuan khas. Sahkan sekarang untuk menerima bayaran."
    },
    {
      title: "🔐 Scam OTP",
      desc: "Scam OTP berlaku apabila scammer memperdaya mangsa supaya mendedahkan kata laluan sekali guna atau kod TAC daripada bank, e-wallet atau perkhidmatan dalam talian.\n\nScammer mungkin menyamar sebagai pegawai bank, khidmat pelanggan atau pasukan bayaran balik. Mereka mendakwa OTP diperlukan untuk pengesahan, pembatalan, proses bayaran balik atau keselamatan akaun.\n\nApabila OTP diberikan, scammer boleh meluluskan transaksi, menetapkan semula kata laluan atau mengakses akaun.",
      example: "Kami telah menghantar OTP untuk mengesahkan bayaran balik anda. Sila berikan kod tersebut segera."
    },
    {
      title: "💸 Scam Pindahan Dana Palsu",
      desc: "Dalam scam ini, scammer mendakwa mereka tersilap memindahkan wang ke akaun mangsa dan meminta wang itu dipulangkan dengan segera.\n\nMereka mungkin menghantar tangkap layar bank palsu atau resit transaksi yang dimanipulasi supaya pindahan kelihatan benar.\n\nMangsa yang tidak menyemak baki sebenar akaun bank mungkin akhirnya memindahkan wang sendiri kepada scammer.",
      example: "Saya tersilap pindahkan RM2,000 ke akaun awak. Tolong pulangkan segera."
    },
    {
      title: "🖥️ Scam Sokongan Teknikal",
      desc: "Scammer sokongan teknikal menyamar sebagai wakil Microsoft, syarikat antivirus, penyedia internet atau pasukan teknikal.\n\nMereka mendakwa komputer, telefon atau sambungan internet mangsa telah dijangkiti virus, digodam atau terjejas. Mangsa mungkin diminta memasang perisian akses jauh.\n\nSelepas akses diberikan, scammer boleh mencuri fail, kata laluan, maklumat bank atau memasang malware.",
      example: "Komputer anda telah dijangkiti malware berbahaya. Hubungi sokongan segera."
    },
    {
      title: "🎫 Scam Tiket Palsu",
      desc: "Scam tiket palsu melibatkan penjualan tiket konsert, acara sukan, taman tema, penerbangan atau acara popular yang sebenarnya tidak wujud atau tidak sah.\n\nScammer biasanya mengiklankan melalui media sosial, aplikasi mesej atau kumpulan jual beli semula dengan tawaran harga murah dan kuantiti terhad.\n\nSelepas bayaran dibuat, mangsa mungkin menerima tiket palsu, tiket pendua atau tidak menerima apa-apa. Scammer biasanya menyekat komunikasi selepas menerima wang.",
      example: "Tiket VIP Taylor Swift murah tersedia. Kuantiti terhad, pindahan bank sahaja."
    }
  ],

  zh: [
    {
      title: "💰 虚假投资骗局",
      desc: "虚假投资骗局通常承诺在短时间内获得不现实的高回报。骗子常伪装成投资代理、加密货币专家、外汇交易员，或看起来正规的公司代表。\n\n他们可能使用伪造的盈利截图、虚假见证、名人冒充、WhatsApp 群组、Telegram 频道和专业网站来建立信任。有些受害者一开始会收到小额回报，因此更容易相信并投入更大金额。\n\n当较大金额转入后，受害者通常无法提款，骗子会继续要求额外费用，或直接消失。",
      example: "使用我们的 AI 加密货币交易平台，7 天内赚取 RM15,000。名额有限。"
    },
    {
      title: "👮 澳门骗局",
      desc: "澳门骗局是指骗子冒充警察、国家银行官员、海关、法院或快递公司，谎称受害者涉及洗黑钱、毒品、逃税或非法交易。\n\n骗子会制造恐惧和紧迫感，要求受害者立即配合，并声称案件保密，不能告诉家人。他们也可能把电话转接给不同的假部门，让骗局看起来更真实。\n\n最后，受害者会被要求把钱转入所谓的安全账户进行调查，但这些账户其实由骗子控制。",
      example: "您的银行账户涉及洗黑钱活动。请立即转移资金以配合调查。"
    },
    {
      title: "📱 短信与电邮钓鱼骗局",
      desc: "钓鱼骗局利用假短信或假电邮盗取银行登入资料、密码、OTP、信用卡资料或身份信息。\n\n这些信息通常伪装成来自银行、电子钱包、快递公司、政府机构或线上平台。受害者会被引导到看似官方网站的假登录页面。\n\n一旦输入资料，骗子就可能登入账户、批准交易或盗用身份。",
      example: "您的 CIMB 账户已被暂停。请立即到 cimb-secure-login.com 验证。"
    },
    {
      title: "💳 不存在的贷款骗局",
      desc: "这类骗局针对急需资金的人，提供快速批准、低利息和低门槛贷款。\n\n受害者会被告知贷款已经批准，但必须先支付处理费、律师费、印花税、保险费或押金，款项才能发放。\n\n付款后，贷款不会到账。骗子可能消失，或继续要求更多费用。",
      example: "您的 RM50,000 贷款已批准。请先支付 RM800 处理费以释放款项。"
    },
    {
      title: "❤️ 爱情骗局",
      desc: "爱情骗局是骗子通过交友软件或社交媒体建立虚假的恋爱关系。他们会花时间建立感情信任，然后开始要求金钱帮助。\n\n骗子可能声称需要医药费、旅行费、生意周转、海关费或家庭紧急费用。\n\n有些骗子也会声称寄送贵重礼物或现金包裹，但包裹被海关扣留，需要受害者支付释放费。",
      example: "我需要帮忙支付海关费，礼物和现金包裹才能寄给你。"
    },
    {
      title: "💼 假招聘骗局",
      desc: "假招聘骗局宣传在家工作、简单线上任务或高收入机会，并声称不需要太多经验。\n\n受害者可能被要求支付注册费、培训费、押金，或先充值才能解锁更高收入任务。有些骗局一开始会支付小额报酬来建立信任。\n\n最终，受害者会被要求投入更大金额，提款被阻止，或骗子直接消失。",
      example: "在家完成简单任务，每天可赚 RM300。名额有限。"
    },
    {
      title: "🏦 网络贷款应用骗局",
      desc: "网络贷款应用骗局使用假网站或假手机应用，看起来像合法贷款机构。受害者被承诺即时批准和快速放款。\n\n他们可能被要求提交身份证、自拍照、银行结单或薪资单。这些文件之后可能被用于身份盗窃、诈骗或勒索。\n\n受害者也可能被要求先支付费用，贷款才会发放，但实际款项永远不会到账。",
      example: "即时批准贷款应用。无需文件。10 分钟内收到现金。"
    },
    {
      title: "📦 包裹骗局",
      desc: "包裹骗局通常以电话、短信或 WhatsApp 开始，声称受害者的包裹被海关、快递公司或执法单位扣留。\n\n骗子可能声称包裹含有违禁品、未付海关费或可疑物品。受害者会被迫支付罚款、提供银行资料，或配合假官员。\n\n有些包裹骗局会升级成澳门骗局，受害者进一步被指控涉及犯罪。",
      example: "您的包裹含有违禁物品。请立即付款以避免警方调查。"
    },
    {
      title: "🏢 冒充机构骗局",
      desc: "骗子冒充银行、电讯公司、电子钱包、政府机构、快递公司或客服部门。\n\n他们声称账户、订阅、退款、配送或验证流程出现问题，然后要求受害者提供密码、OTP、银行资料或身份信息。\n\n这些资料之后可能被用于登入账户、盗取金钱或进行身份诈骗。",
      example: "Touch 'n Go eWallet 账户需要验证。请立即提交您的 OTP。"
    },
    {
      title: "⚠️ 银行账户威胁骗局",
      desc: "这类骗局依赖恐惧和紧迫感。受害者会被告知银行账户涉及可疑交易、非法活动、未缴税款或刑事调查。\n\n骗子会威胁冻结账户、逮捕、法律行动或法院程序，要求受害者立刻行动。\n\n受害者可能被要求把钱转入临时账户或安全账户，但这些账户实际上属于骗子。",
      example: "如果您不立即验证资金，您的账户将在 2 小时内被冻结。"
    },
    {
      title: "🎁 政府援助骗局",
      desc: "政府援助骗局利用补助、津贴、拨款或特别援助计划来欺骗受害者。受害者会收到假信息，声称自己符合领取援助的资格。\n\n信息可能包含模仿官方门户的假链接。受害者会被要求提供银行资料、身份信息，或支付少量处理费。\n\n在经济困难、灾害或真正援助计划受到关注时，这类骗局通常会增加。",
      example: "您符合领取 RM1,500 特别援助的资格。请立即验证以收款。"
    },
    {
      title: "🔐 OTP 骗局",
      desc: "OTP 骗局是骗子诱骗受害者透露银行、电子钱包或线上服务发送的一次性密码或 TAC 码。\n\n骗子可能冒充银行职员、客服人员或退款团队，声称 OTP 是用于验证、取消交易、处理退款或保护账户安全。\n\n一旦受害者提供 OTP，骗子就能批准交易、重设密码或登入账户。",
      example: "我们已发送 OTP 来验证您的退款。请立即提供该验证码。"
    },
    {
      title: "💸 虚假转账骗局",
      desc: "在这类骗局中，骗子声称他们不小心把钱转入受害者账户，并要求受害者紧急退还。\n\n他们可能发送伪造的银行截图或被修改过的交易收据，让转账看起来真实。\n\n如果受害者没有确认自己的实际银行余额，可能会把自己的钱转给骗子。",
      example: "我不小心转了 RM2,000 到你的账户。请马上退还。"
    },
    {
      title: "🖥️ 技术支持骗局",
      desc: "技术支持骗子冒充 Microsoft、防毒软件公司、网络服务商或技术支援团队。\n\n他们声称受害者的电脑、手机或网络连接感染病毒、被黑客入侵或存在安全问题。受害者可能被要求安装远程控制软件。\n\n一旦给予远程访问权限，骗子就能盗取文件、密码、银行资料，或安装恶意软件。",
      example: "您的电脑感染了危险恶意软件。请立即联系技术支持。"
    },
    {
      title: "🎫 假票骗局",
      desc: "假票骗局涉及出售不存在或无效的演唱会、体育赛事、主题乐园、机票或热门活动门票。\n\n骗子通常通过社交媒体、聊天应用或转售群组发布低价和限量门票广告。\n\n付款后，受害者可能收到假票、重复票，或什么都收不到。骗子通常在收款后立即断联或封锁受害者。",
      example: "Taylor Swift VIP 门票便宜出售。数量有限，只接受银行转账。"
    }
  ]
};

function createDemoResult(input) {
  const lower = input.toLowerCase();
  const highRiskWords = ["otp", "password", "bank", "maybank", "cimb", "tng", "touch n go", "kwsp", "claim", "urgent", "verify", "prize", "parcel", "payment", "click", "link", "http"];
  const hits = highRiskWords.filter((word) => lower.includes(word));
  const score = Math.min(95, Math.max(25, hits.length * 14 + (lower.includes("http") ? 20 : 0)));

  if (score >= 70) {
    return {
      verdict: "LIKELY SCAM",
      riskScore: score,
      summary: "This message contains several scam indicators such as urgency, requests to click links, or references to banking/claims. Treat it as suspicious unless verified directly through official channels.",
      redFlags: [
        "It asks you to take action quickly or click a link.",
        "It may be impersonating a trusted Malaysian brand or authority.",
        "It could be trying to collect login, banking, or OTP information."
      ],
      whatToDo: [
        "Do not click the link or share personal details, passwords, or OTP codes.",
        "Contact the bank, courier, company, or authority using their official website or hotline.",
        "Check suspicious bank accounts using Semak Mule before making any payment."
      ],
      scamType: "Phishing / Impersonation Scam",
      officialLinks: [
        { label: "Semak Mule", url: "https://semak.mule.com.my/" },
        { label: "PDRM", url: "https://www.rmp.gov.my/" },
        { label: "BNM", url: "https://www.bnm.gov.my/" }
      ]
    };
  }

  if (score >= 40) {
    return {
      verdict: "POSSIBLE SCAM",
      riskScore: score,
      summary: "This message has some suspicious elements, but there is not enough information to confirm it is a scam. Verify it through official channels before responding.",
      redFlags: [
        "The message may be asking for action without enough context.",
        "There may be a link or request that should be verified first."
      ],
      whatToDo: [
        "Do not share sensitive details until you confirm the sender.",
        "Use official apps, websites, or phone numbers instead of links in the message."
      ],
      scamType: "Suspicious Message",
      officialLinks: [
        { label: "MCMC Complaint Portal", url: "https://aduan.skmm.gov.my/" },
        { label: "Semak Mule", url: "https://semak.mule.com.my/" }
      ]
    };
  }

  return {
    verdict: "LOOKS SAFE",
    riskScore: score,
    summary: "This message does not show strong scam indicators based on the text provided. Still be cautious if it asks for money, OTP codes, passwords, or personal information.",
    redFlags: [],
    whatToDo: [
      "Verify the sender if money or personal information is involved.",
      "Do not share OTP codes or passwords with anyone."
    ],
    scamType: null,
    officialLinks: [{ label: "Semak Mule", url: "https://semak.mule.com.my/" }]
  };
}

function RiskCircle({ score }) {
  const safeScore = Number.isFinite(Number(score)) ? Number(score) : 0;
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (safeScore / 100) * circ;
  const color = safeScore >= 70 ? "#FF3B30" : safeScore >= 40 ? "#FF9500" : "#34C759";

  return (
    <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 8px" }}>
      <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="#E5E5EA" strokeWidth="8" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "monospace", lineHeight: 1 }}>{safeScore}</span>
        <span style={{ fontSize: 10, color: "#8E8E93", fontWeight: 600, letterSpacing: "0.05em" }}>RISK</span>
      </div>
    </div>
  );
}

export default function ScamShield() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState("home");
  const [language, setLanguage] = useState("en");
  const t = UI_TEXT[language] || UI_TEXT.en;
  const [checkCount, setCheckCount] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxMJhfuI1Dj4OsIk_26YqmGsA1m6pUvWFbIhoBDJ1hN9konv4Q7f-ST6hdo4IS7PprlNQ/exec";

useEffect(() => {
  fetch(GOOGLE_SCRIPT_URL)
    .then((res) => res.json())
    .then((data) => {
      setCheckCount(data.totalChecks || 0);
    })
    .catch(console.error);
}, []);
  
  async function analyze() {
    const input = text.trim();

    if (!input) {
      setError("Please paste a suspicious message or URL first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/check-scam", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
  text: input,
  language
})
});

const data = await res.json();

if (!res.ok) {
  throw new Error(data.error || "Analysis failed.");
}

setResult(data);

      fetch(GOOGLE_SCRIPT_URL, {
  method: "POST",
  mode: "no-cors",
  headers: {
    "Content-Type": "text/plain"
  },
  body: JSON.stringify({
    action: "logCheck",
    language,
    text: input,
    verdict: data.verdict,
    riskScore: data.riskScore,
    scamType: data.scamType
  })
});

setCheckCount((current) => current + 1);
    } catch (e) {
      setError("Analysis failed: " + e.message);
    }

    setLoading(false);
  }
async function submitFeedback() {
  if (!feedback.trim()) return;

  setSendingFeedback(true);

  try {
    await fetch("https://script.google.com/macros/s/AKfycbxMJhfuI1Dj4OsIk_26YqmGsA1m6pUvWFbIhoBDJ1hN9konv4Q7f-ST6hdo4IS7PprlNQ/exec", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain"
      },
      body: JSON.stringify({
        action: "feedback",
        feedback
      })
    });

    setFeedback("");
    setFeedbackSent(true);

  } catch (err) {
    alert("Failed to send feedback.");
  }

  setSendingFeedback(false);
}
  function reset() {
    setResult(null);
    setText("");
    setError("");
  }

  const v = result ? VERDICTS[result.verdict] || VERDICTS["LOOKS SAFE"] : null;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#050d1a 0%,#0a1628 70%,#05120a 100%)", fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 60 }}>
      <div style={{ width: "100%", maxWidth: 760, padding: "24px 20px 0" }}>
        <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 26
  }}
>
  {/* LEFT SIDE */}
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <button
      onClick={() => setPage("home")}
      style={{
        background:
          page === "home"
            ? "linear-gradient(135deg,#00C864,#009950)"
            : "rgba(255,255,255,0.06)",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "10px 16px",
        borderRadius: 12,
        fontWeight: 700,
        cursor: "pointer",
        fontSize: 13
      }}
    >
      🛡️ {t.home}
    </button>

    <button
      onClick={() => setPage("learn")}
      style={{
        background:
          page === "learn"
            ? "linear-gradient(135deg,#00C864,#009950)"
            : "rgba(255,255,255,0.06)",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "10px 16px",
        borderRadius: 12,
        fontWeight: 700,
        cursor: "pointer",
        fontSize: 13
      }}
    >
      📚 {t.learn}
    </button>
  </div>

  {/* RIGHT SIDE */}
  <select
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
    style={{
     background: "#111827",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.18)",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 13,
    outline: "none"
    }}
  >
      <option style={{ background: "#ffffff", color: "#111827" }} value="en">
    English
  </option>
  <option style={{ background: "#ffffff", color: "#111827" }} value="ms">
    Bahasa Melayu
  </option>
  <option style={{ background: "#ffffff", color: "#111827" }} value="zh">
    中文
  </option>
  </select>
</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#00C864,#009950)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 4px 20px rgba(0,200,100,0.35)" }}>🛡️</div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>ScamShield (Beta)</div>
            <div style={{ fontSize: 11, color: "#00C864", fontWeight: 700, letterSpacing: "0.12em" }}>MALAYSIA</div>
          </div>
        </div>

        <h1 style={{ color: "#fff", fontSize: 34, lineHeight: 1.12, margin: "20px 0 10px", letterSpacing: "-0.04em" }}>
          {t.headline}
        </h1>

        <p style={{ color: "#9AAFC5", fontSize: 15, margin: "0 0 18px", lineHeight: 1.7 }}>
          {t.subtitle}
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {[
  { icon: "🇲🇾", text: t.feature1 },
  { icon: "⚡", text: t.feature2 },
  { icon: "🔒", text: t.feature3 },
  { icon: "🏛", text: t.feature4 }
].map((item, i) => (
  <div
    key={i}
    style={{
      background: "rgba(0,200,100,0.08)",
      border: "1px solid rgba(0,200,100,0.28)",
      color: "#D9FFE8",
      padding: "10px 14px",
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      gap: 8
    }}
  >
    <span>{item.icon}</span>
    <span>{item.text}</span>
  </div>
))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 6 }}>
         [
  {
    number: "1",
    title: t.step1Title,
    desc: t.step1Desc
  },
  {
    number: "2",
    title: t.step2Title,
    desc: t.step2Desc
  },
  {
    number: "3",
    title: t.step3Title,
    desc: t.step3Desc
  }
].map((card, i) => (
  <div
    key={i}
    style={{
      flex: 1,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 20,
      padding: 24,
      minWidth: 180
    }}
  >
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: "#00C864",
        color: "#001B09",
        fontWeight: 800,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18
      }}
    >
      {card.number}
    </div>

    <div
      style={{
        color: "#fff",
        fontWeight: 800,
        fontSize: 16,
        marginBottom: 6
      }}
    >
      {card.title}
    </div>

    <div
      style={{
        color: "#8FA5BC",
        fontSize: 14,
        lineHeight: 1.6
      }}
    >
      {card.desc}
    </div>
  </div>
))
        </div>
      </div>

      {page === "home" && (
        <div style={{ width: "100%", maxWidth: 600, padding: "20px 20px 0" }}>
          {!result ? (
            <div style={scamCardStyle}>
             
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t.placeholder}
                rows={8}
                style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "14px 16px", color: "#E5E5EA", fontSize: 14, fontFamily: "inherit", lineHeight: 1.65, resize: "none", outline: "none", boxSizing: "border-box" }}
              />

              {error && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(255,59,48,0.12)", borderRadius: 8, color: "#FF6B6B", fontSize: 13 }}>
                  {error}
                </div>
              )}

              <button onClick={analyze} disabled={loading || !text.trim()} style={{ width: "100%", marginTop: 14, padding: "15px 0", borderRadius: 12, fontSize: 15, fontWeight: 800, fontFamily: "inherit", border: "none", background: text.trim() && !loading ? "linear-gradient(135deg,#00C864,#009950)" : "rgba(0,200,100,0.2)", color: "#fff", cursor: text.trim() && !loading ? "pointer" : "not-allowed", boxShadow: text.trim() && !loading ? "0 4px 20px rgba(0,200,100,0.3)" : "none" }}>
                {loading ? t.analysing : t.checkButton}
              </button>

              <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>📊</span>
                  <div>
                    <div style={{ color: "#fff", fontSize: 16, fontWeight: 800 }}>{checkCount.toLocaleString()}</div>
                    <div style={{ color: "#7A8FA6", fontSize: 11 }}>{t.counter}</div>
                  </div>
                </div>
              </div>

              <p style={{ textAlign: "center", color: "#3D5166", fontSize: 11, marginTop: 12, lineHeight: 1.5 }}>
                ScamShield uses AI to assess risk. Results are advisory only. Always report to authorities if you suspect fraud.
              </p>
            </div>
          ) : (
            <div>
              <div style={{ borderRadius: 20, overflow: "hidden" }}>
                <div style={{ background: v.bg, padding: "20px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>VERDICT</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>{v.icon} {result.verdict}</div>
                </div>

                <div style={{ background: v.light, padding: 22 }}>
                  <RiskCircle score={result.riskScore} />

                  {result.scamType && (
                    <div style={{ textAlign: "center", marginBottom: 18 }}>
                      <span style={{ display: "inline-block", background: v.bg, color: "#fff", borderRadius: 20, padding: "4px 16px", fontSize: 12, fontWeight: 700 }}>{result.scamType}</span>
                    </div>
                  )}

                  <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: v.text, letterSpacing: "0.1em", marginBottom: 6 }}>SUMMARY</div>
                    <p style={{ margin: 0, fontSize: 15, color: "#1C1C1E", lineHeight: 1.65, fontWeight: 500 }}>{result.summary}</p>
                  </div>

                  {result.redFlags?.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#8E8E93", letterSpacing: "0.1em", marginBottom: 8 }}>🚩 WARNING SIGNS</div>
                      {result.redFlags.map((flag, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "#fff", borderRadius: 10, marginBottom: 6, borderLeft: "3px solid #FF3B30" }}>
                          <span style={{ fontSize: 13 }}>⚡</span>
                          <span style={{ fontSize: 13, color: "#3A3A3C", lineHeight: 1.5 }}>{flag}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {result.whatToDo?.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#8E8E93", letterSpacing: "0.1em", marginBottom: 8 }}>✅ WHAT TO DO</div>
                      {result.whatToDo.map((action, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "#fff", borderRadius: 10, marginBottom: 6, borderLeft: "3px solid #34C759" }}>
                          <span style={{ minWidth: 20, height: 20, background: "#34C759", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                          <span style={{ fontSize: 13, color: "#3A3A3C", lineHeight: 1.5 }}>{action}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {result.officialLinks?.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#8E8E93", letterSpacing: "0.1em", marginBottom: 8 }}>🏛️ OFFICIAL RESOURCES</div>
                      {result.officialLinks.map((link, i) => (
                        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: "#fff", borderRadius: 10, marginBottom: 6, border: "1px solid #E5E5EA", textDecoration: "none", color: "#007AFF", fontSize: 13, fontWeight: 600 }}>
                          <span>🔗 {link.label}</span>
                          <span>→</span>
                        </a>
                      ))}
                    </div>
                  )}

                  <div style={{ background: "linear-gradient(135deg,#050d1a,#0a1628)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                    <span style={{ fontSize: 26 }}>📞</span>
                    <div>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Scam Helpline: <span style={{ color: "#00C864" }}>997</span></div>
                      <div style={{ color: "#7A8FA6", fontSize: 12 }}>CCID Scam Response Centre</div>
                    </div>
                  </div>

                  <button onClick={reset} style={{ width: "100%", padding: "13px 0", borderRadius: 12, fontSize: 14, fontWeight: 700, fontFamily: "inherit", background: "transparent", border: "2px solid rgba(0,0,0,0.12)", color: "#3A3A3C", cursor: "pointer" }}>
                    Check Another Message
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 18, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16 }}>
                <div style={{ color: "#fff", fontWeight: 800, marginBottom: 6, fontSize: 15 }}>💬 Feedback & Suggestions</div>
                <div style={{ color: "#7A8FA6", fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>Help improve ScamShield by sharing feedback or reporting issues.</div>

                <textarea
  value={feedback}
  onChange={(e) => setFeedback(e.target.value)}
  placeholder="Share your feedback..."
  rows={4}
  style={{
    width: "100%",
    background: "rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "12px 14px",
    color: "#fff",
    resize: "none",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box"
  }}
/>

               {!feedbackSent ? (
  <button
    onClick={submitFeedback}
    disabled={sendingFeedback || !feedback.trim()}
    style={{
      marginTop: 12,
      display: "inline-block",
      background: "linear-gradient(135deg,#00C864,#009950)",
      color: "#fff",
      border: "none",
      textDecoration: "none",
      padding: "10px 16px",
      borderRadius: 12,
      fontWeight: 700,
      fontSize: 13,
      cursor: sendingFeedback || !feedback.trim() ? "not-allowed" : "pointer",
      opacity: sendingFeedback || !feedback.trim() ? 0.6 : 1
    }}
  >
    {sendingFeedback ? "Sending..." : "Send Feedback"}
  </button>
) : (
  <div style={{ marginTop: 12, color: "#00C864", fontWeight: 700, fontSize: 13 }}>
    ✅ Thank you for your feedback!
  </div>
)}
              </div>

              <p style={{ textAlign: "center", color: "#3D5166", fontSize: 11, marginTop: 12, lineHeight: 1.6, padding: "0 8px" }}>
                ScamShield uses AI to assess risk. Results are advisory only. Always report to authorities if you suspect fraud.
              </p>
            </div>
          )}
        </div>
      )}

      {page === "learn" && (
        <div style={{ width: "100%", maxWidth: 760, padding: "20px" }}>
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, padding: 26 }}>
            <h2 style={{ color: "#fff", fontSize: 30, marginBottom: 8 }}>
  📚 {t.educationTitle}
</h2>

<p style={{ color: "#8FA5BC", lineHeight: 1.7, marginBottom: 24 }}>
  {t.educationSubtitle}
</p>

           {(SCAM_TYPES[language] || SCAM_TYPES.en).map((item, i) => (
              <details key={i} style={detailBoxStyle}>
                <summary style={{ color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 16 }}>
                  {item.title}
                </summary>

                <div style={{ marginTop: 14, color: "#C3D1DE", lineHeight: 1.75, fontSize: 14 }}>
                  {item.desc.split("\n\n").map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}

                  <strong style={{ color: "#fff" }}>{t.example}</strong>

                  <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 12, marginTop: 8, color: "#E5E5EA" }}>
                    “{item.example}”
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}   
            {page === "privacy" && (
        <div style={{ width: "100%", maxWidth: 760, padding: "20px" }}>
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 22,
            padding: 26,
            color: "#C3D1DE",
            lineHeight: 1.75,
            fontSize: 14
          }}>
            <h2 style={{ color: "#fff", fontSize: 30, marginBottom: 8 }}>
  {t.privacy}
</h2>

<p>
  ScamShield Malaysia helps users check suspicious messages for possible scam indicators. This Privacy Policy explains how information is handled when you use this website.
</p>

<h3 style={{ color: "#fff" }}>Messages submitted for analysis</h3>
<p>
  When you paste a message into the scam checker, the message is sent to our backend API and then processed by a third-party AI provider to generate a scam risk assessment. You should not submit passwords, OTP codes, banking credentials, identity card numbers, or other highly sensitive personal information. Submitted scam messages may be stored for analytics, scam trend monitoring, and improving ScamShield detection quality.
</p>

<h3 style={{ color: "#fff" }}>Usage counter</h3>
<p>
  ScamShield records the number of scam checks performed using a Google Sheets-based counter. This is used to show general usage activity and does not identify individual users.
</p>

<h3 style={{ color: "#fff" }}>Feedback</h3>
<p>
  If you submit feedback, your feedback message may be saved into a Google Sheet for review and product improvement. Please do not include sensitive personal, banking, or security information in feedback.
</p>

<h3 style={{ color: "#fff" }}>Third-party services</h3>
<p>
  ScamShield may use third-party services such as Vercel for hosting, an AI API provider for scam analysis, and Google Sheets / Google Apps Script for storing feedback and usage counts.
</p>

<h3 style={{ color: "#fff" }}>Contact</h3>
<p>
  For privacy-related questions, contact: life.alexchoo@gmail.com
</p>
          </div>
        </div>
      )}

      {page === "disclaimer" && (
        <div style={{ width: "100%", maxWidth: 760, padding: "20px" }}>
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 22,
            padding: 26,
            color: "#C3D1DE",
            lineHeight: 1.75,
            fontSize: 14
          }}>
            <h2 style={{ color: "#fff", fontSize: 30, marginBottom: 8 }}>
  {t.disclaimer}
</h2>

<p>
  ScamShield Malaysia provides AI-assisted scam awareness and risk analysis for educational purposes only. Results are advisory and should not be treated as legal, financial, cybersecurity, banking, or law enforcement advice.
</p>

<h3 style={{ color: "#fff" }}>Accuracy</h3>
<p>
  Scam detection results may not always be correct. A scam message may be missed, and a legitimate message may be flagged as suspicious. False positives and false negatives are possible.
</p>

<h3 style={{ color: "#fff" }}>User responsibility</h3>
<p>
  Do not rely solely on ScamShield before making payments, clicking links, sharing personal details, or responding to suspicious messages. Always verify directly through official websites, official apps, banks, or relevant authorities.
</p>

<h3 style={{ color: "#fff" }}>AI limitations</h3>
<p>
  ScamShield uses AI to assess text patterns and risk indicators. The analysis may be affected by incomplete information, misleading wording, language ambiguity, or new scam tactics.
</p>

<h3 style={{ color: "#fff" }}>Urgent scam cases</h3>
<p>
  If you believe you have been scammed, contact your bank immediately and call the National Scam Response Centre at 997 where applicable. You may also check suspicious bank accounts using Semak Mule and report relevant cases to the authorities.
</p>

<h3 style={{ color: "#fff" }}>No guarantee</h3>
<p>
  ScamShield does not guarantee scam prevention, fund recovery, official verification, or complete accuracy of any analysis.
</p>
          </div>
        </div>
      )}   
      <div style={{
        marginTop: 30,
        display: "flex",
        gap: 16,
        justifyContent: "center",
        flexWrap: "wrap",
        color: "#5E7389",
        fontSize: 12
      }}>
        <button onClick={() => setPage("privacy")} style={footerButtonStyle}>
          {t.privacy}
        </button>

        <span style={{ color: "#3D5166" }}>•</span>

        <button onClick={() => setPage("disclaimer")} style={footerButtonStyle}>
          {t.disclaimer}
        </button>
      </div>
    </div>
  );
}
