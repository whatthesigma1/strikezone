# StrikeZone — Paintball Shop

Полный стек: **React + Tailwind CSS** (фронтенд) + **Django REST Framework** (бэкенд).

---

## Структура проекта

```
strikezone/
├── frontend/          # React + Vite + Tailwind
│   └── src/
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── Hero.jsx
│       │   ├── ProductCard.jsx
│       │   ├── Products.jsx
│       │   ├── CartSidebar.jsx
│       │   ├── CheckoutModal.jsx
│       │   ├── OrderSuccess.jsx
│       │   └── Toast.jsx
│       ├── context/
│       │   └── CartContext.jsx      # useReducer cart state
│       ├── hooks/
│       │   └── useProducts.js       # API + fallback data
│       ├── utils/
│       │   └── api.js               # fetch wrapper
│       └── App.jsx
│
└── backend/           # Django + DRF
    └── strikezone/
        ├── apps/
        │   ├── products/            # Product model + API
        │   └── orders/             # Order model + checkout API
        ├── settings/base.py
        ├── urls.py
        └── urls_api.py
```

---

## Запуск бэкенда (Django)

```bash
cd backend

# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Установить зависимости
pip install -r requirements.txt

# Применить миграции
python manage.py makemigrations products orders
python manage.py migrate

# Заполнить базу тестовыми товарами
python manage.py seed_products

# Запустить сервер
python manage.py runserver
# → http://localhost:8000
```

### API endpoints

| Method | URL | Описание |
|--------|-----|----------|
| GET | `/api/products/` | Список товаров (фильтр: `?category=Маркеры`) |
| GET | `/api/products/categories/` | Категории с количеством |
| POST | `/api/orders/` | Создать заказ |
| POST | `/api/orders/validate-promo/` | Проверить промокод |

Промокод для теста: **STRIKE10** (скидка 10%)

---

## Запуск фронтенда (React)

```bash
cd frontend

npm install
npm run dev
# → http://localhost:5173
```

> Фронтенд автоматически проксирует `/api` на `localhost:8000` (настроено в `vite.config.js`).  
> Если бэкенд недоступен — используются встроенные тестовые данные.

---

## Переменные окружения (фронтенд)

Создайте `.env` в папке `frontend/`:

```
VITE_API_URL=http://localhost:8000/api
```

---

## Функционал

- 🛒 Корзина с `useReducer` (добавление, изменение кол-ва, удаление)
- 🔍 Фильтрация товаров по категориям
- ❤️ Вишлист (локальное состояние)
- 💳 4-шаговый чекаут (Контакты → Доставка → Оплата → Подтверждение)
- 🎟️ Промокоды (`STRIKE10`)
- ✅ Валидация формы на каждом шаге
- 📦 REST API Django с моделями Product и Order
- 🌐 CORS настроен для dev-сервера Vite
