import { Navbar } from "./navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <header>
        <Navbar />
      </header>
      {children}
    </main>
  );
}
