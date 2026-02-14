# Automated Blog Workflow Design

## Overview

Automatically generate and publish SEO-optimized blog posts for ownvsrent.io twice weekly (Wednesday and Saturday at 7am).

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  launchd (Wed & Sat at 7am)                             │
└─────────────────────┬───────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────┐
│  ~/scripts/ownvsrent-blog.sh                            │
├─────────────────────────────────────────────────────────┤
│  1. Search Reddit/web for trending topics               │
│  2. Check existing posts for duplicates                 │
│  3. Generate post via Claude CLI + /seo-blog-post       │
│  4. Fetch image via /fetch-blog-image                   │
│  5. Publish via /publish-blog-post                      │
│  6. Send email notification via SendGrid                │
└─────────────────────────────────────────────────────────┘
```

## Files

| File | Purpose |
|------|---------|
| `~/scripts/ownvsrent-blog.sh` | Main orchestration script |
| `~/Library/LaunchAgents/com.ownvsrent.blog.plist` | launchd schedule config |
| `~/scripts/ownvsrent-blog.log` | Log file |
| `~/.ownvsrent-blog-env` | Environment variables (API keys) |

## Schedule

- **Wednesday 7:00am** - First weekly post
- **Saturday 7:00am** - Second weekly post

## Workflow Steps

### Step 1: Topic Discovery
- Use WebSearch to find trending Reddit discussions
- Keywords: "rent vs buy", "should I buy a house", "renting vs buying"
- Subreddits: r/personalfinance, r/realestate, r/FirstTimeHomeBuyer

### Step 2: Deduplication
- Read `frontend/src/data/blogPosts.ts`
- Extract existing slugs
- Filter out topics already covered

### Step 3: Generate Post
- Invoke `/seo-blog-post "{topic}"`
- Creates draft at `frontend/src/data/.blog-draft.json`

### Step 4: Fetch Image
- Invoke `/fetch-blog-image "{slug}" "{search terms}"`
- Downloads from Unsplash to `frontend/public/blog/{slug}/featured.jpg`

### Step 5: Publish
- Invoke `/publish-blog-post`
- Adds to blogPosts.ts, commits, pushes to main
- Auto-deploys via GitHub → S3/CloudFront

### Step 6: Notify
- Send email via SendGrid API
- Success: Post title + URL
- Failure: Error details + log excerpt

## Error Handling

- All output logged to `~/scripts/ownvsrent-blog.log`
- Email sent on both success and failure
- Script uses `set -e` to exit on errors

## Management Commands

```bash
# Load (enable scheduling)
launchctl load ~/Library/LaunchAgents/com.ownvsrent.blog.plist

# Unload (disable scheduling)
launchctl unload ~/Library/LaunchAgents/com.ownvsrent.blog.plist

# Test run now
launchctl start com.ownvsrent.blog

# Check if loaded
launchctl list | grep ownvsrent

# View logs
tail -f ~/scripts/ownvsrent-blog.log
```

## Requirements

- macOS with launchd
- Claude CLI installed and authenticated
- SendGrid account with API key
- Verified sender email in SendGrid
