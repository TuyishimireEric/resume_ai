import Features from "@/components/features";
import JobsSection from "@/components/Job-section";
import TopNav from "@/components/TopNav";

export default function Home() {
  return (
    <main className="min-h-screen">
      <TopNav />
      {/* <HeroSection /> */}
      <JobsSection />
      <Features />
    </main>
  );
}
