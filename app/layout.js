import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://moonriver.fun"),
  title: {
    default: "Moonriver.fun — Crypto Launchpad on Arc",
    template: "%s | Moonriver.fun",
  },
  description:
    "Moonriver.fun is a crypto launchpad built on the Arc testnet. Discover early launches, join in a few clicks, and unlock rewards designed to make users money.",
  keywords: [
    "Moonriver.fun",
    "crypto launchpad",
    "meme launchpad",
    "Arc testnet",
    "token launch",
    "IDO",
  ],
  icons: {
    icon: "/assets/favicon.svg",
  },
  openGraph: {
    type: "website",
    url: "https://moonriver.fun",
    siteName: "Moonriver.fun",
    title: "Moonriver.fun — Crypto Launchpad on Arc",
    description:
      "A crypto launchpad built on the Arc testnet. Discover early launches, join in a few clicks, and unlock rewards designed to make users money.",
    images: ["/assets/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moonriver.fun — Crypto Launchpad on Arc",
    description:
      "A crypto launchpad built on the Arc testnet. Discover early launches, join in a few clicks, and unlock rewards designed to make users money.",
    images: ["/assets/logo.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06121d",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto w-full max-w-[1232px] px-4 pb-12">{children}</div>
      </body>
    </html>
  );
}
