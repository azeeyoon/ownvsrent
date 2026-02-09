# Reddit Monitoring Setup for ownvsrent.io

This guide helps you set up Claude Desktop with Reddit MCP to monitor and respond to rent vs buy discussions.

## Prerequisites

- Claude Desktop app (macOS)
- Claude Pro, Max, or Team subscription
- Node.js 18+
- Reddit account

---

## Step 1: Create Reddit API Credentials

1. Go to https://www.reddit.com/prefs/apps
2. Scroll down and click **"create another app..."**
3. Fill in:
   - **name:** `ownvsrent-monitor`
   - **type:** Select `script`
   - **description:** `Monitor rent vs buy discussions`
   - **redirect uri:** `http://localhost:8080`
4. Click **"create app"**
5. Note down:
   - **Client ID:** The string under your app name (looks like `Ab3dE_fGhIj`)
   - **Client Secret:** The secret string shown

---

## Step 2: Install Reddit MCP Server

### Option A: One-Click Install (Recommended)

1. Open Claude Desktop
2. Go to **Settings > Extensions**
3. Search for "Reddit" in the extension directory
4. Click **Install**
5. Enter your Reddit credentials when prompted

### Option B: Manual Install

```bash
# Clone the Reddit MCP server
git clone https://github.com/rgthelen/reddit-mcp-server.git
cd reddit-mcp-server

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password
EOF

# Build
npm run build
```

Then add to Claude Desktop config:

1. Open Claude Desktop
2. Go to **Settings > Developer > Edit Config**
3. Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "reddit": {
      "command": "node",
      "args": ["/path/to/reddit-mcp-server/dist/index.js"],
      "env": {
        "REDDIT_CLIENT_ID": "your_client_id",
        "REDDIT_CLIENT_SECRET": "your_client_secret",
        "REDDIT_USERNAME": "your_username",
        "REDDIT_PASSWORD": "your_password"
      }
    }
  }
}
```

4. Restart Claude Desktop

---

## Step 3: Verify Connection

1. Open a new chat in Claude Desktop
2. Click the **"+"** button at the bottom
3. Select **"Connectors"**
4. You should see "Reddit" listed with its available tools

Test with: "Search Reddit for recent posts about rent vs buy"

---

## Step 4: Add the Reddit Monitor Skill

1. In Claude Desktop, go to **Settings > Skills**
2. Click **"Add Skill"**
3. Import the skill from: `reddit-monitor-skill.md` (in this folder)

Or manually create a skill with the content from that file.

---

## Step 5: Daily Usage Workflow

### Morning Routine (5 minutes)

1. Open Claude Desktop
2. Say: **"Run my Reddit rent vs buy monitor"**
3. Claude will:
   - Search relevant subreddits for new posts
   - Show you posts that need helpful responses
   - Draft responses for your review
4. Review each draft, edit if needed
5. Approve to post (or copy and post manually)

### Keywords Monitored

- "rent vs buy"
- "should I buy a house"
- "renting vs owning"
- "rent or buy calculator"
- "is buying worth it"

### Subreddits Monitored

- r/personalfinance
- r/realestate
- r/FirstTimeHomeBuyer
- r/RealEstateInvesting
- r/financialindependence

---

## Important Notes

### Reddit Rules
- Don't spam or self-promote excessively
- Be genuinely helpful first
- Only mention your site when truly relevant
- Respect subreddit rules

### Rate Limits
- Reddit API has rate limits
- Don't run the monitor more than a few times per day
- Quality over quantity

### Human Review Required
- Always review AI-drafted responses before posting
- Edit for tone and accuracy
- Make sure it actually answers the question
