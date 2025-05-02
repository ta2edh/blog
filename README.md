# TA2EDH Blog

A modern, terminal-inspired blog built with Next.js and Tailwind CSS. This blog features a unique ham radio operator theme with a green-on-black color scheme.

![TA2EDH Blog Screenshot](https://files.catbox.moe/n6nmdb.png)

## Features

- 🎨 Terminal-inspired design with ham radio operator theme
- 📱 Fully responsive layout
- 📝 Markdown support for blog posts
- 🔍 SEO optimized
- ⚡ Fast page loads with Next.js
- 🎯 TypeScript for better development experience
- 🎨 Tailwind CSS for styling

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/ta2edh/blog.git
cd blog
```

2. Install dependencies:
```bash
npm install
```

3. Create a `_posts` directory in the root of your project and add your markdown blog posts.

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Blog Post Format

Create markdown files in the `_posts` directory with the following front matter:

```markdown
---
title: "Your Post Title"
date: "2024-03-21"
excerpt: "A brief description of your post"
author:
  name: "Your Name"
  callsign: "TA2EDH" # Optional
tags: ["ham radio", "electronics", "tech"] # Optional
---

Your post content here...
```

## Deployment on Vercel

The easiest way to deploy your blog is to use the [Vercel Platform](https://vercel.com).

1. Push your code to a GitHub repository.

2. Import your project to Vercel:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js and configure the build settings

3. Deploy:
   - Click "Deploy"
   - Vercel will build and deploy your site
   - Your site will be available at `https://your-project-name.vercel.app`

## Environment Variables

No environment variables are required for basic functionality. However, you can add them in a `.env.local` file if needed:

```env
# Add your environment variables here
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- Website: [blog.ta2edh.com](https://blog.ta2edh.com)
- GitHub: [@ta2edh](https://github.com/ta2edh) 