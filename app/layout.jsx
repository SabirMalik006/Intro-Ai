import "./globals.css";
import ChatBotWrapper from "@/components/ChatBotWrapper";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  title: "SmartHire — AI-Powered Recruitment Platform",
  description: "SmartHire conducts professional AI interviews, evaluates candidates with precision, and delivers actionable insights — cutting hiring time by 80%.",
  icons: { icon: "/Gemini_Generated_Image_dqsy35dqsy35dqsy.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem("dashboard-theme");
                  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;
                  document.documentElement.classList.toggle("dark", shouldUseDark);
                } catch (e) {}
              })();
            `,
          }}
        />
        <ClientLayout>
          {children}
        </ClientLayout>
        <ChatBotWrapper />
      </body>
    </html>
  );
}