import "./globals.css";
import ChatBot from "@/components/ChatBot";
import ClientLayout from "@/components/ClientLayout";

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
        <ChatBot />
      </body>
    </html>
  );
}