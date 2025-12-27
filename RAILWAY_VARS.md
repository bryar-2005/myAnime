# Railway Environment Variables

Copy these keys into the **Variables** tab of your **myAnime** service on Railway.

### 📋 Required Keys

| Key | Value (Example) | Description |
| :--- | :--- | :--- |
| `APP_ENV` | `production` | Set to production mode |
| `APP_DEBUG` | `false` | Disable debug mode for security |
| `APP_KEY` | `base64:YOUR_GENERATED_KEY` | Run `php artisan key:generate --show` locally to get one |
| `APP_URL` | `https://your-app-name.up.railway.app` | Your Railway public URL |
| `VITE_API_URL` | `https://your-app-name.up.railway.app/api` | Your public URL followed by /api |
| `ALLOW_SIGNUP` | `false` | Set to `true` if you want to allow new users |

### 🗄️ Database Connection
Railway automatically provides some database variables when you add a MySQL service. You should link them or add these:

| Key | Value |
| :--- | :--- |
| `DB_CONNECTION` | `mysql` |
| `DB_HOST` | `${{MySQL.MYSQLHOST}}` |
| `DB_PORT` | `${{MySQL.MYSQLPORT}}` |
| `DB_DATABASE` | `${{MySQL.MYSQLDATABASE}}` |
| `DB_USERNAME` | `${{MySQL.MYSQLUSER}}` |
| `DB_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |

> [!TIP]
> In Railway, you can use the `${{...}}` syntax to automatically pull the values from your MySQL service. This way, if the password changes, your app will still work!

### 🛠️ Final Steps
After adding these variables, Railway will redeploy your app. Once it finishes:
1. Go to the **Settings** tab of your app.
2. Under **Deployments**, look for **"Post-Deploy Command"** or use the **"Terminal"** tab.
3. Run: `php artisan migrate --force` to set up your tables.
