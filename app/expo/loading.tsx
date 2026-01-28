import { Skeleton } from '@/components/ui';

export default function ExpoLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-secondary via-secondary to-primary">
        <div className="container-apm py-8">
          <Skeleton className="h-4 w-32 mb-4 bg-white/20" />
          <Skeleton className="h-8 w-48 mb-2 bg-white/20" />
          <Skeleton className="h-4 w-80 bg-white/20" />
          
          <div className="flex gap-4 mt-6">
            <Skeleton className="h-16 w-36 rounded-xl bg-white/10" />
            <Skeleton className="h-16 w-36 rounded-xl bg-white/10" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-apm py-8">
        {/* Featured */}
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-64 rounded-2xl mb-8" />

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-card overflow-hidden">
              <Skeleton className="aspect-video" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

