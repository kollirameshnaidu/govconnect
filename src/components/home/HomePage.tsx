import { Announcements } from "@/components/home/Announcements";
import { AppointmentJourney } from "@/components/home/AppointmentJourney";
import { CitizenCharter } from "@/components/home/CitizenCharter";
import { DepartmentsServices } from "@/components/home/DepartmentsServices";
import { FaqSection } from "@/components/home/FaqSection";
import { FindOffice } from "@/components/home/FindOffice";
import { HelpContact } from "@/components/home/HelpContact";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { QuickServices } from "@/components/home/QuickServices";
import { TrackAppointment } from "@/components/home/TrackAppointment";
import { TrustIndicators } from "@/components/home/TrustIndicators";
import { ANNOUNCEMENTS } from "@/mock/homepage";

export function HomePage() {
  return (
    <>
      <Hero />
      <TrustIndicators />
      <QuickServices />
      <HowItWorks />
      <TrackAppointment />
      <FindOffice />
      <DepartmentsServices />
      <AppointmentJourney />
      <Announcements items={ANNOUNCEMENTS.slice(0, 3)} />
      <CitizenCharter />
      <FaqSection />
      <HelpContact />
    </>
  );
}
