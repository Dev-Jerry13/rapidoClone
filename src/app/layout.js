export const metadata = {
  title: "RapidoClone",
  description: "Production-style Uber clone with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
