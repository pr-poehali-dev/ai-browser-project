import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import MadSearch from '@/components/MadSearch';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Index = () => {
  const [url, setUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMadSearch, setShowMadSearch] = useState(false);
  const [desktopMode, setDesktopMode] = useState(false);
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [translateLang, setTranslateLang] = useState('ru');
  const [showSponsors, setShowSponsors] = useState(false);
  const [fractionNum1, setFractionNum1] = useState('');
  const [fractionDen1, setFractionDen1] = useState('');
  const [fractionNum2, setFractionNum2] = useState('');
  const [fractionDen2, setFractionDen2] = useState('');
  const [fractionOp, setFractionOp] = useState('+');
  const [fractionResult, setFractionResult] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showVideos, setShowVideos] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [savedVideos, setSavedVideos] = useState<string[]>([]);

  const allSites = [
    { icon: 'MessageCircle', label: 'VK Channel', url: 'https://vk.com/madstudiosofc', color: 'text-blue-500', openInApp: true, tags: ['vk', 'социальная сеть', 'канал', 'mad'] },
    { icon: 'MessageSquare', label: 'VK', url: 'https://vk.com', color: 'text-blue-600', openInApp: false, tags: ['vk', 'вконтакте', 'социальная сеть'] },
    { icon: 'Send', label: 'Telegram channel', url: 'https://t.me/MadStudiosOFC', color: 'text-blue-400', openInApp: true, tags: ['telegram', 'телеграм', 'канал', 'mad'] },
    { icon: 'Rocket', label: 'Poehali.dev', url: 'https://poehali.dev', color: 'text-orange-500', openInApp: false, tags: ['поехали', 'разработка', 'сайты', 'код'] },
    { icon: 'Tv', label: 'Kion', url: 'https://kion.ru', color: 'text-purple-600', openInApp: false, tags: ['кион', 'фильмы', 'сериалы', 'видео'] },
    { icon: 'Play', label: 'Rutube', url: 'https://rutube.ru', color: 'text-blue-600', openInApp: false, tags: ['рутуб', 'видео', 'rutube'] },
    { icon: 'ShoppingBag', label: 'Avito', url: 'https://avito.ru', color: 'text-green-600', openInApp: false, tags: ['avito', 'авито', 'объявления', 'покупки', 'продажи'] },
    { icon: 'Package', label: 'Trashbox.ru', url: 'https://trashbox.ru', color: 'text-purple-500', openInApp: true, tags: ['trashbox', 'траш', 'железо', 'компьютеры'] },
    { icon: 'Swords', label: 'Warzone', url: 'http://warzonepolitik.wuaze.com', color: 'text-red-600', openInApp: false, tags: ['warzone', 'варзон', 'игра', 'политика'] },
    { icon: 'Bot', label: 'ChatGPT', url: 'https://chatgpt.com', color: 'text-emerald-500', openInApp: false, tags: ['chatgpt', 'чатгпт', 'гпт', 'ai', 'ии', 'искусственный интеллект', 'openai'] },
  ];

  const handleSearch = (query: string) => {
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      const results = allSites.filter(site => 
        site.label.toLowerCase().includes(lowerQuery) ||
        site.url.toLowerCase().includes(lowerQuery) ||
        site.tags.some(tag => tag.includes(lowerQuery))
      );
      
      if (results.length > 0) {
        setSearchResults(results);
        setShowMadSearch(false);
        setCurrentUrl('');
      } else {
        setSearchQuery(query);
        setShowMadSearch(true);
        setCurrentUrl('');
        setSearchResults([]);
      }
    }
  };

  const handleNavigate = (targetUrl: string) => {
    setUrl(targetUrl);
    setCurrentUrl(targetUrl);
    setShowMadSearch(false);
    setIframeError(false);
    toast.success('Переход выполнен');
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      let finalUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        if (url.includes('.')) {
          finalUrl = 'https://' + url;
        } else {
          finalUrl = `https://go.mail.ru/search?q=${encodeURIComponent(url)}`;
        }
      }
      setUrl(finalUrl);
      setCurrentUrl(finalUrl);
      setIframeError(false);
      toast.success('Переход выполнен');
    }
  };

  const toggleDesktopMode = () => {
    const newMode = !desktopMode;
    setDesktopMode(newMode);
    toast.success(newMode ? 'Версия для ПК' : 'Мобильная версия');
    if (currentUrl) {
      setCurrentUrl(currentUrl + '?r=' + Date.now());
    }
  };

  const translateCurrentSite = () => {
    if (!currentUrl) {
      toast.error('Нет открытого сайта для перевода');
      return;
    }
    const translatedUrl = `https://translate.google.com/translate?sl=auto&tl=${translateLang}&u=${encodeURIComponent(currentUrl)}`;
    setCurrentUrl(translatedUrl);
    setUrl(translatedUrl);
    toast.success('Сайт переводится...');
  };

  const handleCalculate = () => {
    try {
      const result = eval(calcInput);
      setCalcResult(result.toString());
    } catch {
      setCalcResult('Ошибка');
      toast.error('Неверное выражение');
    }
  };

  const handleCalcButton = (value: string) => {
    if (value === '=') {
      handleCalculate();
    } else if (value === 'C') {
      setCalcInput('');
      setCalcResult('');
    } else {
      setCalcInput(calcInput + value);
    }
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;

    const messageText = chatInput.trim();
    const userMessage = { role: 'user' as const, content: messageText };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/7a89db06-7752-4cc5-b58a-9a9235d4033a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          apiKey: 'madai_EyxjfmsyDZWU35NR1BFFmMVBid8Zk6iWWT8V26iyRxM'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI Error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('AI Response:', data);
      
      let content = 'Ответ получен';
      if (typeof data === 'string') {
        content = data;
      } else if (data.ai_response?.content) {
        content = data.ai_response.content;
      } else if (data.choices && data.choices[0]?.message?.content) {
        content = data.choices[0].message.content;
      } else if (data.response) {
        content = data.response;
      } else if (data.message) {
        content = data.message;
      } else if (data.content) {
        content = data.content;
      } else if (data.answer) {
        content = data.answer;
      } else if (data.text) {
        content = data.text;
      }
      
      const assistantMessage = {
        role: 'assistant' as const,
        content: content
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Ошибка соединения с ИИ');
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Ошибка соединения с ИИ' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const calcButtons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', 'C'];

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const calculateFractions = () => {
    const n1 = parseInt(fractionNum1) || 0;
    const d1 = parseInt(fractionDen1) || 1;
    const n2 = parseInt(fractionNum2) || 0;
    const d2 = parseInt(fractionDen2) || 1;

    if (d1 === 0 || d2 === 0) {
      toast.error('Знаменатель не может быть нулём');
      return;
    }

    let resultNum = 0;
    let resultDen = 1;

    switch (fractionOp) {
      case '+':
        resultNum = n1 * d2 + n2 * d1;
        resultDen = d1 * d2;
        break;
      case '-':
        resultNum = n1 * d2 - n2 * d1;
        resultDen = d1 * d2;
        break;
      case '*':
        resultNum = n1 * n2;
        resultDen = d1 * d2;
        break;
      case '/':
        if (n2 === 0) {
          toast.error('Деление на ноль');
          return;
        }
        resultNum = n1 * d2;
        resultDen = d1 * n2;
        break;
    }

    const divisor = gcd(Math.abs(resultNum), Math.abs(resultDen));
    resultNum = resultNum / divisor;
    resultDen = resultDen / divisor;

    if (resultDen < 0) {
      resultNum = -resultNum;
      resultDen = -resultDen;
    }

    if (resultDen === 1) {
      setFractionResult(`${resultNum}`);
    } else {
      setFractionResult(`${resultNum}/${resultDen}`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex items-center gap-2 p-3 border-b shadow-sm bg-white">
        <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center gap-2">
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            className="shrink-0"
            onClick={() => {
              setCurrentUrl('');
              setUrl('');
              setSearchQuery('');
              setShowMadSearch(false);
            }}
          >
            <Icon name="Home" size={20} />
          </Button>
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            className="shrink-0"
            onClick={() => currentUrl && setCurrentUrl(currentUrl)}
          >
            <Icon name="RotateCw" size={20} />
          </Button>
          
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
            <Icon name="Lock" size={16} className="text-gray-500" />
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Поиск или введите URL"
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            />
          </div>
        </form>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <Icon name="MoreVertical" size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Меню</SheetTitle>
            </SheetHeader>
            
            <Tabs defaultValue="settings" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="settings">
                  <Icon name="Settings" size={16} />
                </TabsTrigger>
                <TabsTrigger value="calculator">
                  <Icon name="Calculator" size={16} />
                </TabsTrigger>
                <TabsTrigger value="ai">
                  <Icon name="Bot" size={16} />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="settings" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Настройки просмотра</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant={desktopMode ? "default" : "outline"} 
                      className="w-full justify-start gap-2"
                      onClick={toggleDesktopMode}
                    >
                      <Icon name="Monitor" size={18} />
                      {desktopMode ? 'Версия для ПК включена' : 'Версия для ПК'}
                    </Button>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Перевести сайт</label>
                      <div className="flex gap-2">
                        <select 
                          value={translateLang} 
                          onChange={(e) => setTranslateLang(e.target.value)}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                        >
                          <option value="ru">Русский</option>
                          <option value="en">English</option>
                          <option value="zh-CN">中文</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                          <option value="ja">日本語</option>
                          <option value="ko">한국어</option>
                          <option value="ar">العربية</option>
                          <option value="pt">Português</option>
                        </select>
                        <Button onClick={translateCurrentSite} size="icon" className="shrink-0">
                          <Icon name="Languages" size={18} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calculator" className="mt-4">
                <ScrollArea className="h-[calc(100vh-180px)]">
                  <div className="space-y-4 pr-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Калькулятор</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Input
                          value={calcInput}
                          onChange={(e) => setCalcInput(e.target.value)}
                          placeholder="0"
                          className="text-right text-lg font-mono"
                        />
                        <div className="text-right text-2xl font-bold text-primary min-h-[32px]">
                          {calcResult}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {calcButtons.map((btn) => (
                          <Button
                            key={btn}
                            variant={btn === '=' ? 'default' : btn === 'C' ? 'destructive' : 'outline'}
                            onClick={() => handleCalcButton(btn)}
                            className="h-12 text-lg font-semibold"
                          >
                            {btn}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Калькулятор дробей</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="flex flex-col items-center gap-1">
                            <Input
                              type="number"
                              value={fractionNum1}
                              onChange={(e) => setFractionNum1(e.target.value)}
                              placeholder="числитель"
                              className="text-center"
                            />
                            <div className="w-full h-[2px] bg-border"></div>
                            <Input
                              type="number"
                              value={fractionDen1}
                              onChange={(e) => setFractionDen1(e.target.value)}
                              placeholder="знаменатель"
                              className="text-center"
                            />
                          </div>
                        </div>

                        <select
                          value={fractionOp}
                          onChange={(e) => setFractionOp(e.target.value)}
                          className="w-12 h-12 text-center text-xl font-bold border rounded-md"
                        >
                          <option value="+">+</option>
                          <option value="-">−</option>
                          <option value="*">×</option>
                          <option value="/">÷</option>
                        </select>

                        <div className="flex-1">
                          <div className="flex flex-col items-center gap-1">
                            <Input
                              type="number"
                              value={fractionNum2}
                              onChange={(e) => setFractionNum2(e.target.value)}
                              placeholder="числитель"
                              className="text-center"
                            />
                            <div className="w-full h-[2px] bg-border"></div>
                            <Input
                              type="number"
                              value={fractionDen2}
                              onChange={(e) => setFractionDen2(e.target.value)}
                              placeholder="знаменатель"
                              className="text-center"
                            />
                          </div>
                        </div>
                      </div>

                      <Button onClick={calculateFractions} className="w-full" size="lg">
                        Вычислить
                      </Button>

                      {fractionResult && (
                        <div className="text-center text-2xl font-bold text-primary p-4 bg-secondary rounded-lg">
                          = {fractionResult}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="ai" className="mt-4">
                <Card className="h-[calc(100vh-240px)] flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">MadAI</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-0">
                    <ScrollArea className="flex-1 px-4">
                      <div className="space-y-4 py-4">
                        {chatMessages.length === 0 && (
                          <div className="text-center text-muted-foreground py-8">
                            Задайте вопрос ИИ помощнику
                          </div>
                        )}
                        {chatMessages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                                message.role === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-gray-100 text-foreground'
                              }`}
                            >
                              {message.content}
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-2xl px-4 py-2">
                              <Icon name="Loader2" size={16} className="animate-spin" />
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                    <div className="p-4 border-t">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          sendMessage();
                        }}
                        className="flex gap-2"
                      >
                        <Input
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Напишите сообщение..."
                          disabled={isLoading}
                        />
                        <Button type="submit" size="icon" disabled={isLoading}>
                          <Icon name="Send" size={18} />
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1 bg-gray-50 overflow-hidden relative">
        {showMadSearch ? (
          <MadSearch onNavigate={handleNavigate} initialQuery={searchQuery} />
        ) : currentUrl ? (
          <div className="w-full h-full relative">
            <iframe
              src={currentUrl}
              className="w-full h-full border-0"
              title="Browser Content"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
              onError={() => setIframeError(true)}
              style={desktopMode ? { width: '100%', minWidth: '1024px' } : {}}
            />
            {iframeError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-8">
                <Icon name="AlertCircle" size={64} className="text-orange-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Сайт заблокировал загрузку</h2>
                <p className="text-gray-600 text-center mb-6 max-w-md">
                  Некоторые сайты не разрешают открытие в браузере.
                  Откройте сайт в новой вкладке.
                </p>
                <Button
                  onClick={() => {
                    window.open(currentUrl, '_blank');
                    setIframeError(false);
                  }}
                  className="mb-2"
                >
                  <Icon name="ExternalLink" size={18} className="mr-2" />
                  Открыть в новой вкладке
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentUrl('');
                    setUrl('');
                    setIframeError(false);
                  }}
                >
                  <Icon name="Home" size={18} className="mr-2" />
                  Вернуться на главную
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 overflow-auto h-full">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center space-y-4 pt-20">
                <h1 className="text-4xl font-bold text-gray-800">Mad Browser</h1>
                <p className="text-gray-600">С MadAI и Mad Search</p>
              </div>

              <div className="bg-white rounded-full shadow-lg p-2">
                <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }}>
                  <div className="flex items-center gap-2 px-4">
                    <Icon name="Search" size={20} className="text-gray-400" />
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (!e.target.value.trim()) {
                          setSearchResults([]);
                        }
                      }}
                      placeholder="Поиск в Mad Search или введите URL"
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                    />
                    <Button type="submit" size="icon" variant="ghost" className="shrink-0">
                      <Icon name="ArrowRight" size={20} />
                    </Button>
                  </div>
                </form>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Найденные сайты</h2>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSearchResults([]);
                        setSearchQuery('');
                      }}
                    >
                      Закрыть
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {searchResults.map((site) => (
                      <Card 
                        key={site.label}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          if (site.openInApp) {
                            window.open(site.url, '_blank');
                          } else {
                            handleNavigate(site.url);
                          }
                          setSearchResults([]);
                          setSearchQuery('');
                        }}
                      >
                        <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                          <Icon name={site.icon} size={32} className={site.color} />
                          <span className="text-sm font-medium text-gray-700">{site.label}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {!showSponsors && !showVideos && searchResults.length === 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    ...allSites.slice(0, 7),
                    { icon: 'Video', label: 'Видео', url: 'videos', color: 'text-red-500', openInApp: false, isSpecial: true, tags: [] },
                    { icon: 'Users', label: 'Сайты спонсоров', url: 'sponsors', color: 'text-green-500', openInApp: false, isSpecial: true, tags: [] },
                  ].map((item) => (
                    <Card 
                      key={item.label} 
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        if (item.isSpecial && item.url === 'videos') {
                          setShowVideos(true);
                          return;
                        }
                        if (item.isSpecial && item.url === 'sponsors') {
                          setShowSponsors(true);
                          return;
                        }
                        if (item.openInApp) {
                          window.open(item.url, '_blank');
                        } else {
                          handleNavigate(item.url);
                        }
                      }}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                        <Icon name={item.icon} size={32} className={item.color} />
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : showVideos ? (
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowVideos(false)}
                    className="mb-4"
                  >
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    Назад
                  </Button>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Добавить видео</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (videoUrl.trim()) {
                          setSavedVideos([...savedVideos, videoUrl]);
                          setVideoUrl('');
                          toast.success('Видео добавлено');
                        }
                      }} className="flex gap-2">
                        <Input
                          type="text"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="Вставьте ссылку на видео (YouTube, VK и др.)"
                          className="flex-1"
                        />
                        <Button type="submit">
                          <Icon name="Plus" size={16} className="mr-2" />
                          Добавить
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {savedVideos.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">Сохранённые видео</h3>
                      <div className="grid gap-4">
                        {savedVideos.map((video, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <Icon name="Video" size={24} className="text-red-500 shrink-0 mt-1" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-600 break-all">{video}</p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      window.open(video, '_blank');
                                    }}
                                  >
                                    <Icon name="ExternalLink" size={16} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setSavedVideos(savedVideos.filter((_, i) => i !== index));
                                      toast.success('Видео удалено');
                                    }}
                                  >
                                    <Icon name="Trash2" size={16} className="text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Icon name="Video" size={48} className="mx-auto mb-2 text-gray-300" />
                      <p>Нет сохранённых видео</p>
                      <p className="text-sm">Добавьте первое видео по ссылке</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSponsors(false)}
                    className="mb-4"
                  >
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    Назад
                  </Button>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {allSites.filter(site => 
                      site.label === 'Trashbox.ru' || 
                      site.label === 'Poehali.dev' || 
                      site.label === 'Warzone'
                    ).map((item) => (
                      <Card 
                        key={item.label} 
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          if (item.openInApp) {
                            window.open(item.url, '_blank');
                          } else {
                            handleNavigate(item.url);
                          }
                        }}
                      >
                        <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                          <Icon name={item.icon} size={32} className={item.color} />
                          <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;