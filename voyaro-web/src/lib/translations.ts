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
    // Hero
    heroTagline: { ka: 'ჯგუფური მოგზაურობა გამარტივებული', en: 'Group travel made simple' },
    heroTitle1: { ka: 'დაგეგმე ერთი მოგზაურობა.', en: 'Plan one trip.' },
    heroTitle2: { ka: 'მიიღე მრავალი შეთავაზება.', en: 'Get multiple offers.' },
    heroTitle3: { ka: 'აირჩიე საუკეთესო.', en: 'Choose the best.' },
    heroDescription: {
      ka: 'Voyaro ეხმარება ჯგუფებს დაგეგმონ მოგზაურობა ერთად და მიიღონ კონკურენტული შეთავაზებები ვერიფიცირებული ადგილობრივი ტურისტული კომპანიებისგან.',
      en: 'Voyaro helps groups plan trips together and receive competing offers from verified local tour companies.',
    },
    noSearching: { ka: 'ძებნის გარეშე.', en: 'No searching.' },
    noArguing: { ka: 'კამათის გარეშე.', en: 'No arguing.' },
    noOverpaying: { ka: 'ზედმეტი გადახდის გარეშე.', en: 'No overpaying.' },
    startTripFree: { ka: 'დაიწყე მოგზაურობა — უფასოდ', en: 'Start a Trip — Free' },

    // Sub-hero
    subHeroText: {
      ka: 'Voyaro არის ჯგუფური მოგზაურობის მარკეტპლეისი, სადაც ტურისტული კომპანიები იბრძვიან შენს მოგზაურობაზე — და არა პირიქით.',
      en: 'Voyaro is a group travel marketplace where tour companies compete for your trip — not the other way around.',
    },

    // How it works
    howItWorks: { ka: 'როგორ მუშაობს', en: 'How It Works' },
    createTrip: { ka: 'შექმენი ჯგუფური მოგზაურობა', en: 'Create a group trip' },
    createTripDesc: {
      ka: 'აირჩიე დანიშნულების იდეები, თარიღები, ბიუჯეტი და აქტივობები მარტივი ვიზუალური თეგებით. მოიწვიე მეგობრები და მიეცი ყველას საშუალება დაამატოს თავისი ხელმისაწვდომობა.',
      en: 'Choose destination ideas, dates, budget, and activities using simple visual tags. Invite friends and let everyone add their availability.',
    },
    agreeAsGroup: { ka: 'შეთანხმდით ერთხელ ჯგუფად', en: 'Agree once as a group' },
    agreeAsGroupDesc: {
      ka: 'Voyaro ავტომატურად პოულობს საუკეთესო თარიღებს ყველასთვის და აშენებს ჯგუფური მოგზაურობის პროფილს. არანაირი უსასრულო ჩატები. არანაირი დაბნეულობა.',
      en: 'Voyaro automatically finds the best dates for everyone and builds a group travel profile. No endless chats. No confusion.',
    },
    receiveOffers: { ka: 'მიიღე კონკურენტული შეთავაზებები', en: 'Receive competing offers' },
    receiveOffersDesc: {
      ka: 'ადგილობრივი ტურისტული კომპანიები განიხილავენ შენს მოგზაურობას და აგზავნიან საუკეთესო შეთავაზებებს. შეადარე, მიეცი ხმა და აირჩიე ერთად.',
      en: 'Local tour companies review your trip and send their best offers. Compare, vote, and choose together.',
    },

    // Why Voyaro
    whyVoyaro: { ka: 'რატომ Voyaro', en: 'Why Voyaro' },
    designedForGroups: { ka: 'შექმნილია სპეციალურად ჯგუფებისთვის', en: 'Designed specifically for groups' },
    betterPrices: { ka: 'უკეთესი ფასები რეალური კონკურენციის წყალობით', en: 'Better prices through real competition' },
    localExperts: { ka: 'შეთავაზებები მხოლოდ ადგილობრივი ექსპერტებისგან', en: 'Offers from local experts only' },
    noHiddenFees: { ka: 'არანაირი ფარული გადასახადები ან საკომისიოები', en: 'No hidden fees or commissions' },
    voyaroDoesntSell: { ka: 'Voyaro არ ყიდის მოგზაურობებს — ის გეხმარება აირჩიო საუკეთესო.', en: "Voyaro doesn't sell trips — it helps you choose the best one." },

    // For Travelers
    forTravelers: { ka: 'მოგზაურებისთვის', en: 'For Travelers' },
    planTripsEveryone: { ka: 'დაგეგმე მოგზაურობები, რომლებზეც ყველა თანახმაა', en: 'Plan trips everyone agrees on' },
    seeAllOffers: { ka: 'ნახე ყველა შეთავაზება ერთ ადგილზე', en: 'See all offers in one place' },
    chooseBasedOn: { ka: 'აირჩიე ფასის, კომფორტისა და აქტივობების მიხედვით', en: 'Choose based on price, comfort, and activities' },
    stayInControl: { ka: 'დარჩი კონტროლში როგორც ჯგუფი', en: 'Stay in control as a group' },
    alwaysFree: { ka: 'ყოველთვის უფასო მოგზაურებისთვის.', en: 'Always free for travelers.' },
    startGroupTrip: { ka: 'დაიწყე ჯგუფური მოგზაურობა', en: 'Start a Group Trip' },

    // For Tour Companies
    forTourCompanies: { ka: 'ტურისტული კომპანიებისთვის', en: 'For Tour Companies' },
    accessReadyTrips: { ka: 'მიიღე წვდომა დაჯავშნისთვის მზა ჯგუფურ მოგზაურობებზე', en: 'Access ready-to-book group trips' },
    competeFairly: { ka: 'იბრძოლე სამართლიანად და გამჭვირვალედ', en: 'Compete fairly and transparently' },
    noAds: { ka: 'არანაირი რეკლამები, არანაირი ლიდების დევნა', en: 'No ads, no lead chasing' },
    payOnlyPlatform: { ka: 'გადაიხადე მხოლოდ პლატფორმაზე წვდომისთვის', en: 'Pay only for platform access' },
    joinAsCompany: { ka: 'შემოგვიერთდი როგორც ტურისტული კომპანია', en: 'Join as a Tour Company' },

    // Trust section
    trustText: {
      ka: 'Voyaro არის ტექნოლოგიური პლატფორმა. ჩვენ არ ვყიდით ტურებს და არ ვამუშავებთ მოგზაურთა გადახდებს. ყველა სამოგზაურო სერვისს პირდაპირ უზრუნველყოფენ ვერიფიცირებული ტურისტული კომპანიები.',
      en: 'Voyaro is a technology platform. We do not sell tours or handle traveler payments. All travel services are provided directly by verified tour companies.',
    },

    // Final CTA
    planSmarter: { ka: 'დაგეგმე ჭკვიანურად. იმოგზაურე ერთად.', en: 'Plan smarter. Travel together.' },
    createInMinutes: { ka: 'შექმენი მოგზაურობა წუთებში და მიეცი საუკეთესო შეთავაზებებს საშუალება მოგაწიონ.', en: 'Create a trip in minutes and let the best offers come to you.' },
    startYourTrip: { ka: 'დაიწყე შენი მოგზაურობა — უფასოდ', en: 'Start Your Trip — Free' },

    // Legacy - keep for other pages
    heroTitle: { ka: 'ჯგუფური მოგზაურობა,', en: 'Group Travel,' },
    heroTitleHighlight: { ka: 'გამარტივებული', en: 'Simplified' },
    planTrip: { ka: 'დაგეგმე მოგზაურობა', en: 'Plan a Trip' },
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
    // Registration
    createAccount: { ka: 'შექმენი ანგარიში', en: 'Create an account' },
    startPlanningTrips: { ka: 'დაიწყე ჯგუფური მოგზაურობების დაგეგმვა დღეს', en: 'Start planning your group trips today' },
    firstName: { ka: 'სახელი', en: 'First Name' },
    lastName: { ka: 'გვარი', en: 'Last Name' },
    confirmPassword: { ka: 'დაადასტურე პაროლი', en: 'Confirm Password' },
    createAccountBtn: { ka: 'შექმენი ანგარიში', en: 'Create Account' },
    alreadyHaveAccount: { ka: 'უკვე გაქვს ანგარიში?', en: 'Already have an account?' },
    areTourCompany: { ka: 'ხარ ტურისტული კომპანია?', en: 'Are you a tour company?' },
    registerYourCompany: { ka: 'დაარეგისტრირე შენი კომპანია', en: 'Register your company' },
    // Company Registration
    createAdminAccount: { ka: 'შექმენი ადმინ ანგარიში', en: 'Create Admin Account' },
    registerYourCompanyTitle: { ka: 'დაარეგისტრირე შენი კომპანია', en: 'Register Your Company' },
    createAdminFirst: { ka: 'ჯერ შექმენი შენი ადმინ ანგარიში', en: 'First, create your admin account' },
    tellUsAboutCompany: { ka: 'ახლა გვიამბე შენი ტურისტული კომპანიის შესახებ', en: 'Now, tell us about your tour company' },
    companyName: { ka: 'კომპანიის სახელი', en: 'Company Name' },
    description: { ka: 'აღწერა', en: 'Description' },
    descriptionPlaceholder: { ka: 'უამბე მოგზაურებს შენი კომპანიის შესახებ...', en: 'Tell travelers about your company...' },
    destinationsLabel: { ka: 'დანიშნულებები (მძიმით გამოყოფილი)', en: 'Destinations (comma-separated)' },
    destinationsPlaceholder: { ka: 'იტალია, ესპანეთი, საბერძნეთი', en: 'Italy, Spain, Greece' },
    minGroupSize: { ka: 'მინ. ჯგუფის ზომა', en: 'Min Group Size' },
    maxGroupSize: { ka: 'მაქს. ჯგუფის ზომა', en: 'Max Group Size' },
    continue: { ka: 'გაგრძელება', en: 'Continue' },
    completeRegistration: { ka: 'დაასრულე რეგისტრაცია', en: 'Complete Registration' },
    companyReviewNote: { ka: 'შენი კომპანია განხილული იქნება სანამ შეძლებ შეთავაზებების გაგზავნას', en: 'Your company will be reviewed before you can submit offers' },
    passwordsDoNotMatch: { ka: 'პაროლები არ ემთხვევა', en: 'Passwords do not match' },
    passwordMinLength: { ka: 'პაროლი მინიმუმ 8 სიმბოლო უნდა იყოს', en: 'Password must be at least 8 characters' },
    // Login page value propositions
    groupTrips: { ka: 'ჯგუფური მოგზაურობა', en: 'Group Trips' },
    bestDeals: { ka: 'საუკეთესო ფასები', en: 'Best Deals' },
    easyPlanning: { ka: 'მარტივი დაგეგმვა', en: 'Easy Planning' },
  },

  // Trips
  trips: {
    myTrips: { ka: 'ჩემი მოგზაურობები', en: 'My Trips' },
    managePlans: { ka: 'მართე შენი ჯგუფური მოგზაურობის გეგმები', en: 'Manage your group travel plans' },
    createTrip: { ka: 'შექმენი მოგზაურობა', en: 'Create Trip' },
    noTripsYet: { ka: 'ჯერ მოგზაურობები არ გაქვს', en: 'No trips yet' },
    createFirstTrip: { ka: 'შექმენი შენი პირველი მოგზაურობა და მოიწვიე მეგობრები!', en: 'Create your first trip and invite friends to join!' },
    createYourFirstTrip: { ka: 'შექმენი შენი პირველი მოგზაურობა', en: 'Create Your First Trip' },
    participants: { ka: 'მონაწილე', en: 'participants' },
    organizer: { ka: 'ორგანიზატორი', en: 'Organizer' },
    auctionInProgress: { ka: 'აუქციონი მიმდინარეობს', en: 'Auction in progress' },
    deleteTrip: { ka: 'მოგზაურობის წაშლა', en: 'Delete trip' },
    deleteConfirm: { ka: 'დარწმუნებული ხარ, რომ გსურს ამ მოგზაურობის წაშლა?', en: 'Are you sure you want to delete this trip?' },
    deleting: { ka: 'იშლება...', en: 'Deleting...' },
    deleteError: { ka: 'მოგზაურობის წაშლა ვერ მოხერხდა', en: 'Failed to delete trip' },
    // Status labels
    statusCollectingDates: { ka: 'თარიღების შეგროვება', en: 'Collecting Dates' },
    statusAuctionActive: { ka: 'აუქციონი აქტიურია', en: 'Auction Active' },
    statusAuctionEnded: { ka: 'აუქციონი დასრულდა', en: 'Auction Ended' },
    statusWinnerSelected: { ka: 'გამარჯვებული შერჩეულია', en: 'Winner Selected' },
    statusCompleted: { ka: 'დასრულებული', en: 'Completed' },
    statusCancelled: { ka: 'გაუქმებული', en: 'Cancelled' },
    // Create trip page
    createNewTrip: { ka: 'შექმენი ახალი მოგზაურობა', en: 'Create a New Trip' },
    setupGroupTrip: { ka: 'დააყენე ჯგუფური მოგზაურობა და მოიწვიე მეგობრები', en: 'Set up your group trip and invite friends to join' },
    backToMyTrips: { ka: 'უკან ჩემს მოგზაურობებზე', en: 'Back to My Trips' },
    tripTitle: { ka: 'მოგზაურობის სათაური', en: 'Trip Title' },
    tripTitlePlaceholder: { ka: 'ზაფხულის თავგადასავალი 2024', en: 'Summer Adventure 2024' },
    destination: { ka: 'დანიშნულება', en: 'Destination' },
    selectDestination: { ka: 'აირჩიე დანიშნულება', en: 'Select destination' },
    anywhereHint: { ka: 'აირჩიე "ნებისმიერ ადგილას" რომ ტურისტულ კომპანიებს შესთავაზონ დანიშნულებები შენი ინტერესების მიხედვით', en: 'Choose "Anywhere" to let tour companies suggest destinations based on your interests' },
    tripInterests: { ka: 'მოგზაურობის ინტერესები (არასავალდებულო)', en: 'Trip Interests (optional)' },
    whatExperiences: { ka: 'რა ტიპის გამოცდილებებს ეძებ?', en: 'What type of experiences are you looking for?' },
    descriptionOptional: { ka: 'აღწერა (არასავალდებულო)', en: 'Description (optional)' },
    describePlans: { ka: 'აღწერე შენი მოგზაურობის გეგმები...', en: 'Describe your trip plans...' },
    minParticipants: { ka: 'მინ. მონაწილეები', en: 'Min Participants' },
    maxParticipants: { ka: 'მაქს. მონაწილეები', en: 'Max Participants' },
    numberOfFriends: { ka: 'მეგობრების რაოდენობა', en: 'Number of Friends' },
    numberOfFriendsHint: { ka: 'რამდენი მეგობარი მოგზაურობს შენთან ერთად (შენ ჩათვლით)', en: 'How many friends will travel with you (including yourself)' },
    priceRange: { ka: 'ფასის დიაპაზონი (არასავალდებულო)', en: 'Price Range (optional)' },
    priceRangeHint: { ka: 'მიუთითე შენი ბიუჯეტი ერთ ადამიანზე GEL-ში', en: 'Indicate your budget per person in GEL' },
    minPrice: { ka: 'მინ. ფასი', en: 'Min Price' },
    maxPrice: { ka: 'მაქს. ფასი', en: 'Max Price' },
    loginToCreate: { ka: 'გთხოვთ შეხვიდე მოგზაურობის შესაქმნელად', en: 'Please log in to create a trip' },
    // Trip detail page
    backToTrip: { ka: 'უკან მოგზაურობაზე', en: 'Back to Trip' },
    tripNotFound: { ka: 'მოგზაურობა ვერ მოიძებნა', en: 'Trip not found' },
    backToTrips: { ka: 'უკან მოგზაურობებზე', en: 'Back to Trips' },
    inviteFriends: { ka: 'მოიწვიე მეგობრები', en: 'Invite Friends' },
    inviteFriendsDesc: { ka: 'გაუზიარე ეს ლინკი მეგობრებს მოგზაურობაზე მოსაწვევად', en: 'Share this link with friends to invite them to your trip' },
    copy: { ka: 'კოპირება', en: 'Copy' },
    copied: { ka: 'კოპირებულია!', en: 'Copied!' },
    submitDates: { ka: 'თარიღების გაგზავნა', en: 'Submit Dates' },
    submitDatesDesc: { ka: 'აირჩიე შენი ხელმისაწვდომი თარიღები ამ მოგზაურობისთვის', en: 'Select your available dates for this trip' },
    settings: { ka: 'პარამეტრები', en: 'Settings' },
    auctionStatus: { ka: 'აუქციონის სტატუსი', en: 'Auction Status' },
    timeRemaining: { ka: 'დარჩენილი დრო', en: 'Time remaining' },
    offers: { ka: 'შეთავაზება', en: 'offers' },
    viewOffers: { ka: 'ნახე შეთავაზებები', en: 'View Offers' },
    readyToStartAuction: { ka: 'მზადაა აუქციონის დასაწყებად', en: 'Ready to Start Auction' },
    enoughParticipants: { ka: 'საკმარისი დადასტურებული მონაწილე გყავს აუქციონის დასაწყებად', en: 'You have enough confirmed participants to start the auction' },
    start48HourAuction: { ka: 'დაიწყე 48-საათიანი აუქციონი', en: 'Start 48-Hour Auction' },
    participantsTitle: { ka: 'მონაწილეები', en: 'Participants' },
    ofConfirmed: { ka: 'დადასტურებულია', en: 'of' },
    confirmed: { ka: 'დადასტურებული', en: 'Confirmed' },
    pending: { ka: 'მოლოდინში', en: 'Pending' },
    groupProfile: { ka: 'ჯგუფის პროფილი', en: 'Group Profile' },
    aggregatedPreferences: { ka: 'აგრეგირებული პრეფერენციები', en: 'Aggregated preferences' },
    budgetRange: { ka: 'ბიუჯეტის დიაპაზონი', en: 'Budget Range' },
    comfortLevel: { ka: 'კომფორტის დონე', en: 'Comfort Level' },
    bestDates: { ka: 'საუკეთესო თარიღები', en: 'Best Dates' },
    created: { ka: 'შექმნილი', en: 'Created' },
  },

  // Dates page
  dates: {
    selectAvailableDates: { ka: 'აირჩიე შენი ხელმისაწვდომი თარიღები', en: 'Select Your Available Dates' },
    clickOnDates: { ka: 'დააწკაპუნე თარიღებზე, როცა შეგიძლია მოგზაურობა', en: 'Click on dates when you are available to travel' },
    previous: { ka: 'წინა', en: 'Previous' },
    next: { ka: 'შემდეგი', en: 'Next' },
    sun: { ka: 'კვი', en: 'Sun' },
    mon: { ka: 'ორშ', en: 'Mon' },
    tue: { ka: 'სამ', en: 'Tue' },
    wed: { ka: 'ოთხ', en: 'Wed' },
    thu: { ka: 'ხუთ', en: 'Thu' },
    fri: { ka: 'პარ', en: 'Fri' },
    sat: { ka: 'შაბ', en: 'Sat' },
    groupMembersAvailability: { ka: "ჯგუფის წევრების ხელმისაწვდომობა", en: "Group Members' Availability" },
    you: { ka: 'შენ', en: 'You' },
    days: { ka: 'დღე', en: 'days' },
    datesSelected: { ka: 'თარიღი არჩეულია', en: 'dates selected' },
    more: { ka: 'მეტი', en: 'more' },
    datesSaved: { ka: 'თარიღები შენახულია! გადამისამართება...', en: 'Dates saved! Redirecting...' },
    saveDates: { ka: 'თარიღების შენახვა', en: 'Save Dates' },
  },

  // Invite page
  invite: {
    loadingInvitation: { ka: 'მოსაწვევის ჩატვირთვა...', en: 'Loading invitation...' },
    youreIn: { ka: 'შენ შემოუერთდი!', en: "You're In!" },
    successfullyJoined: { ka: 'წარმატებით შეუერთდი მოგზაურობას. გადამისამართება შენს მოგზაურობებზე...', en: "You've successfully joined the trip. Redirecting to your trips..." },
    invalidInvitation: { ka: 'არასწორი მოსაწვევი', en: 'Invalid Invitation' },
    youreInvited: { ka: 'შენ ხარ მოწვეული!', en: "You're Invited!" },
    invitedToJoin: { ka: 'მოგიწვია შეუერთდე მოგზაურობას', en: 'invited you to join a trip' },
    joined: { ka: 'შეუერთდა', en: 'joined' },
    joinThisTrip: { ka: 'შეუერთდი ამ მოგზაურობას', en: 'Join This Trip' },
    joining: { ka: 'მიერთება...', en: 'Joining...' },
    byJoining: { ka: 'შეერთებით, შეძლებ შენი ხელმისაწვდომი თარიღებისა და პრეფერენციების გაგზავნას.', en: "By joining, you'll be able to submit your available dates and preferences." },
    someoneInvited: { ka: 'ვიღაცამ მოგიწვია შეუერთდე მის მოგზაურობას Voyaro-ზე', en: 'Someone invited you to join their trip on Voyaro' },
    signInOrCreate: { ka: 'შედი ან შექმენი ანგარიში რომ ნახო მოგზაურობის დეტალები და შეუერთდე მეგობრებს.', en: 'Sign in or create an account to view the trip details and join your friends.' },
    signInToJoin: { ka: 'შედი შეერთებისთვის', en: 'Sign In to Join' },
    createAccount: { ka: 'შექმენი ანგარიში', en: 'Create Account' },
    alreadyHaveAccount: { ka: 'უკვე გაქვს ანგარიში? შედი ამ მოგზაურობაზე შესაერთებლად.', en: 'Already have an account? Sign in to join this trip.' },
    goToHomepage: { ka: 'მთავარ გვერდზე გადასვლა', en: 'Go to Homepage' },
  },

  // Footer
  footer: {
    allRightsReserved: { ka: 'ყველა უფლება დაცულია.', en: 'All rights reserved.' },
  },
}
