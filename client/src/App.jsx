import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import StaffLayout from './layouts/StaffLayout.jsx';
import ApplyLeaderPage from './pages/ApplyLeaderPage.jsx';
import ClubProfilePage from './pages/ClubProfilePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DirectoryPage from './pages/DirectoryPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import MyClubsPage from './pages/MyClubsPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import StaffLoginPage from './pages/StaffLoginPage.jsx';
import VerifyPage from './pages/VerifyPage.jsx';
import StaffAnnouncementsPage from './pages/staff/StaffAnnouncementsPage.jsx';
import StaffApplicationsPage from './pages/staff/StaffApplicationsPage.jsx';
import StaffClubsPage from './pages/staff/StaffClubsPage.jsx';
import StaffCreateClubPage from './pages/staff/StaffCreateClubPage.jsx';
import StaffDashboardPage from './pages/staff/StaffDashboardPage.jsx';
import StaffUsersPage from './pages/staff/StaffUsersPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/clubs" element={<DirectoryPage />} />
        <Route path="/clubs/:slug" element={<ClubProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify/:token" element={<VerifyPage />} />
      </Route>

      <Route path="/staff/login" element={<StaffLoginPage />} />

      <Route element={<ProtectedRoute studentOnly />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/discover" element={<DirectoryPage authenticated />} />
          <Route path="/my-clubs" element={<MyClubsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/apply-leader" element={<ApplyLeaderPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute staffOnly />}>
        <Route element={<StaffLayout />}>
          <Route path="/staff/dashboard" element={<StaffDashboardPage />} />
          <Route path="/staff/clubs" element={<StaffClubsPage />} />
          <Route path="/staff/clubs/new" element={<StaffCreateClubPage />} />
          <Route path="/staff/users" element={<StaffUsersPage />} />
          <Route path="/staff/applications" element={<StaffApplicationsPage />} />
          <Route path="/staff/announcements" element={<StaffAnnouncementsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
