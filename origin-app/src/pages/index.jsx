import Layout from "./Layout.jsx";

import Courses from "./Courses";

import Community from "./Community";

import Events from "./Events";

import SocialTinder from "./SocialTinder";

import Join from "./Join";

import BecomeInstructor from "./BecomeInstructor";

import Subscribe from "./Subscribe";

import MentorProfile from "./MentorProfile";

import Privacy from "./Privacy";

import Booking from "./Booking";

import MyBookings from "./MyBookings";

import Faq from "./Faq";

import BecomeMentor from "./BecomeMentor";

import MyProfile from "./MyProfile";

import Home from "./Home";

import AmbassadorClub from "./AmbassadorClub";

import TempFixData from "./TempFixData";

import AIMatchmaking from "./AIMatchmaking";

import ApproveBooking from "./ApproveBooking";

import PayItForward from "./PayItForward";

import CoursesAndEvents from "./CoursesAndEvents";

import MyPathfinder from "./MyPathfinder";

import ResourceLibrary from "./ResourceLibrary";

import ManageResources from "./ManageResources";

import PersonalGoals from "./PersonalGoals";

import TermsOfService from "./TermsOfService";

import Accessibility from "./Accessibility";

import Messages from "./Messages";

import MyBadges from "./MyBadges";

import ManageCourses from "./ManageCourses";

import JoinSuccess from "./JoinSuccess";

import PaymentSuccess from "./PaymentSuccess";

import PaymentCancel from "./PaymentCancel";

import LaunchOffer from "./LaunchOffer";

import AdminDashboard from "./AdminDashboard";

import ManageUsers from "./ManageUsers";

import TestSubscription from "./TestSubscription";

import WriteArticle from "./WriteArticle";

import EntrepreneurshipPathfinder from "./EntrepreneurshipPathfinder";

import TestEmailNotification from "./TestEmailNotification";

import EditMentorProfile from "./EditMentorProfile";

import ManageArticles from "./ManageArticles";

import ManageGifts from "./ManageGifts";

import GoToMentorsPage from "./GoToMentorsPage";

import ManageMentorsTemp from "./ManageMentorsTemp";

import BusinessStartupChecklist from "./BusinessStartupChecklist";

import BudgetPlanner from "./BudgetPlanner";

import BusinessStepsPlanner from "./BusinessStepsPlanner";

import SocialMediaGuide from "./SocialMediaGuide";

import LowBudgetMarketing from "./LowBudgetMarketing";

import CoachesAndConsultants from "./CoachesAndConsultants";

import CoachDashboard from "./CoachDashboard";

import CoachProfile from "./CoachProfile";

import MentorDashboard from "./MentorDashboard";

import DiagnoseMentorIssue from "./DiagnoseMentorIssue";

import CareerReferrals from "./CareerReferrals";

import Articles from "./Articles";

import DebugAppointments from "./DebugAppointments";

import ManageBookings from "./ManageBookings";

import TempDeleteTool from "./TempDeleteTool";

import ApplyForMembership from "./ApplyForMembership";

import ManageMyBookings from "./ManageMyBookings";

import MyCourses from "./MyCourses";

import ManageEvents from "./ManageEvents";

import ManageCommunityPosts from "./ManageCommunityPosts";

import ArticlePage from "./ArticlePage";

import MentorSubscribe from "./MentorSubscribe";

import InterviewPrepAI from "./InterviewPrepAI";

import StarsInsight from "./StarsInsight";

import EmailLogs from "./EmailLogs";

import SendInstructorEmail from "./SendInstructorEmail";

import VolunteerSignup from "./VolunteerSignup";

import EntrepreneurshipHub from "./EntrepreneurshipHub";

import GoogleMyBusinessGuide from "./GoogleMyBusinessGuide";

import RoiCalculator from "./RoiCalculator";

import TaxGuide from "./TaxGuide";

import SimpleCrm from "./SimpleCrm";

import ProposalTemplate from "./ProposalTemplate";

import CanvaTemplates from "./CanvaTemplates";

import AiToolsList from "./AiToolsList";

import ContentMarketingStrategy from "./ContentMarketingStrategy";

import CvLinkedInEnhancer from "./CvLinkedInEnhancer";

import RecommendationLetters from "./RecommendationLetters";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Courses: Courses,
    
    Community: Community,
    
    Events: Events,
    
    SocialTinder: SocialTinder,
    
    Join: Join,
    
    BecomeInstructor: BecomeInstructor,
    
    Subscribe: Subscribe,
    
    MentorProfile: MentorProfile,
    
    Privacy: Privacy,
    
    Booking: Booking,
    
    MyBookings: MyBookings,
    
    Faq: Faq,
    
    BecomeMentor: BecomeMentor,
    
    MyProfile: MyProfile,
    
    Home: Home,
    
    AmbassadorClub: AmbassadorClub,
    
    TempFixData: TempFixData,
    
    AIMatchmaking: AIMatchmaking,
    
    ApproveBooking: ApproveBooking,
    
    PayItForward: PayItForward,
    
    CoursesAndEvents: CoursesAndEvents,
    
    MyPathfinder: MyPathfinder,
    
    ResourceLibrary: ResourceLibrary,
    
    ManageResources: ManageResources,
    
    PersonalGoals: PersonalGoals,
    
    TermsOfService: TermsOfService,
    
    Accessibility: Accessibility,
    
    Messages: Messages,
    
    MyBadges: MyBadges,
    
    ManageCourses: ManageCourses,
    
    JoinSuccess: JoinSuccess,
    
    PaymentSuccess: PaymentSuccess,
    
    PaymentCancel: PaymentCancel,
    
    LaunchOffer: LaunchOffer,
    
    AdminDashboard: AdminDashboard,
    
    ManageUsers: ManageUsers,
    
    TestSubscription: TestSubscription,
    
    WriteArticle: WriteArticle,
    
    EntrepreneurshipPathfinder: EntrepreneurshipPathfinder,
    
    TestEmailNotification: TestEmailNotification,
    
    EditMentorProfile: EditMentorProfile,
    
    ManageArticles: ManageArticles,
    
    ManageGifts: ManageGifts,
    
    GoToMentorsPage: GoToMentorsPage,
    
    ManageMentorsTemp: ManageMentorsTemp,
    
    BusinessStartupChecklist: BusinessStartupChecklist,
    
    BudgetPlanner: BudgetPlanner,
    
    BusinessStepsPlanner: BusinessStepsPlanner,
    
    SocialMediaGuide: SocialMediaGuide,
    
    LowBudgetMarketing: LowBudgetMarketing,
    
    CoachesAndConsultants: CoachesAndConsultants,
    
    CoachDashboard: CoachDashboard,
    
    CoachProfile: CoachProfile,
    
    MentorDashboard: MentorDashboard,
    
    DiagnoseMentorIssue: DiagnoseMentorIssue,
    
    CareerReferrals: CareerReferrals,
    
    Articles: Articles,
    
    DebugAppointments: DebugAppointments,
    
    ManageBookings: ManageBookings,
    
    TempDeleteTool: TempDeleteTool,
    
    ApplyForMembership: ApplyForMembership,
    
    ManageMyBookings: ManageMyBookings,
    
    MyCourses: MyCourses,
    
    ManageEvents: ManageEvents,
    
    ManageCommunityPosts: ManageCommunityPosts,
    
    ArticlePage: ArticlePage,
    
    MentorSubscribe: MentorSubscribe,
    
    InterviewPrepAI: InterviewPrepAI,
    
    StarsInsight: StarsInsight,
    
    EmailLogs: EmailLogs,
    
    SendInstructorEmail: SendInstructorEmail,
    
    VolunteerSignup: VolunteerSignup,
    
    EntrepreneurshipHub: EntrepreneurshipHub,
    
    GoogleMyBusinessGuide: GoogleMyBusinessGuide,
    
    RoiCalculator: RoiCalculator,
    
    TaxGuide: TaxGuide,
    
    SimpleCrm: SimpleCrm,
    
    ProposalTemplate: ProposalTemplate,
    
    CanvaTemplates: CanvaTemplates,
    
    AiToolsList: AiToolsList,
    
    ContentMarketingStrategy: ContentMarketingStrategy,
    
    CvLinkedInEnhancer: CvLinkedInEnhancer,
    
    RecommendationLetters: RecommendationLetters,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Courses />} />
                
                
                <Route path="/Courses" element={<Courses />} />
                
                <Route path="/Community" element={<Community />} />
                
                <Route path="/Events" element={<Events />} />
                
                <Route path="/SocialTinder" element={<SocialTinder />} />
                
                <Route path="/Join" element={<Join />} />
                
                <Route path="/BecomeInstructor" element={<BecomeInstructor />} />
                
                <Route path="/Subscribe" element={<Subscribe />} />
                
                <Route path="/MentorProfile" element={<MentorProfile />} />
                
                <Route path="/Privacy" element={<Privacy />} />
                
                <Route path="/Booking" element={<Booking />} />
                
                <Route path="/MyBookings" element={<MyBookings />} />
                
                <Route path="/Faq" element={<Faq />} />
                
                <Route path="/BecomeMentor" element={<BecomeMentor />} />
                
                <Route path="/MyProfile" element={<MyProfile />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/AmbassadorClub" element={<AmbassadorClub />} />
                
                <Route path="/TempFixData" element={<TempFixData />} />
                
                <Route path="/AIMatchmaking" element={<AIMatchmaking />} />
                
                <Route path="/ApproveBooking" element={<ApproveBooking />} />
                
                <Route path="/PayItForward" element={<PayItForward />} />
                
                <Route path="/CoursesAndEvents" element={<CoursesAndEvents />} />
                
                <Route path="/MyPathfinder" element={<MyPathfinder />} />
                
                <Route path="/ResourceLibrary" element={<ResourceLibrary />} />
                
                <Route path="/ManageResources" element={<ManageResources />} />
                
                <Route path="/PersonalGoals" element={<PersonalGoals />} />
                
                <Route path="/TermsOfService" element={<TermsOfService />} />
                
                <Route path="/Accessibility" element={<Accessibility />} />
                
                <Route path="/Messages" element={<Messages />} />
                
                <Route path="/MyBadges" element={<MyBadges />} />
                
                <Route path="/ManageCourses" element={<ManageCourses />} />
                
                <Route path="/JoinSuccess" element={<JoinSuccess />} />
                
                <Route path="/PaymentSuccess" element={<PaymentSuccess />} />
                
                <Route path="/PaymentCancel" element={<PaymentCancel />} />
                
                <Route path="/LaunchOffer" element={<LaunchOffer />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/ManageUsers" element={<ManageUsers />} />
                
                <Route path="/TestSubscription" element={<TestSubscription />} />
                
                <Route path="/WriteArticle" element={<WriteArticle />} />
                
                <Route path="/EntrepreneurshipPathfinder" element={<EntrepreneurshipPathfinder />} />
                
                <Route path="/TestEmailNotification" element={<TestEmailNotification />} />
                
                <Route path="/EditMentorProfile" element={<EditMentorProfile />} />
                
                <Route path="/ManageArticles" element={<ManageArticles />} />
                
                <Route path="/ManageGifts" element={<ManageGifts />} />
                
                <Route path="/GoToMentorsPage" element={<GoToMentorsPage />} />
                
                <Route path="/ManageMentorsTemp" element={<ManageMentorsTemp />} />
                
                <Route path="/BusinessStartupChecklist" element={<BusinessStartupChecklist />} />
                
                <Route path="/BudgetPlanner" element={<BudgetPlanner />} />
                
                <Route path="/BusinessStepsPlanner" element={<BusinessStepsPlanner />} />
                
                <Route path="/SocialMediaGuide" element={<SocialMediaGuide />} />
                
                <Route path="/LowBudgetMarketing" element={<LowBudgetMarketing />} />
                
                <Route path="/CoachesAndConsultants" element={<CoachesAndConsultants />} />
                
                <Route path="/CoachDashboard" element={<CoachDashboard />} />
                
                <Route path="/CoachProfile" element={<CoachProfile />} />
                
                <Route path="/MentorDashboard" element={<MentorDashboard />} />
                
                <Route path="/DiagnoseMentorIssue" element={<DiagnoseMentorIssue />} />
                
                <Route path="/CareerReferrals" element={<CareerReferrals />} />
                
                <Route path="/Articles" element={<Articles />} />
                
                <Route path="/DebugAppointments" element={<DebugAppointments />} />
                
                <Route path="/ManageBookings" element={<ManageBookings />} />
                
                <Route path="/TempDeleteTool" element={<TempDeleteTool />} />
                
                <Route path="/ApplyForMembership" element={<ApplyForMembership />} />
                
                <Route path="/ManageMyBookings" element={<ManageMyBookings />} />
                
                <Route path="/MyCourses" element={<MyCourses />} />
                
                <Route path="/ManageEvents" element={<ManageEvents />} />
                
                <Route path="/ManageCommunityPosts" element={<ManageCommunityPosts />} />
                
                <Route path="/ArticlePage" element={<ArticlePage />} />
                
                <Route path="/MentorSubscribe" element={<MentorSubscribe />} />
                
                <Route path="/InterviewPrepAI" element={<InterviewPrepAI />} />
                
                <Route path="/StarsInsight" element={<StarsInsight />} />
                
                <Route path="/EmailLogs" element={<EmailLogs />} />
                
                <Route path="/SendInstructorEmail" element={<SendInstructorEmail />} />
                
                <Route path="/VolunteerSignup" element={<VolunteerSignup />} />
                
                <Route path="/EntrepreneurshipHub" element={<EntrepreneurshipHub />} />
                
                <Route path="/GoogleMyBusinessGuide" element={<GoogleMyBusinessGuide />} />
                
                <Route path="/RoiCalculator" element={<RoiCalculator />} />
                
                <Route path="/TaxGuide" element={<TaxGuide />} />
                
                <Route path="/SimpleCrm" element={<SimpleCrm />} />
                
                <Route path="/ProposalTemplate" element={<ProposalTemplate />} />
                
                <Route path="/CanvaTemplates" element={<CanvaTemplates />} />
                
                <Route path="/AiToolsList" element={<AiToolsList />} />
                
                <Route path="/ContentMarketingStrategy" element={<ContentMarketingStrategy />} />
                
                <Route path="/CvLinkedInEnhancer" element={<CvLinkedInEnhancer />} />
                
                <Route path="/RecommendationLetters" element={<RecommendationLetters />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}