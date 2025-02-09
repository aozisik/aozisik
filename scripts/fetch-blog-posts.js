const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser();

(async () => {
  try {
    // Fetch blog posts from RSS feed
    const feed = await parser.parseURL('https://ahmet.ee/feed');
    
    // Get latest 5 posts
    const latestPosts = feed.items.slice(0, 5);
    
    // Find and read README from the project root
    const readmePath = path.join(__dirname, '..', 'README.md');
    let readme = fs.readFileSync(readmePath, 'utf8');
    
    // Create blog post list with dates
    const blogList = latestPosts
      .map(post => {
        const date = new Date(post.pubDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        return `- [${post.title}](${post.link}?utm_source=github&utm_campaign=profile) (${date})`;
      })
      .join('\n');
    
    // Replace content between markers
    readme = readme.replace(
      /<!-- BLOG-POST-LIST:START -->[\s\S]*<!-- BLOG-POST-LIST:END -->/,
      `<!-- BLOG-POST-LIST:START -->\n${blogList}\n<!-- BLOG-POST-LIST:END -->`
    );
    
    // Write updated README
    fs.writeFileSync(readmePath, readme);
    console.log('✅ Successfully updated README with latest blog posts');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fetching blog posts:', error);
    process.exit(1);
  }
})(); 