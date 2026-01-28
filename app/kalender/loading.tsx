export default function KalenderLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-primary to-primary-600 text-white py-8">
        <div className="container-apm">
          <div className="h-4 bg-white/20 rounded w-32 mb-4"></div>
          <div className="h-8 bg-white/20 rounded w-64 mb-2"></div>
          <div className="h-4 bg-white/20 rounded w-96"></div>
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="container-apm">
          <div className="flex gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 bg-gray-200 rounded-full w-20 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container-apm py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-card p-4 animate-pulse">
              {/* Calendar Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 bg-gray-200 rounded w-40"></div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Week Days */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                  <div key={i} className="h-8 bg-gray-200 rounded"></div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-card p-5 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>

            <div className="bg-gray-200 rounded-xl h-48 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

