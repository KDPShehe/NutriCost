# 🇬🇧 English Version

## 🥗 NutriCost - Nutrition & Cost Calculator

**NutriCost** is a full-stack web application designed to calculate calories, macronutrients (proteins, fats, carbs), and the cost of homemade meals. The app features a personal ingredient database, recipe builder, meal comparison tool, and a nutrition tracking calendar.

### ✨ Key Features

* **🍎 Ingredient Database:** Add, edit, and remove ingredients with custom nutrient and price data.
* **🍳 Meal Builder:** Combine ingredients to create meals with automatic calculation of total weight, energy value, and cost.
* **⚖️ Comparison Tool:** Visually compare two meals side-by-side based on their nutritional value.
* **📅 Nutrition Calendar:** Save consumed meals to a calendar and view daily/weekly statistics.
* **👤 Account System:** Data is stored locally on the server for each user individually (using a file-based JSON system).
* **🌍 Localization:** Full support for **English (EN)** and **Ukrainian (UK)** languages.
* **🌙 Themes:** Switch between Light and Dark modes.

---

### 🚀 Installation & Setup Guide

Since this application uses a local Node.js server to store user data in JSON files, you need to run the backend for the app to work.

#### Prerequisites
You must have **Node.js** installed. If not, download and install it from the [official website](https://nodejs.org/).

#### Step 1: Download the Project
Clone this repository or download the ZIP file and extract it.
```bash
git clone [https://github.com/KDPShehe/NutriCost.git](https://github.com/KDPShehe/NutriCost.git)
````

#### Step 2: Setup the Server (Backend)

1.  Open your terminal (command line).
2.  Navigate to the `server` folder:
    ```bash
    cd server
    ```
3.  Install the required dependencies (run this only once):
    ```bash
    npm install
    ```
    *(This installs `express` and `cors` libraries)*.

#### Step 3: Run the Server

1.  While inside the `server` folder, start the backend:
    ```bash
    node server.js
    ```
2.  You should see the message:
    > Server running on http://localhost:3000

**Note:** Keep the terminal window open while using the app.

### 🔧 Step 4: Run the Application (Frontend)

### ✔️ Using VS Code (Recommended)

1.  Open the project folder in **Visual Studio Code**
2.  Install the **Live Server** extension:
    -   Go to **Extensions** panel (Ctrl+Shift+X)
    -   Search for **"Live Server"**
    -   Click **Install**
3.  In the Explorer panel, find **index.html**
4.  Right‑click **index.html**
5.  Select **"Open with Live Server"**

A browser window will open automatically with the app running.
-----

### 📖 How to Use

**Sign Up / Login:**
      * Click **"Get Started"**. Go to the **Sign Up** tab.
      * Create a login and password. The server will create a unique data folder for you.

-----

### 🛠 Tech Stack

  * **Frontend:** HTML5, CSS3, Vanilla JavaScript.
  * **Backend:** Node.js, Express.js.
  * **Database:** JSON File System (Local Storage).

-----

-----

# 🇺🇦 Українська версія

## 🥗 NutriCost - Калькулятор Харчування та Вартості

**NutriCost** — це веб-застосунок для розрахунку калорійності, БЖВ (білків, жирів, вуглеводів) та вартості домашніх страв. Додаток дозволяє вести власну базу інгредієнтів, створювати рецепти, порівнювати страви між собою та відстежувати харчування у календарі.

### ✨ Основні можливості

  * **🍎 База інгредієнтів:** Додавання, редагування та видалення інгредієнтів із зазначенням їх нутрієнтів та ціни.
  * **🍳 Конструктор страв:** Створення страв з кількох інгредієнтів з автоматичним підрахунком підсумкової ваги, калорійності та вартості.
  * **⚖️ Порівняння:** Можливість візуально порівняти дві страви за їхньою поживністю.
  * **📅 Календар харчування:** Збереження страв у календар, перегляд статистики за день та за тиждень.
  * **👤 Система акаунтів:** Усі дані зберігаються локально на сервері окремо для кожного користувача (у JSON файлах).
  * **🌍 Мультимовність:** Повна підтримка **Англійської (EN)** та **Української (UK)** мов.
  * **🌙 Теми:** Підтримка світлої та темної теми оформлення.

-----

### 🚀 Як запустити проект (Інструкція)

Для роботи додатку необхідно запустити локальний сервер, оскільки дані користувачів зберігаються у файловій системі.

#### Попередні вимоги

У вас має бути встановлений **Node.js**. Якщо його немає, завантажте та встановіть з [офіційного сайту](https://nodejs.org/).

#### Крок 1: Завантаження

Клонуйте цей репозиторій або завантажте ZIP-архів та розпакуйте його.

```bash
git clone [https://github.com/KDPShehe/NutriCost.git](https://github.com/KDPShehe/NutriCost.git)
```

#### Крок 2: Налаштування Сервера (Backend)

1.  Відкрийте термінал (командний рядок).
2.  Перейдіть у папку `server`:
    ```bash
    cd server
    ```
3.  Встановіть необхідні бібліотеки (це потрібно зробити лише один раз):
    ```bash
    npm install
    ```
    *(Ця команда встановить `express` та `cors`, необхідні для роботи)*.

#### Крок 3: Запуск Сервера

1.  Перебуваючи в папці `server`, запустіть сервер командою:
    ```bash
    node server.js
    ```
2.  Якщо все пройшло успішно, ви побачите повідомлення:
    > Server running on http://localhost:3000

**Важливо:** Не закривайте вікно терміналу, поки користуєтесь сайтом. Сервер має працювати постійно.

## 🚀 Крок 4: Запуск сайту (Frontend)

### ✔️ Через VS Code (Рекомендовано)

1.  Відкрийте папку проєкту у **Visual Studio Code**
2.  Встановіть розширення **Live Server**:
    -   Відкрийте панель розширень (Ctrl+Shift+X)
    -   Знайдіть **"Live Server"**
    -   Натисніть **Install**
3.  У лівій панелі знайдіть файл **index.html**
4.  Клацніть по ньому правою кнопкою
5.  Оберіть **"Open with Live Server"**

Браузер відкриється автоматично, і сайт запуститься.
-----

### 📖 Як користуватися

**Реєстрація:**
      * Натисніть **"Get Started"**. Оберіть вкладку **Sign Up**, придумайте логін та пароль.
      * *Система створить для вас унікальну папку з базовими інгредієнтами.*

-----

### 🛠 Технології

  * **Frontend:** HTML5, CSS3, Vanilla JavaScript.
  * **Backend:** Node.js, Express.js.
  * **Database:** Файлова система JSON (локальне зберігання).

<!-- end list -->

```
```
