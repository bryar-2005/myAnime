# Railway Environment Variables Guide

To make your website work, you need to handle two different parts in your Railway dashboard.

---

## Part 1: The MySQL Service (The Database)
**You do NOT need to write anything here.**
Railway automatically generates these variables for you. Just click on the **MySQL** box and go to the **Variables** tab to see them. You will see things like:
- `MYSQLHOST`
- `MYSQLPASSWORD`
- `MYSQLPORT`
- `MYSQLUSER`
- `MYSQLDATABASE`

---

## Part 2: The `myAnime` Service (The Website)
**This is where you MUST add the variables.**
Click on your **`myAnime`** box, go to the **Variables** tab, and add these one by one:

### 🔗 Connecting to the Database
Copy these exactly. The `${{...}}` parts tell Railway to "link" to your MySQL service automatically.

| Variable Name | Value (Copy & Paste) |
| :--- | :--- |
| `DB_CONNECTION` | `mysql` |
| `DB_HOST` | `${{MySQL.MYSQLHOST}}` |
| `DB_PORT` | `${{MySQL.MYSQLPORT}}` |
| `DB_DATABASE` | `${{MySQL.MYSQLDATABASE}}` |
| `DB_USERNAME` | `${{MySQL.MYSQLUSER}}` |
| `DB_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |

### ⚙️ Website Configuration
| Variable Name | Value |
| :--- | :--- |
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_KEY` | `base64:sy+1VNXJ32rA2lXxdMtr/0SEW9ENQpIi7CXgHFEGqBI=` |
| `APP_URL` | `https://your-public-link.up.railway.app` |
| `VITE_API_URL` | `https://your-public-link.up.railway.app/api` |
| `ALLOW_SIGNUP` | `false` |

---

## Final Step: Database Setup
After adding the variables above:
1. Go to **Settings** tab of the `myAnime` service.
2. Scroll to **Deployments** -> **Post-Deploy Command**.
3. Enter: `php artisan migrate --seed --force`
4. Click **Update**.
