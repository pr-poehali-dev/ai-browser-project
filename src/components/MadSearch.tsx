import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface SearchResult {
  title: string;
  url: string;
  description: string;
  favicon?: string;
}

interface MadSearchProps {
  onNavigate: (url: string) => void;
  initialQuery?: string;
}

const MadSearch = ({ onNavigate, initialQuery = '' }: MadSearchProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const popularSites: SearchResult[] = [
    {
      title: 'Rutube',
      url: 'https://rutube.ru',
      description: 'Российский видеохостинг - смотрите видео онлайн',
      favicon: '📺'
    },
    {
      title: 'VK',
      url: 'https://vk.com',
      description: 'Социальная сеть ВКонтакте',
      favicon: '💬'
    },
    {
      title: 'Яндекс',
      url: 'https://yandex.ru',
      description: 'Поисковая система, почта, карты и другие сервисы',
      favicon: '🔍'
    },
    {
      title: 'Mail.ru',
      url: 'https://mail.ru',
      description: 'Почта, новости, поиск и развлечения',
      favicon: '✉️'
    },
    {
      title: 'GitHub',
      url: 'https://github.com',
      description: 'Платформа для разработчиков и совместной работы',
      favicon: '💻'
    },
    {
      title: 'Wikipedia',
      url: 'https://ru.wikipedia.org',
      description: 'Свободная энциклопедия',
      favicon: '📚'
    },
    {
      title: 'YouTube',
      url: 'https://youtube.com',
      description: 'Смотрите и загружайте видео',
      favicon: '🎥'
    },
    {
      title: 'Habr',
      url: 'https://habr.com',
      description: 'Сообщество IT-специалистов',
      favicon: '🛠️'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);

    const searchResults = popularSites.filter(site => 
      site.title.toLowerCase().includes(query.toLowerCase()) ||
      site.description.toLowerCase().includes(query.toLowerCase()) ||
      site.url.toLowerCase().includes(query.toLowerCase())
    );

    if (searchResults.length === 0) {
      setResults([
        {
          title: `Поиск "${query}" в интернете`,
          url: `https://yandex.ru/search/?text=${encodeURIComponent(query)}`,
          description: `Найти "${query}" через Яндекс`
        },
        {
          title: `Поиск "${query}" в Google`,
          url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          description: `Найти "${query}" через Google`
        },
        {
          title: `Поиск "${query}" на YouTube`,
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
          description: `Найти видео по запросу "${query}"`
        }
      ]);
    } else {
      setResults(searchResults);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-2">
            <span className="text-blue-500">M</span>
            <span className="text-red-500">a</span>
            <span className="text-yellow-500">d</span>
            <span className="text-blue-500"> S</span>
            <span className="text-green-500">e</span>
            <span className="text-red-500">a</span>
            <span className="text-purple-500">r</span>
            <span className="text-orange-500">c</span>
            <span className="text-blue-500">h</span>
          </h1>
          <p className="text-gray-600">Умный поиск с ИИ</p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-full px-6 py-3 hover:shadow-md transition-shadow focus-within:shadow-md focus-within:border-blue-400">
              <Icon name="Search" size={20} className="text-gray-400" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Введите поисковый запрос..."
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
              />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                  }}
                >
                  <Icon name="X" size={20} className="text-gray-400" />
                </Button>
              )}
            </div>
            {!results.length && (
              <div className="flex justify-center gap-3 mt-6">
                <Button type="submit" variant="outline" disabled={isLoading}>
                  Поиск Mad Search
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    const randomSite = popularSites[Math.floor(Math.random() * popularSites.length)];
                    onNavigate(randomSite.url);
                  }}
                >
                  Мне повезёт!
                </Button>
              </div>
            )}
          </div>
        </form>

        {results.length > 0 ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Найдено результатов: {results.length}
            </div>
            {results.map((result, index) => (
              <Card
                key={index}
                className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500"
                onClick={() => onNavigate(result.url)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{result.favicon || '🌐'}</div>
                    <div className="flex-1">
                      <h3 className="text-xl text-blue-600 hover:underline mb-1 font-medium">
                        {result.title}
                      </h3>
                      <div className="text-sm text-green-700 mb-2">{result.url}</div>
                      <p className="text-gray-700">{result.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !query ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {popularSites.slice(0, 8).map((site, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
                onClick={() => onNavigate(site.url)}
              >
                <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                  <div className="text-4xl mb-2">{site.favicon}</div>
                  <span className="text-sm font-medium text-gray-700 text-center">
                    {site.title}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MadSearch;
