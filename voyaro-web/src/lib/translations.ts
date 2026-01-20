// Bilingual translations - Georgian (ka) and English (en)

export type Language = 'ka' | 'en'

export type BilingualText = { ka: string; en: string }

export const t = {
  // Common
  common: {
    loading: { ka: 'იტვირთება...', en: 'Loading...' },
    save: { ka: 'შენახვა', en: 'Save' },
    cancel: { ka: 'გაუქმება', en: 'Cancel' },
    delete: { ka: 'წაშლა', en: 'Delete' },
    edit: { ka: 'რედაქტირება', en: 'Edit' },
    submit: { ka: 'გაგზავნა', en: 'Submit' },
    back: { ka: 'უკან', en: 'Back' },
    next: { ka: 'შემდეგი', en: 'Next' },
    yes: { ka: 'დიახ', en: 'Yes' },
    no: { ka: 'არა', en: 'No' },
  },

  // Navigation
  nav: {
    login: { ka: 'შესვლა', en: 'Login' },
    logout: { ka: 'გასვლა', en: 'Logout' },
    getStarted: { ka: 'დაწყება', en: 'Get Started' },
    goToDashboard: { ka: 'პანელზე გადასვლა', en: 'Go to Dashboard' },
  },

  // Landing Page
  landing: {
    heroTitle: { ka: 'ჯგუფური მოგზაურობა,', en: 'Group Travel,' },
    heroTitleHighlight: { ka: 'გამარტივებული', en: 'Simplified' },
    heroDescription: {
      ka: 'დაგეგმეთ მოგზაურობა მეგობრებთან ერთად, იპოვეთ საუკეთესო თარიღები ყველასთვის და მიეცით ტურისტულ კომპანიებს საშუალება იბრძოლონ თქვენს ბიზნესზე ჩვენი უნიკალური აუქციონის სისტემის მეშვეობით.',
      en: 'Plan trips with friends, find the best dates for everyone, and let tour companies compete for your business through our unique auction system.',
    },
    planTrip: { ka: 'დაგეგმე მოგზაურობა', en: 'Plan a Trip' },
    forTourCompanies: { ka: 'ტურისტული კომპანიებისთვის', en: 'For Tour Companies' },

    // How it works
    howItWorks: { ka: 'როგორ მუშაობს მოგზაურებისთვის', en: 'How It Works for Travelers' },
    createTrip: { ka: 'შექმენი მოგზაურობა', en: 'Create a Trip' },
    createTripDesc: {
      ka: 'მიუთითე დანიშნულება, მოიწვიე მეგობრები და გააზიარე უნიკალური მოწვევის ლინკი',
      en: 'Set your destination, invite friends, and share a unique invite link',
    },
    collectPreferences: { ka: 'შეაგროვე პრეფერენციები', en: 'Collect Preferences' },
    collectPreferencesDesc: {
      ka: 'ყველა მიუთითებს თავის ხელმისაწვდომ თარიღებსა და მოგზაურობის პრეფერენციებს',
      en: 'Everyone submits their available dates and travel preferences',
    },
    startAuction: { ka: 'დაიწყე აუქციონი', en: 'Start Auction' },
    startAuctionDesc: {
      ka: 'გამოაცხადე 48-საათიანი აუქციონი და მიიღე კონკურენტული შეთავაზებები ტურისტული კომპანიებისგან',
      en: 'Launch a 48-hour auction and receive competing offers from tour companies',
    },
    chooseBook: { ka: 'აირჩიე და დაჯავშნე', en: 'Choose & Book' },
    chooseBookDesc: {
      ka: 'მიეცი ხმა ჯგუფთან ერთად საუკეთესო შეთავაზებას და დაჯავშნე შენი ოცნების მოგზაურობა',
      en: 'Vote with your group on the best offer and book your dream trip',
    },

    // For Tour Companies
    forCompanies: { ka: 'ტურისტული კომპანიებისთვის', en: 'For Tour Companies' },
    discoverGroups: { ka: 'აღმოაჩინე ჯგუფები', en: 'Discover Groups' },
    discoverGroupsDesc: {
      ka: 'იპოვე ჯგუფები, რომლებიც ეძებენ მოგზაურობის გამოცდილებას, რომელიც შეესაბამება შენს მიმართულებებსა და ექსპერტიზას',
      en: 'Find groups looking for travel experiences that match your destinations and expertise',
    },
    submitOffers: { ka: 'გააგზავნე შეთავაზებები', en: 'Submit Offers' },
    submitOffersDesc: {
      ka: 'იბრძოლე აუქციონებში საუკეთესო შეთავაზებების გაგზავნით დეტალური მარშრუტებითა და ფასებით',
      en: 'Compete in auctions by submitting your best offers with detailed itineraries and pricing',
    },
    winBusiness: { ka: 'მოიგე ბიზნესი', en: 'Win Business' },
    winBusinessDesc: {
      ka: 'მოიგე მოგზაურობები კონკურენტული ფასებით, შესანიშნავი მიმოხილვებითა და ჯგუფის პრეფერენციებთან შესაბამისობით',
      en: 'Win trips through competitive pricing, great reviews, and matching group preferences',
    },
    registerCompany: { ka: 'დაარეგისტრირე კომპანია', en: 'Register Your Company' },

    // Pricing
    pricingTitle: { ka: 'კომპანიის გამოწერის გეგმები', en: 'Company Subscription Plans' },
    pricingDescription: {
      ka: 'აირჩიე გეგმა, რომელიც შეესაბამება შენს ბიზნესს. დაიწყე უფასოდ და განახლდი ზრდისას.',
      en: 'Choose the plan that fits your business. Start free and upgrade as you grow.',
    },
    free: { ka: 'უფასო', en: 'Free' },
    perfectForStarting: { ka: 'იდეალურია დასაწყებად', en: 'Perfect for getting started' },
    bidsPerMonth: { ka: 'წინადადება თვეში', en: 'bids per month' },
    basicProfile: { ka: 'ძირითადი კომპანიის პროფილი', en: 'Basic company profile' },
    emailSupport: { ka: 'ელ-ფოსტის მხარდაჭერა', en: 'Email support' },
    pro: { ka: 'პრო', en: 'Pro' },
    popular: { ka: 'პოპულარული', en: 'Popular' },
    forGrowingCompanies: { ka: 'მზარდი ტურისტული კომპანიებისთვის', en: 'For growing tour companies' },
    unlimitedBids: { ka: 'შეუზღუდავი წინადადებები', en: 'Unlimited bids' },
    prioritySupport: { ka: 'პრიორიტეტული მხარდაჭერა', en: 'Priority support' },
    analyticsDashboard: { ka: 'ანალიტიკის პანელი', en: 'Analytics dashboard' },
    customBranding: { ka: 'მორგებული ბრენდინგი', en: 'Custom branding' },
    premium: { ka: 'პრემიუმ', en: 'Premium' },
    forEnterprise: { ka: 'საწარმოს ტურ-ოპერატორებისთვის', en: 'For enterprise tour operators' },
    everythingInPro: { ka: 'ყველაფერი პროში', en: 'Everything in Pro' },
    featuredPlacement: { ka: 'გამორჩეული განთავსება', en: 'Featured placement' },
    dedicatedManager: { ka: 'გამოყოფილი ანგარიშის მენეჯერი', en: 'Dedicated account manager' },
    apiAccess: { ka: 'API წვდომა', en: 'API access' },
  },

  // Auth
  auth: {
    welcomeBack: { ka: 'კეთილი იყოს შენი დაბრუნება', en: 'Welcome back' },
    enterCredentials: { ka: 'შეიყვანე მონაცემები ანგარიშზე წვდომისთვის', en: 'Enter your credentials to access your account' },
    email: { ka: 'ელ-ფოსტა', en: 'Email' },
    password: { ka: 'პაროლი', en: 'Password' },
    signIn: { ka: 'შესვლა', en: 'Sign In' },
    noAccount: { ka: 'არ გაქვს ანგარიში?', en: "Don't have an account?" },
    signUpTraveler: { ka: 'დარეგისტრირდი როგორც მოგზაური', en: 'Sign up as Traveler' },
    or: { ka: 'ან', en: 'or' },
    registerCompany: { ka: 'დაარეგისტრირე კომპანია', en: 'Register Company' },
  },

  // Footer
  footer: {
    allRightsReserved: { ka: 'ყველა უფლება დაცულია.', en: 'All rights reserved.' },
  },
}
