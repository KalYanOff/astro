booking - автоматическая отправка заявок через Make webhook

## Настройка Make

1. В Make создайте `Custom webhook`.
2. Скопируйте URL вебхука.
3. В проекте уже можно использовать webhook напрямую в `src/pages/api/booking.js`.
4. Если хотите хранить URL в переменных окружения, скопируйте `.env.example` в `.env` и укажите:
   - `MAKE_WEBHOOK_URL=<ваш webhook URL>`

После этого заявки из формы отправляются автоматически через `/api/booking` в Make, а дальше по вашему сценарию в Telegram.
