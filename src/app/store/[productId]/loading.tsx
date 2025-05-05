import { Loading } from '@/components/common/Loading';

export default function LoadingProductPage() {
  return (
    <div className="min-h-screen bg-dark">
      {/* Background decorative elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/5 w-96 h-96 rounded-full bg-accent/10 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 h-screen flex items-center justify-center">
        <Loading message="Loading Product" />
      </div>
    </div>
  );
} 