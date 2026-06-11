export type Lang = 'en' | 'fr' | 'rw';

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
];

export const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      contact: 'Contact Us',
      requestPickup: 'Request pickup',
    },
    hero: {
      subtitle: 'Smarter waste management for a sustainable future',
      subtitle2: 'Building eco-friendly communities across Rwanda',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
    },
    about: {
      title: 'About Us',
      desc: 'EcoTrack is a digital platform created to transform how waste is collected, tracked, and managed across Rwanda. It bridges the gap between households, companies, and private garbage collection companies by providing a modern and reliable technology solution.',
      exploreMore: 'Explore More',
      mission: {
        title: 'Our Mission',
        desc: "EcoTrack is committed to revolutionizing waste collection in Rwanda's technology. We empower citizens, companies, and private garbage collectors for a cleaner, healthier, and more sustainable future. Our vision is a Rwanda where smart waste management brings vibrant and eco-friendly communities.",
        tagline: 'EcoTrack - for sustainable Rwanda',
      },
      stats: {
        title: "Helping a local village keeping it's cleanness",
        sub: 'We reached here with our hard work and dedication',
        members: 'Members',
        partnerships: 'Partnerships',
        companies: 'Waste collectors companies',
        districts: 'Districts',
      },
      partners: {
        title: 'Our Partners',
        desc: 'We have been working with some Fortune 5+ organisations',
      },
    },
    services: {
      title: 'Our services',
      subtitle: 'Save Time Managing Your waste collecting With Our Best Services',
      items: [
        {
          title: 'Real-Time Alerts & Schedule',
          description: 'Citizens receive timely SMS/App reminders and alerts for their specific collection day. They can also view the exact upcoming date and route status.',
        },
        {
          title: 'Effortless Digital Payments',
          description: 'Seamless, integrated payment via popular mobile money channels, coupled with an easily accessible history of all past payments.',
        },
        {
          title: 'Instant Reporting & Resolution for Missed Pickups',
          description: 'A direct portal for citizens to instantly report a missed collection or request a one-off extra pickup for special waste.',
        },
      ],
    },
    contact: {
      badge: 'Contact Us',
      title: 'Get In Touch',
      desc: "Have a question or need support? We're here to help. Send us a message and we'll get back to you as soon as possible.",
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      support: '24/7 Support',
      form: {
        fullName: 'Full Name',
        emailAddr: 'Email Address',
        subject: 'Subject',
        message: 'Message',
        placeholderName: 'John Doe',
        placeholderSubject: 'How can we help?',
        placeholderMessage: 'Write your message here...',
        send: 'Send Message',
      },
      success: {
        title: 'Message Sent!',
        desc: "Thank you for reaching out. We'll respond within 24 hours.",
      },
    },
    footer: {
      desc: 'Transforming waste management in Rwanda through innovative technology and sustainable practices.',
      quickLinks: 'Quick Links',
      services: 'Services',
      contactInfo: 'Contact Info',
      support: '24/7 Support',
      links: { home: 'Home', aboutUs: 'About Us', services: 'Services', contact: 'Contact' },
      serviceItems: [
        'Real-Time Alerts & Schedule',
        'Effortless Digital Payments',
        'Instant Reporting & Resolution for Missed Pickups',
      ],
      newsletter: {
        title: 'Stay Updated',
        desc: 'Subscribe to our newsletter for the latest updates on sustainable waste management.',
        placeholder: 'Your email address',
        subscribe: 'Subscribe',
      },
      copyright: '© 2025 EcoTrack - Creating a cleaner Rwanda through technology',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
    },
  },

  fr: {
    nav: {
      home: 'Accueil',
      about: 'À propos',
      services: 'Services',
      contact: 'Contactez-nous',
      requestPickup: 'Demander un ramassage',
    },
    hero: {
      subtitle: 'Gestion des déchets plus intelligente pour un avenir durable',
      subtitle2: 'Construire des communautés écologiques à travers le Rwanda',
      getStarted: 'Commencer',
      learnMore: 'En savoir plus',
    },
    about: {
      title: 'À propos de nous',
      desc: "EcoTrack est une plateforme numérique créée pour transformer la collecte, le suivi et la gestion des déchets au Rwanda. Elle comble le fossé entre les ménages, les communes et les entreprises privées de collecte des ordures grâce à une solution technologique moderne et fiable.",
      exploreMore: 'Explorer plus',
      mission: {
        title: 'Notre mission',
        desc: "EcoTrack s'engage à révolutionner la collecte des déchets au Rwanda. Nous donnons du pouvoir aux citoyens, aux communes et aux collecteurs privés pour un avenir plus propre, plus sain et plus durable. Notre vision est un Rwanda où une gestion intelligente des déchets crée des communautés dynamiques et écologiques.",
        tagline: 'EcoTrack - pour un Rwanda durable',
      },
      stats: {
        title: 'Aider un village local à maintenir sa propreté',
        sub: 'Nous avons atteint cela grâce à notre travail acharné et notre dévouement',
        members: 'Membres',
        partnerships: 'Partenariats',
        companies: 'Entreprises de collecte',
        districts: 'Districts',
      },
      partners: {
        title: 'Nos Partenaires',
        desc: 'Nous avons travaillé avec des organisations Fortune 5+',
      },
    },
    services: {
      title: 'Nos services',
      subtitle: 'Gagnez du temps dans la gestion de vos déchets avec nos meilleurs services',
      items: [
        {
          title: 'Alertes et Calendrier en Temps Réel',
          description: 'Les citoyens reçoivent des rappels et alertes SMS/App ponctuels pour leur jour de collecte spécifique. Ils peuvent également consulter la date exacte et l\'état de la route.',
        },
        {
          title: 'Paiements Numériques Simplifiés',
          description: 'Paiement intégré et transparent via les canaux populaires de mobile money, avec un historique facilement accessible de tous les paiements passés.',
        },
        {
          title: 'Signalement et Résolution Instantanés pour les Ramassages Manqués',
          description: 'Un portail direct permettant aux citoyens de signaler instantanément une collecte manquée ou de demander un ramassage supplémentaire pour des déchets spéciaux.',
        },
      ],
    },
    contact: {
      badge: 'Contactez-nous',
      title: 'Nous Contacter',
      desc: "Vous avez une question ou avez besoin d'aide ? Nous sommes là pour vous aider. Envoyez-nous un message et nous vous répondrons dès que possible.",
      address: 'Adresse',
      phone: 'Téléphone',
      email: 'Email',
      support: 'Support 24h/7',
      form: {
        fullName: 'Nom complet',
        emailAddr: 'Adresse email',
        subject: 'Sujet',
        message: 'Message',
        placeholderName: 'Jean Dupont',
        placeholderSubject: 'Comment pouvons-nous aider ?',
        placeholderMessage: 'Écrivez votre message ici...',
        send: 'Envoyer le message',
      },
      success: {
        title: 'Message envoyé !',
        desc: 'Merci de nous avoir contacté. Nous vous répondrons dans les 24 heures.',
      },
    },
    footer: {
      desc: 'Transformer la gestion des déchets au Rwanda grâce à une technologie innovante et des pratiques durables.',
      quickLinks: 'Liens rapides',
      services: 'Services',
      contactInfo: 'Informations de contact',
      support: 'Support 24h/7',
      links: { home: 'Accueil', aboutUs: 'À propos', services: 'Services', contact: 'Contact' },
      serviceItems: [
        'Alertes et Calendrier en Temps Réel',
        'Paiements Numériques Simplifiés',
        'Signalement et Résolution Instantanés',
      ],
      newsletter: {
        title: 'Restez informé',
        desc: "Abonnez-vous à notre newsletter pour les dernières mises à jour sur la gestion durable des déchets.",
        placeholder: 'Votre adresse email',
        subscribe: "S'abonner",
      },
      copyright: '© 2025 EcoTrack - Créer un Rwanda plus propre grâce à la technologie',
      privacy: 'Politique de confidentialité',
      terms: "Conditions d'utilisation",
    },
  },

  rw: {
    nav: {
      home: 'Ahabanza',
      about: 'Abo turi bo',
      services: 'Serivisi',
      contact: 'Twandikire',
      requestPickup: 'Saba gukusanywa',
    },
    hero: {
      subtitle: 'Gucunga imyanda neza kugirango ejo hazaza habe heza',
      subtitle2: 'Kubaka imiryango ihuza n\'ibidukikije mu Rwanda hose',
      getStarted: 'Tangira',
      learnMore: 'Menya byinshi',
    },
    about: {
      title: 'Abo turi bo',
      desc: 'EcoTrack ni platform ya dijitale yakozwe kugirango ihindure uburyo imyanda ikusanyirwa, gukurikiranwa no gucungwa mu Rwanda. Ihugura ingo, ibigo n\'ibigo bigenga gukusanya imyanda binyuze mu ikoranabuhanga rishya kandi rikwiye.',
      exploreMore: 'Reba byinshi',
      mission: {
        title: 'Intego yacu',
        desc: "EcoTrack izihutisha guhindura gukusanya imyanda mu Rwanda. Tujyana imbere abaturage, ibigo n'abakusanya imyanda kugirango ejo hazaza habe isuku, ubuzima bwiza n'uburambe. Icyerekezo cyacu ni Rwanda aho gucunga imyanda neza bigenesha imiryango yuzuye ubuzima n'ibidukikije.",
        tagline: 'EcoTrack - kugirango Rwanda ikomeze',
      },
      stats: {
        title: 'Gufasha umudugudu gukomeza isuku yawo',
        sub: 'Twegereje hano binyuze mu akazi kacu n\'intashyikirwa',
        members: 'Abanyamuryango',
        partnerships: 'Ubufatanye',
        companies: 'Ibigo bikusanya imyanda',
        districts: 'Akarere',
      },
      partners: {
        title: 'Inshuti zacu',
        desc: 'Twakurikiranye imirimo n\'ibigo binini byane',
      },
    },
    services: {
      title: 'Serivisi zacu',
      subtitle: 'Bana igihe cyo gucunga imyanda yanyu binyuze mu serivisi zacu nziza',
      items: [
        {
          title: 'Imenyesha n\'Igenamigambi mu Gihe Nyacyo',
          description: 'Abaturage babona SMS/App zibabwira igihe cy\'isoko rya imyanda. Barashobora kandi kureba igenamigambi ryuzuye n\'imimerere y\'inzira.',
        },
        {
          title: 'Kwishyura neza mu buryo bwa dijitali',
          description: 'Kwishyura by\'umwihariko binyuze kuri mobile money, hamwe na amateka yose y\'ubwishyu bwakozwe mbere.',
        },
        {
          title: 'Gutanga Raporo no Gukemura Byihuse igihe Isoko Ribuze',
          description: 'Uburyo buziguye bw\'abaturage gutanga raporo y\'isoko ribuze cyangwa gusaba gukusanywa inshuro imwe kugirango babike imyanda idasanzwe.',
        },
      ],
    },
    contact: {
      badge: 'Twandikire',
      title: 'Twuzuzanamwe',
      desc: 'Ufite ikibazo cyangwa ukeneye ubufasha? Turi hano kugufasha. Tuhereze ubutumwa kandi tuzakusubiza vuba gushoboka.',
      address: 'Aderesi',
      phone: 'Telefoni',
      email: 'Imeli',
      support: 'Serivisi 24/7',
      form: {
        fullName: 'Amazina yombi',
        emailAddr: 'Aderesi ya imeli',
        subject: 'Insanganyamatsiko',
        message: 'Ubutumwa',
        placeholderName: 'Kagabo Jean',
        placeholderSubject: 'Twagufasha gute?',
        placeholderMessage: 'Andika ubutumwa bwawe hano...',
        send: 'Ohereza ubutumwa',
      },
      success: {
        title: 'Ubutumwa bwoherejwe!',
        desc: 'Murakoze kutwandikira. Tuzasubiza mu masaha 24.',
      },
    },
    footer: {
      desc: 'Guhindura uburyo bwo gucunga imyanda mu Rwanda binyuze mu ikoranabuhanga rishya n\'imikorere ikomera.',
      quickLinks: 'Itumanaho ryihuse',
      services: 'Serivisi',
      contactInfo: 'Amakuru yo kutugeraho',
      support: 'Serivisi 24/7',
      links: { home: 'Ahabanza', aboutUs: 'Abo turi bo', services: 'Serivisi', contact: 'Twandikire' },
      serviceItems: [
        'Imenyesha n\'Igenamigambi mu Gihe Nyacyo',
        'Kwishyura neza mu buryo bwa dijitali',
        'Gutanga Raporo no Gukemura Byihuse',
      ],
      newsletter: {
        title: 'Komeza uhabwa amakuru',
        desc: 'Iyandikishe kuri leta yacu kugirango uhabwe amakuru mashya y\'imicungire y\'imyanda ikomera.',
        placeholder: 'Aderesi yawe ya imeli',
        subscribe: 'Iyandikishe',
      },
      copyright: '© 2025 EcoTrack - Gukora Rwanda isafi binyuze mu ikoranabuhanga',
      privacy: 'Politiki y\'ibanga',
      terms: 'Amategeko n\'amabwiriza',
    },
  },
} as const;

export type T = typeof translations.en;
