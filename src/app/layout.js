import "./globals.css";

export const metadata = {
  title: "AskMyNotes | Subject-Scoped AI Study Copilot",
  description: "Stop asking general AI. Ask your notes. The AI tutor that actually knows your curriculum, provides citations, and prevents hallucinations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
