import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Index = () => {
  const [url, setUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [desktopMode, setDesktopMode] = useState(false);
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      setUrl(searchUrl);
      setCurrentUrl(searchUrl);
      setSearchQuery('');
      toast.success('Поиск выполнен');
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      let finalUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        if (url.includes('.')) {
          finalUrl = 'https://' + url;
        } else {
          finalUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
        }
      }
      setUrl(finalUrl);
      setCurrentUrl(finalUrl);
      toast.success('Переход выполнен');
    }
  };

  const toggleDesktopMode = () => {
    setDesktopMode(!desktopMode);
    toast.success(desktopMode ? 'Мобильная версия' : 'Версия для ПК');
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

    const userMessage = { role: 'user' as const, content: chatInput };
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
          prompt: chatInput,
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

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex items-center gap-2 p-3 border-b shadow-sm bg-white">
        <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="shrink-0">
            <Icon name="ArrowRight" size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="shrink-0">
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
                  <CardContent>
                    <Button 
                      variant={desktopMode ? "default" : "outline"} 
                      className="w-full justify-start gap-2"
                      onClick={toggleDesktopMode}
                    >
                      <Icon name="Monitor" size={18} />
                      {desktopMode ? 'Версия для ПК включена' : 'Версия для ПК'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calculator" className="mt-4">
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
              </TabsContent>

              <TabsContent value="ai" className="mt-4">
                <Card className="h-[calc(100vh-240px)] flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Icon name="Bot" size={18} />
                      ИИ Помощник
                    </CardTitle>
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
        {currentUrl ? (
          <iframe
            src={currentUrl}
            className="w-full h-full border-0"
            title="Browser Content"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
          />
        ) : (
          <div className="p-6 overflow-auto h-full">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center space-y-4 pt-20">
                <h1 className="text-4xl font-bold text-gray-800">Умный Браузер</h1>
                <p className="text-gray-600">с искусственным интеллектом</p>
              </div>

              <div className="bg-white rounded-full shadow-lg p-2">
                <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }}>
                  <div className="flex items-center gap-2 px-4">
                    <Icon name="Search" size={20} className="text-gray-400" />
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Поиск в Google или введите URL"
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                    />
                    <Button type="submit" size="icon" variant="ghost" className="shrink-0">
                      <Icon name="ArrowRight" size={20} />
                    </Button>
                  </div>
                </form>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: 'Youtube', label: 'YouTube', url: 'https://youtube.com', color: 'text-red-500' },
                  { icon: 'Mail', label: 'Gmail', url: 'https://mail.google.com', color: 'text-blue-500' },
                  { icon: 'Github', label: 'GitHub', url: 'https://github.com', color: 'text-gray-800' },
                  { icon: 'Twitter', label: 'Twitter', url: 'https://twitter.com', color: 'text-sky-500' },
                ].map((item) => (
                  <Card 
                    key={item.label} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setUrl(item.url);
                      setCurrentUrl(item.url);
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;