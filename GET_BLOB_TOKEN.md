# How to Get Your Vercel Blob Storage Token

## Quick Steps

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com) and sign in
   - Select your project (or create one if needed)

2. **Navigate to Storage**
   - Click on your project
   - Go to the **Storage** tab
   - If you don't have Blob Storage yet, click **Create Database** → Select **Blob**

3. **Get the Token**
   - Click on your Blob Storage instance
   - Go to **Settings** tab
   - Find **Environment Variables** section
   - Look for `BLOB_READ_WRITE_TOKEN`
   - Click **Show** or **Copy** to reveal the token

4. **Add to `.env.local`**
   - Open `admin-dashboard/.env.local`
   - Set the token:
     ```bash
     BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ```
   - Save the file

5. **Run Migration Again**
   ```bash
   cd admin-dashboard
   npm run migrate-images
   ```

## Alternative: Create Blob Storage via Vercel CLI

If you prefer command line:

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Link your project (if not already linked)
cd admin-dashboard
vercel link

# Create Blob Storage
vercel blob create

# The token will be displayed - copy it to .env.local
```

## Token Format

The token should look like:
```
vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

It starts with `vercel_blob_rw_` followed by a long string of characters.

## Troubleshooting

- **Token not showing**: Make sure you're in the correct project and have admin access
- **Token invalid**: Double-check for extra spaces or line breaks when copying
- **Still getting error**: Restart your terminal/IDE after adding the token

