# Reddit Monitoring Setup for ownvsrent.io

Simple setup to monitor Reddit for rent vs buy discussions using Claude Desktop.

## Prerequisites

- Claude Desktop app (macOS) with Pro/Max subscription
- Reddit account

---

## Step 1: Get Reddit API Credentials

1. Go to **https://www.reddit.com/prefs/apps**
2. Scroll down, click **"create another app..."**
3. Fill in:
   - **name:** `ownvsrent-monitor`
   - **type:** Select **script**
   - **description:** `Monitor rent vs buy discussions`
   - **redirect uri:** `http://localhost:8080`
4. Click **"create app"**
5. Save your credentials:
   - **Client ID:** The string under your app name
   - **Client Secret:** The secret shown

---

## Step 2: Add Reddit MCP to Claude Desktop

1. Open **Claude Desktop**
2. Go to **Settings > Developer > Edit Config**
3. Add this to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "reddit": {
      "command": "npx",
      "args": ["-y", "@anthropic/reddit-mcp"],
      "env": {
        "REDDIT_CLIENT_ID": "YOUR_CLIENT_ID_HERE",
        "REDDIT_CLIENT_SECRET": "YOUR_CLIENT_SECRET_HERE",
        "REDDIT_USERNAME": "YOUR_REDDIT_USERNAME",
        "REDDIT_PASSWORD": "YOUR_REDDIT_PASSWORD"
      }
    }
  }
}
```

4. Replace the placeholders with your actual credentials
5. Save the file
6. **Completely quit and restart Claude Desktop**

---

## Step 3: Verify It Works

1. Open a new chat in Claude Desktop
2. Click the **"+"** button at the bottom
3. Select **"Connectors"** - you should see Reddit listed
4. Test with: "Search Reddit r/personalfinance for posts about rent vs buy"

---

## Step 4: Daily Usage

Just tell Claude:

> "Search r/personalfinance and r/realestate for recent posts asking about rent vs buy. Show me ones that need helpful responses."

Then for each post:

> "Draft a helpful response to this post. Be genuinely helpful first, only mention ownvsrent.io if it's truly relevant."

Review the draft, edit if needed, then manually post it on Reddit.

---

## Subreddits to Monitor

- r/personalfinance
- r/realestate
- r/FirstTimeHomeBuyer
- r/RealEstateInvesting
- r/financialindependence
- r/HousingMarket

## Keywords to Search

- "rent vs buy"
- "should I buy a house"
- "rent or own"
- "renting vs buying"
- "is buying worth it"

---

## Tips for Good Responses

1. **Answer their question first** - Don't lead with your site
2. **Use specific numbers** - Price-to-rent ratio, break-even years
3. **Be genuinely helpful** - Not salesy
4. **Mention site only when relevant** - And only at the end, naturally
5. **Follow subreddit rules** - Some ban self-promotion

---

## Alternative: Manual Workflow (No MCP)

If MCP setup doesn't work, you can still:

1. Browse Reddit manually for relevant posts
2. Copy the post text
3. Paste into Claude Desktop: "Help me draft a response to this Reddit post about rent vs buy: [paste post]"
4. Review, edit, post manually

This works today with zero setup.
