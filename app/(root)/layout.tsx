import Navbar from "@/components/root/Navbar";
import Footer from "@/components/root/Footer";
import GridLines from "@/components/root/GridLines";

export default function RootGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <GridLines />
      <Navbar />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
