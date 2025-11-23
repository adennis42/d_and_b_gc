# Creating Vercel Blob Storage - Step by Step

If you can't find the BLOB_READ_WRITE_TOKEN, you may need to create Blob Storage first.

## Option 1: Create via Vercel Dashboard

### Step 1: Navigate to Your Project
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project (or create one if you haven't deployed yet)

### Step 2: Create Blob Storage
1. In your project dashboard, click on the **Storage** tab (in the top navigation)
2. If you see "Create Database" or "Add Storage" button, click it
3. Select **Blob** from the list of storage options
4. Choose a name (e.g., `contractor-images` or `blob-storage`)
5. Select a region (choose closest to your users, or default)
6. Click **Create** or **Add**

### Step 3: Get the Token
After creating Blob Storage, you should see:
- A success message
- The Blob Storage instance in your Storage list
- Click on the Blob Storage instance
- Go to **Settings** tab
- Look for **Environment Variables** section
- You should see `BLOB_READ_WRITE_TOKEN` listed there
- Click **Show** or **Copy** to reveal the token

**Note**: The token format is: `vercel_blob_rw_` followed by a long string

## Option 2: Create via Vercel CLI (Easier)

If the dashboard is confusing, use the CLI:

### Step 1: Install Vercel CLI (if not installed)
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Link Your Project (if not already linked)
```bash
cd admin-dashboard
vercel link
```
Follow the prompts to select your project.

### Step 4: Create Blob Storage
```bash
vercel blob create
```

This will:
- Create a new Blob Storage instance
- Display the `BLOB_READ_WRITE_TOKEN` immediately
- You can copy it right away

### Step 5: Add Token to .env.local
Copy the token and add it to `admin-dashboard/.env.local`:
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

## Option 3: Check Existing Storage

If you think you already have Blob Storage:

1. Go to Vercel Dashboard → Your Project
2. Click **Storage** tab
3. Look for any Blob Storage instances
4. Click on it
5. Go to **Settings** → **Environment Variables**
6. The token should be there

## Troubleshooting

### "Storage tab not visible"
- Make sure you're in the correct project
- You need to have deployed the project at least once (or created it)
- Try refreshing the page

### "No Blob option"
- Make sure you're looking at the Storage section, not Databases
- Blob Storage might be under "Add Storage" → "Blob"
- Some accounts might need to enable it first

### "Token not showing"
- Make sure you're in the Settings tab of the Blob Storage instance
- Look for "Environment Variables" or "Tokens" section
- Try refreshing the page

## Alternative: Use Vercel CLI to Get Token

If you can't find it in the dashboard, use CLI:

```bash
# List all storage instances
vercel storage ls

# Get details (including token) for a specific storage
vercel storage inspect <storage-name>
```

## Still Can't Find It?

If you still can't find or create Blob Storage:

1. **Check your Vercel plan**: Blob Storage is available on all plans, but some features might be limited
2. **Contact Vercel support**: They can help you set it up
3. **Use alternative**: We could temporarily use a different storage solution, but Vercel Blob is recommended for this setup

## After Getting the Token

Once you have the token:

1. Add it to `admin-dashboard/.env.local`:
   ```bash
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
   ```

2. Save the file

3. Run the migration:
   ```bash
   cd admin-dashboard
   npm run migrate-images
   ```

