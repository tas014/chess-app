import { Bebas_Neue, Bebas_Neue, Montserrat } from "next/font/google";
import "./globals.css";

const bebas_Neue = Bebas_Neue({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas-neue",
  weight: ["400"],
});
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600"],
});

export const metadata = {
  title: "Franco's Chess App",
  description: "A chess application designed by an aspiring web developer.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bebas_Neue.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
