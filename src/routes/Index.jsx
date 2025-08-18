// Index.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from '../pages/Homepage';
import Login from '../components/Loginc';
import About from '../pages/About';
import WelcomePage from '../components/Welcomepage';
import ForgotPassword from '../components/ForgotPassword';
import ContentModerator from '../pages/ContentModerator';
// import ModeratorPage from '../pages/ModeratorPage';
import Chatbot from '../components/Chatbot';
import Footer from '../components/Footer';
import Community from '../components/Community';
import Navbar2 from '../components/Navbar2';
import Services from '../components/Services';
import Quiz from '../components/Quiz';
// import ADHD from '../components/Community/ADHD';
// import ADHDvideo from '../components/Community/ADHDvideo';
// import Sleepdisorder from '../components/Community/Sleepdisorder';
// import Navbar from '../components/Navbar';
// import Sleepvideo from '../components/Community/Sleepvideo';
// import Anxiety from '../components/Community/Anxiety';
// import Substance from '../components/Community/Substance';
// import Depression from '../components/Community/Depression';
// import OCD from '../components/Community/OCD';
// import PTSD from '../components/Community/PTSD';
// import Bipolar from '../components/Community/Bipolar';
// import Schizophrenia from '../components/Community/Schizophrenia';
// import Eating from '../components/Community/Eating';
// import Anxietyvideo from '../components/Community/Anxietyvideo';
// import Bipolarvideo from '../components/Community/Bipolarvideo';
// import PTSDvideo from '../components/Community/PTSDvideo';
// import Schizophreniavideo from '../components/Community/Schizophreniavideo';
// import Eatingvideo from '../components/Community/Eatingvideo';
// import OCDvideo from '../components/Community/OCDvideo';
// import Depressionvideo from '../components/Community/Depressionvideo';
// import Substancevideo from '../components/Community/Substancevideo';
import PostPage from '../components/PostViewer';
import SubscriptionPage from '../components/SubscriptionPage';
import UserProfile from '../components/UserProfile';
import UserRegister from '../components/UserRegister';

import Homepagee from '../pages/homePagee';
import PsychiatristDashboard from '../pages/psyciatristDashboard';
import Addpost from '../components/postAdd';
import UpdatePost from '../components/updatePost';
import PaymentPage from '../components/paymentPage';
import { ToastContainer } from 'react-toastify';
import PsychiatristBookingPage from '../components/Viewpsychiatrist';
import 'react-toastify/dist/ReactToastify.css';
import AppointmentView from '../components/AppointmentView';
import DoctorAppointmentView from '../components/DoctorAppointmentView';
import EditProfilePage from '../components/EditProfilePage';

import PsychiatristVerificationPage from '../components/PsychiatristVerificationPage';
import ContentModerationPage from '../components/ContentModerationPage';
import CommunityManagementPage from '../pages/CommunityManagementPage';
import CommunityChatPage from '../pages/CommunityChatPage';
import AddResourcePage from '../pages/Resources';
import ResourceView from '../components/ResourcesPage';
import Notification from '../components/Notification';
import PostInteraction from '../components/PostInteraction';
import ResetPassword from '../components/ResetPassword';
import Subscription from '../components/SubscriptionPage';


function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/login" element={<><Navbar2/><Login /></>} />
        <Route path="/homepage2" element={<Homepagee/>} />
        <Route path="/resources" element={<ResourceView />} />

        <Route path="/about" element={<About/>} />
        <Route path="/service" element={<Services/>} />
        <Route path="/forgot-password" element={<><Navbar2/><ForgotPassword/></>}/>
        <Route path="/reset-password" element={<><Navbar2/><ResetPassword/></>}/>
        <Route path="/welcome" element={<WelcomePage/>}/>
        <Route path="/postview" element={<PostPage/>}/>
        <Route path="/chatbot" element={<Chatbot/>}/>
        <Route path="/community" element={<Community/>}/>
        <Route path="/post-view" element={<Addpost/>}/>
        <Route path="/updatepost/:postId" element={<UpdatePost/>}/>
        <Route path="/payment" element={<PaymentPage/>}/>
        <Route path="/subscribe" element={<Subscription/>}/>
        <Route path="/userregister" element={<><Navbar2/><UserRegister/></>}/>
        <Route path="/psychiatristdashboard" element={<PsychiatristDashboard/>}/>
        <Route path="/edit-profile" element={<EditProfilePage/>}/>
        <Route path="/quiz" element={<Quiz/>}/>
        <Route path="/notification" element={<Notification/>}/>
        <Route path="/post-interaction" element={<PostInteraction/>}/>
        <Route path="/post-interaction" element={<UserProfile/>}/>

        <Route path="/viewuserappointment" element={<AppointmentView/>}/>
        <Route path="/viewdoctorappointment" element={<DoctorAppointmentView/>}/>
        {/* <Route path="/eating-disorders" element={<Eating/>}/>
        <Route path="/eating-video" element={<Eatingvideo/>}/> */}
        <Route path="/content-moderator" element={<ContentModerator/>}/>
        {/* <Route path="/moderatorpage" element={<ModeratorPage/>}/> */}
        <Route path="/profile" element={<UserProfile/>}/>
        <Route path="/bookingpage" element={<PsychiatristBookingPage/>}/>
        {/* New Moderator Routes */}
        <Route path="/content-moderation" element={<ContentModerationPage/>}/>
        <Route path="/moderator-resources" element={<AddResourcePage/>}/> {/* Renamed to avoid conflict */}
        <Route path="/psychiatrist-verification" element={<PsychiatristVerificationPage/>}/>
        <Route path="/community-management" element={<CommunityManagementPage />} />
        <Route path="/community-chat/:communityName" element={<CommunityChatPage />} />
      </Routes>
      <Footer/>
      <ToastContainer position="top-center" autoClose={3000} />
    </BrowserRouter>
  );
}

export default Index;