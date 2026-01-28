'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Button, 
  Badge, 
  SearchInput, 
  Breadcrumb,
  LombaCard,
  PrestasiCard,
  ExpoCard
} from '@/components/ui';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { 
  Search, 
  Calendar,
  Trophy,
  Users,
  FileText,
  Building,
  ArrowRight,
  X,
  Clock
} from 'lucide-react';

interface SearchResults {
  lomba: any[];
  prestasi: any[];
  expo: any[];
  resources: any[];
  total: number;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResults>({
    lomba: [],
    prestasi: [],
    expo: [],
    resources: [],
    total: 0,
  });
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'hackathon', 'business plan', 'desain'
  ]);

  // Perform search
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setResults({ lomba: [], prestasi: [], expo: [], resources: [], total: 0 });
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(performSearch, 300); // Debounce
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const removeRecentSearch = (item: string) => {
    setRecentSearches(prev => prev.filter(s => s !== item));
  };

  // Filter results based on query
  const hasQuery = searchQuery.trim().length > 0;
  const lombaResults = results.lomba;
  const prestasiResults = results.prestasi;
  const expoResults = results.expo;
  const resourceResults = results.resources;

  const totalResults = results.total;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-apm py-6">
          <Breadcrumb items={[{ label: 'Pencarian' }]} />
          <h1 className="text-2xl font-bold text-text-main mt-4">
            Pencarian
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="container-apm py-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari lomba, prestasi, expo, resources..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-5 py-4 pl-14 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                autoFocus
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted" />
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-apm py-8">
        {/* No query state */}
        {!hasQuery ? (
          <div className="max-w-2xl mx-auto">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-text-main flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Pencarian Terakhir
                  </h2>
                  <button 
                    onClick={() => setRecentSearches([])}
                    className="text-sm text-text-muted hover:text-error"
                  >
                    Hapus semua
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="group flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <span className="text-sm text-text-main">{term}</span>
                      <X 
                        className="w-3.5 h-3.5 text-text-muted hover:text-error transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentSearch(term);
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Categories */}
            <div>
              <h2 className="font-semibold text-text-main mb-4">Telusuri Kategori</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link 
                  href="/lomba"
                  className="p-6 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow text-center group"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Calendar className="w-6 h-6 text-primary group-hover:text-white" />
                  </div>
                  <p className="font-medium text-text-main">Lomba</p>
                  <p className="text-xs text-text-muted">50+ lomba aktif</p>
                </Link>
                <Link 
                  href="/prestasi"
                  className="p-6 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow text-center group"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent transition-colors">
                    <Trophy className="w-6 h-6 text-accent group-hover:text-white" />
                  </div>
                  <p className="font-medium text-text-main">Prestasi</p>
                  <p className="text-xs text-text-muted">256+ prestasi</p>
                </Link>
                <Link 
                  href="/expo"
                  className="p-6 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow text-center group"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary transition-colors">
                    <Users className="w-6 h-6 text-secondary group-hover:text-white" />
                  </div>
                  <p className="font-medium text-text-main">Expo</p>
                  <p className="text-xs text-text-muted">5 event mendatang</p>
                </Link>
                <Link 
                  href="/resources"
                  className="p-6 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow text-center group"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success transition-colors">
                    <FileText className="w-6 h-6 text-success group-hover:text-white" />
                  </div>
                  <p className="font-medium text-text-main">Resources</p>
                  <p className="text-xs text-text-muted">20+ template</p>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Search Results */
          <div>
            {/* Results count */}
            <div className="mb-6">
              <p className="text-text-muted">
                {isSearching ? (
                  'Mencari...'
                ) : (
                  <>
                    Ditemukan <span className="font-semibold text-text-main">{totalResults}</span> hasil untuk 
                    "<span className="font-semibold text-primary">{searchQuery}</span>"
                  </>
                )}
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" onChange={setActiveTab}>
              <TabsList variant="pills" className="mb-6">
                <TabsTrigger value="all" variant="pills">
                  Semua ({totalResults})
                </TabsTrigger>
                <TabsTrigger value="lomba" variant="pills">
                  Lomba ({lombaResults.length})
                </TabsTrigger>
                <TabsTrigger value="prestasi" variant="pills">
                  Prestasi ({prestasiResults.length})
                </TabsTrigger>
                <TabsTrigger value="expo" variant="pills">
                  Expo ({expoResults.length})
                </TabsTrigger>
                <TabsTrigger value="resources" variant="pills">
                  Resources ({resourceResults.length})
                </TabsTrigger>
              </TabsList>

              {/* All Results */}
              <TabsContent value="all">
                {totalResults === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl shadow-card">
                    <Search className="w-16 h-16 text-text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-text-main mb-2">
                      Tidak ada hasil ditemukan
                    </h3>
                    <p className="text-text-muted mb-4">
                      Coba kata kunci yang berbeda atau lebih umum
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Lomba Results */}
                    {lombaResults.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="font-semibold text-text-main flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Lomba & Kompetisi
                          </h2>
                          <Link href={`/lomba?q=${searchQuery}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                            Lihat semua <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {lombaResults.map((lomba) => (
                            <LombaCard key={lomba.id} {...lomba} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Prestasi Results */}
                    {prestasiResults.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="font-semibold text-text-main flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-accent" />
                            Prestasi
                          </h2>
                          <Link href={`/prestasi?q=${searchQuery}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                            Lihat semua <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {prestasiResults.map((prestasi) => (
                            <PrestasiCard key={prestasi.id} {...prestasi} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Expo Results */}
                    {expoResults.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="font-semibold text-text-main flex items-center gap-2">
                            <Users className="w-5 h-5 text-secondary" />
                            Expo & Acara
                          </h2>
                          <Link href={`/expo?q=${searchQuery}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                            Lihat semua <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {expoResults.map((expo) => (
                            <ExpoCard key={expo.id} {...expo} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resource Results */}
                    {resourceResults.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="font-semibold text-text-main flex items-center gap-2">
                            <FileText className="w-5 h-5 text-success" />
                            Resources
                          </h2>
                          <Link href={`/resources?q=${searchQuery}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                            Lihat semua <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                        <div className="space-y-3">
                          {resourceResults.map((resource) => (
                            <Link
                              key={resource.id}
                              href={`/resources/${resource.slug}`}
                              className="block bg-white rounded-xl shadow-card p-4 hover:shadow-lg transition-all group"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-success/10 transition-colors">
                                  <FileText className="w-6 h-6 text-text-muted group-hover:text-success transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-text-main group-hover:text-success transition-colors">
                                    {resource.title}
                                  </h3>
                                  <p className="text-sm text-text-muted">{resource.kategori}</p>
                                </div>
                                <Badge variant="outline">{resource.format}</Badge>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Lomba Tab */}
              <TabsContent value="lomba">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lombaResults.map((lomba) => (
                    <LombaCard key={lomba.id} {...lomba} />
                  ))}
                </div>
              </TabsContent>

              {/* Prestasi Tab */}
              <TabsContent value="prestasi">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prestasiResults.map((prestasi) => (
                    <PrestasiCard key={prestasi.id} {...prestasi} />
                  ))}
                </div>
              </TabsContent>

              {/* Expo Tab */}
              <TabsContent value="expo">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {expoResults.map((expo) => (
                    <ExpoCard key={expo.id} {...expo} />
                  ))}
                </div>
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources">
                <div className="space-y-3">
                  {resourceResults.map((resource) => (
                    <Link
                      key={resource.id}
                      href={`/resources/${resource.slug}`}
                      className="block bg-white rounded-xl shadow-card p-4 hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-success/10 transition-colors">
                          <FileText className="w-6 h-6 text-text-muted group-hover:text-success transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-text-main group-hover:text-success transition-colors">
                            {resource.title}
                          </h3>
                          <p className="text-sm text-text-muted">{resource.kategori}</p>
                        </div>
                        <Badge variant="outline">{resource.format}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

