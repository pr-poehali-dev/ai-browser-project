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
      title: 'Rutube - Российский видеохостинг',
      url: 'https://rutube.ru',
      description: 'Смотрите видео онлайн: фильмы, сериалы, музыка, блоги',
      favicon: '📺'
    },
    {
      title: 'ВКонтакте - социальная сеть',
      url: 'https://vk.com',
      description: 'VK - общение, музыка, видео, игры и новости',
      favicon: '💬'
    },
    {
      title: 'Яндекс - поисковая система',
      url: 'https://yandex.ru',
      description: 'Поиск информации, почта Яндекс, карты, погода, новости',
      favicon: '🔍'
    },
    {
      title: 'Mail.ru - почта и портал',
      url: 'https://mail.ru',
      description: 'Электронная почта Mail.ru, новости, поиск, развлечения',
      favicon: '✉️'
    },

    {
      title: 'Википедия - свободная энциклопедия',
      url: 'https://ru.wikipedia.org',
      description: 'Wikipedia - статьи, знания, информация на русском языке',
      favicon: '📚'
    },
    {
      title: 'YouTube - видеохостинг',
      url: 'https://youtube.com',
      description: 'Смотрите и загружайте видео на YouTube',
      favicon: '🎥'
    },
    {
      title: 'Habr - IT сообщество',
      url: 'https://habr.com',
      description: 'Хабр - статьи о программировании, технологиях и разработке',
      favicon: '🛠️'
    },
    {
      title: 'Telegram Web',
      url: 'https://web.telegram.org',
      description: 'Telegram - мессенджер для общения и каналов',
      favicon: '✈️'
    },
    {
      title: 'Ozon - интернет-магазин',
      url: 'https://ozon.ru',
      description: 'OZON - онлайн покупки, товары, доставка',
      favicon: '🛒'
    },
    {
      title: 'Wildberries - маркетплейс',
      url: 'https://wildberries.ru',
      description: 'WB - одежда, обувь, электроника с доставкой',
      favicon: '🛍️'
    },
    {
      title: 'Avito - объявления',
      url: 'https://avito.ru',
      description: 'Авито - купить и продать товары, услуги, недвижимость',
      favicon: '📢'
    },
    {
      title: 'Кинопоиск',
      url: 'https://kinopoisk.ru',
      description: 'Кинопоиск - фильмы, сериалы, рейтинги и рецензии',
      favicon: '🎬'
    },
    {
      title: 'Лайфхакер',
      url: 'https://lifehacker.ru',
      description: 'Lifehacker - советы, лайфхаки, технологии',
      favicon: '💡'
    },
    {
      title: 'РБК - новости',
      url: 'https://rbc.ru',
      description: 'RBC - новости экономики, бизнеса, финансов',
      favicon: '📰'
    },
    {
      title: 'Дзен - контент',
      url: 'https://dzen.ru',
      description: 'Яндекс Дзен - статьи, видео, новости по интересам',
      favicon: '📱'
    },
    {
      title: 'Poehali.Dev - создание сайтов',
      url: 'https://poehali.dev',
      description: 'Poehali.Dev - разработка сайтов через русский язык с ИИ',
      favicon: '🚀'
    },
    {
      title: 'Kion - онлайн-кинотеатр',
      url: 'https://kion.ru',
      description: 'Kion - смотрите фильмы, сериалы и ТВ онлайн',
      favicon: '📺'
    },
    {
      title: 'Trashbox - файлообменник',
      url: 'https://trashbox.ru',
      description: 'Trashbox - загружайте и делитесь файлами онлайн',
      favicon: '📦'
    },
    {
      title: 'Сбербанк Онлайн',
      url: 'https://online.sberbank.ru',
      description: 'Сбербанк - онлайн банкинг, переводы, платежи',
      favicon: '🏦'
    },
    {
      title: 'Тинькофф Банк',
      url: 'https://tinkoff.ru',
      description: 'Тинькофф - банк в телефоне, карты, кредиты, инвестиции',
      favicon: '💳'
    },
    {
      title: 'Альфа-Банк',
      url: 'https://alfabank.ru',
      description: 'Альфа-Банк - интернет банк, вклады, кредиты',
      favicon: '🏦'
    },
    {
      title: 'ВТБ Банк',
      url: 'https://vtb.ru',
      description: 'ВТБ - банковские услуги, вклады, кредиты онлайн',
      favicon: '💰'
    }
  ];

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    const lowerQuery = searchQuery.toLowerCase();
    const searchResults = popularSites.filter(site => {
      const titleMatch = site.title.toLowerCase().includes(lowerQuery);
      const descMatch = site.description.toLowerCase().includes(lowerQuery);
      const urlMatch = site.url.toLowerCase().includes(lowerQuery);
      const domainMatch = site.url.replace('https://', '').replace('http://', '').split('/')[0].includes(lowerQuery);
      
      return titleMatch || descMatch || urlMatch || domainMatch;
    }).sort((a, b) => {
      const aUrlMatch = a.url.toLowerCase().includes(lowerQuery) ? 2 : 0;
      const aTitleMatch = a.title.toLowerCase().includes(lowerQuery) ? 1 : 0;
      const bUrlMatch = b.url.toLowerCase().includes(lowerQuery) ? 2 : 0;
      const bTitleMatch = b.title.toLowerCase().includes(lowerQuery) ? 1 : 0;
      
      return (bUrlMatch + bTitleMatch) - (aUrlMatch + aTitleMatch);
    });

    setResults(searchResults);
    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-2 text-black">
            Mad Search
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
                onChange={(e) => {
                  const newQuery = e.target.value;
                  setQuery(newQuery);
                  performSearch(newQuery);
                }}
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