import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Loading } from "@/components/common/Loading";

// Dynamic imports for home page sections
const HomeClient = dynamic(() => import("@/components/pages/HomeClient"), {
  ssr: true,
  loading: () => <Loading message="Loading content..." size="large" />,
});

export const metadata = {
  title: "Towizaza | Official Artist Website",
  description:
    "Official website for music artist Towizaza - Stream music, buy merchandise, and connect with the artist.",
};

export default function Home() {
  return (
    <Suspense fallback={<Loading message="Loading site..." size="large" />}>
      <HomeClient />
    </Suspense>
  );
}
