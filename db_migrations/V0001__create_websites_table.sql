-- Create websites table for storing website information
CREATE TABLE IF NOT EXISTS websites (
    id SERIAL PRIMARY KEY,
    url VARCHAR(500) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    favicon_url VARCHAR(500),
    category VARCHAR(100),
    is_sponsor BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster searches
CREATE INDEX idx_websites_url ON websites(url);
CREATE INDEX idx_websites_title ON websites(title);
CREATE INDEX idx_websites_category ON websites(category);
CREATE INDEX idx_websites_is_sponsor ON websites(is_sponsor);

-- Insert initial websites from the app
INSERT INTO websites (url, title, description, category, is_sponsor) VALUES
('https://vk.com/madstudiosofc', 'VK Channel', 'Официальный канал Mad Studios в VK', 'social', false),
('https://vk.com', 'VK', 'Социальная сеть ВКонтакте', 'social', false),
('https://t.me/MadStudiosOFC', 'Telegram channel', 'Официальный канал Mad Studios в Telegram', 'social', false),
('https://poehali.dev', 'Poehali.dev', 'Разработка сайтов через ИИ', 'development', false),
('https://kion.ru', 'Kion', 'Онлайн-кинотеатр', 'entertainment', false),
('https://rutube.ru', 'Rutube', 'Видеохостинг', 'entertainment', false),
('https://productradar.ru', 'Product Radar', 'Радар продуктов и сервисов', 'tools', false),
('https://apkpure.com', 'APKPure', 'Скачивание APK файлов для Android', 'apps', false),
('https://androeed.ru', 'Androeed', 'Игры и приложения для Android', 'apps', false),
('https://animego.me', 'AnimeGo', 'Онлайн аниме', 'entertainment', false),
('https://ru.pinterest.com', 'Pinterest', 'Социальная сеть для поиска идей', 'social', false),
('https://cloud.mail.ru', 'Cloud Mail.ru', 'Облачное хранилище', 'storage', false),
('https://chatgpt.org', 'ChatGPT', 'ИИ-ассистент от OpenAI', 'ai', false),
('https://alice.yandex.ru', 'Алиса', 'Голосовой помощник Яндекс', 'ai', false);