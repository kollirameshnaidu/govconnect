import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { getServerSession } from "@/lib/server-session";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GovConnect | Government Appointment Management System",
    template: "%s | GovConnect",
  },
  description:
    "Official Government Appointment Management System. Book, track, and complete office visits. A preferred date is a request, not a confirmed slot.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await getServerSession();
  return (
    <html lang="en" className={`${notoSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-surface font-sans text-ink">
        <AuthProvider initialSession={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
