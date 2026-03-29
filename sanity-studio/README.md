# KimiClaw Sanity Studio

This folder contains the Sanity Studio for your blog.

## 1. Add your Sanity project details

Replace `your-project-id` in:

- `sanity.config.js`
- `sanity.cli.js`

Then update the frontend config in:

- `../assets/js/sanity-blog-config.js`

Set the same:

- `projectId`
- `dataset`

## 2. Install dependencies

```bash
npm install
```

## 3. Start the studio

```bash
npm run dev
```

Sanity Studio will usually run on [http://localhost:3333](http://localhost:3333).

## 4. Create content

Create:

- Authors
- Categories
- Posts

## 5. Publish

Once a post is published, it will appear automatically on:

- `blog.html`
- `blog-post.html?slug=your-post-slug`
