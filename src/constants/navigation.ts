import { routes } from "@/constants/routes";

export type NavItem = {
  href: string;
  label: string;
};

export const MAIN_NAV: NavItem[] = [
  { href: routes.home, label: "Home" },
  { href: routes.about, label: "About" },
  { href: routes.services, label: "Services" },
  { href: routes.departments, label: "Departments" },
  { href: routes.offices, label: "Offices" },
  { href: routes.howItWorks, label: "How it works" },
  { href: routes.announcements, label: "Announcements" },
  { href: routes.faq, label: "FAQ" },
  { href: routes.contact, label: "Contact" },
];

export const CITIZEN_NAV: NavItem[] = [
  { href: routes.citizenDashboard, label: "Dashboard" },
  { href: routes.citizenAppointments, label: "My appointments" },
  { href: routes.citizenBook, label: "Book appointment" },
  { href: routes.citizenNotifications, label: "Notifications" },
  { href: routes.citizenProfile, label: "Profile" },
];

export const OFFICIAL_NAV: NavItem[] = [
  { href: routes.officialDashboard, label: "Dashboard" },
  { href: routes.officialRequests, label: "Requests" },
  { href: routes.officialAppointments, label: "Appointments" },
  { href: routes.officialCalendar, label: "Calendar" },
  { href: routes.officialReports, label: "Reports" },
  { href: routes.officialNotifications, label: "Notifications" },
  { href: routes.officialProfile, label: "Profile" },
];

export const FRONT_DESK_NAV: NavItem[] = [
  { href: routes.frontDeskDashboard, label: "Dashboard" },
  { href: routes.frontDeskSearch, label: "Search visitor" },
  { href: routes.frontDeskQueue, label: "Waiting queue" },
  { href: routes.frontDeskProfile, label: "Profile" },
];

export const ADMIN_NAV: NavItem[] = [
  { href: routes.adminDashboard, label: "Dashboard" },
  { href: routes.adminOffices, label: "Offices" },
  { href: routes.adminDepartments, label: "Departments" },
  { href: routes.adminCategories, label: "Categories" },
  { href: routes.adminOfficials, label: "Officials" },
  { href: routes.adminUsers, label: "Users" },
  { href: routes.adminRoles, label: "Roles" },
  { href: routes.adminAppointments, label: "Appointments" },
  { href: routes.adminSlots, label: "Slots" },
  { href: routes.adminHolidays, label: "Holidays" },
  { href: routes.adminSla, label: "SLA" },
  { href: routes.adminEscalation, label: "Escalation" },
  { href: routes.adminNotifications, label: "Notifications" },
  { href: routes.adminReports, label: "Reports" },
  { href: routes.adminAudit, label: "Audit" },
  { href: routes.adminSettings, label: "Settings" },
];

export const FOOTER_NAV = {
  citizens: [
    { href: routes.bookAppointment, label: "Book appointment" },
    { href: routes.track, label: "Track appointment" },
    { href: routes.offices, label: "Find an office" },
    { href: routes.guidelines, label: "Guidelines" },
    { href: routes.citizenCharter, label: "Citizen charter" },
  ],
  information: [
    { href: routes.about, label: "About GovConnect" },
    { href: routes.services, label: "Services" },
    { href: routes.departments, label: "Departments" },
    { href: routes.announcements, label: "Announcements" },
    { href: routes.howItWorks, label: "How it works" },
  ],
  support: [
    { href: routes.help, label: "Help centre" },
    { href: routes.faq, label: "FAQ" },
    { href: routes.contact, label: "Contact us" },
    { href: routes.grievance, label: "Lodge grievance" },
    { href: routes.accessibility, label: "Accessibility" },
    { href: routes.officialLogin, label: "Official sign-in" },
    { href: routes.frontDeskLogin, label: "Front desk sign-in" },
    { href: routes.adminLogin, label: "Admin sign-in" },
  ],
} as const;
