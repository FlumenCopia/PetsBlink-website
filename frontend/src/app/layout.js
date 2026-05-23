import "./globals.css";

export const metadata = {
  title: "Authentication",
  description: "Authentication and profile pages",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
