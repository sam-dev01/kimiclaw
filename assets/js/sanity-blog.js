(function () {
  'use strict';

  const config = window.SANITY_BLOG_CONFIG || {};
  const pageType = document.body?.dataset?.blogPage || '';
  const hasValidConfig = Boolean(
    config.projectId &&
    config.projectId !== 'your-project-id' &&
    config.dataset
  );

  const fallbackPosts = [
    {
      _id: 'fallback-1',
      title: 'How AI Websites Cut Launch Time Without Cutting Quality',
      slug: { current: 'ai-websites-cut-launch-time' },
      excerpt:
        'A practical look at how AI-assisted web production speeds up delivery while keeping strategy, design, and conversion quality intact.',
      publishedAt: '2026-03-20T08:30:00.000Z',
      readingTime: 6,
      categories: [{ title: 'AI Websites' }, { title: 'Growth' }],
      author: { name: 'KimiClaw Editorial' },
      mainImage: null,
      body: [
        { _type: 'block', style: 'normal', children: [{ text: 'AI can remove production drag, but it does not replace positioning, hierarchy, or decision-making. The biggest gains come when strategy, copy, and implementation move together instead of in separate handoffs.' }] },
        { _type: 'block', style: 'h2', children: [{ text: 'Where the speed actually comes from' }] },
        { _type: 'block', style: 'normal', children: [{ text: 'Teams save time by shortening revision cycles, generating structured page drafts faster, and building with reusable section systems. The quality still depends on human direction, especially for brand voice and conversion logic.' }] },
        { _type: 'block', style: 'h2', children: [{ text: 'What to keep human-led' }] },
        { _type: 'block', style: 'normal', children: [{ text: 'Offer clarity, content structure, pricing psychology, and launch QA should still be guided carefully. That is where most website outcomes are won or lost.' }] },
      ],
    },
    {
      _id: 'fallback-2',
      title: 'What Makes a High-Converting Service Business Homepage',
      slug: { current: 'high-converting-service-business-homepage' },
      excerpt:
        'The homepage structure we use when a service business needs more trust, stronger messaging, and clearer conversion paths.',
      publishedAt: '2026-03-14T08:30:00.000Z',
      readingTime: 5,
      categories: [{ title: 'Conversion' }, { title: 'Homepage Design' }],
      author: { name: 'KimiClaw Editorial' },
      mainImage: null,
      body: [
        { _type: 'block', style: 'normal', children: [{ text: 'Most service websites underperform because they open with vague claims and force visitors to guess what happens next. A strong homepage fixes that quickly.' }] },
        { _type: 'block', style: 'h2', children: [{ text: 'Core homepage blocks' }] },
        { _type: 'block', listItem: 'bullet', level: 1, children: [{ text: 'Clear promise and audience fit' }] },
        { _type: 'block', listItem: 'bullet', level: 1, children: [{ text: 'Proof with examples or outcomes' }] },
        { _type: 'block', listItem: 'bullet', level: 1, children: [{ text: 'A simple next step with low friction' }] },
        { _type: 'block', style: 'normal', children: [{ text: 'When those three are strong, the rest of the page supports trust instead of trying to create it from scratch.' }] },
      ],
    },
    {
      _id: 'fallback-3',
      title: 'A Better Blog Setup for Small Agencies Using Sanity',
      slug: { current: 'better-blog-setup-small-agencies-sanity' },
      excerpt:
        'Why Sanity is a smart CMS choice when you want your team to publish blogs without touching layout code.',
      publishedAt: '2026-03-08T08:30:00.000Z',
      readingTime: 4,
      categories: [{ title: 'Sanity CMS' }],
      author: { name: 'KimiClaw Editorial' },
      mainImage: null,
      body: [
        { _type: 'block', style: 'normal', children: [{ text: 'A good blog system lets you publish fast, control SEO fields, and keep authors away from layout mistakes. Sanity does that well because the content model is structured instead of page-builder driven.' }] },
        { _type: 'block', style: 'h2', children: [{ text: 'What to model first' }] },
        { _type: 'block', listItem: 'bullet', level: 1, children: [{ text: 'Posts' }] },
        { _type: 'block', listItem: 'bullet', level: 1, children: [{ text: 'Authors' }] },
        { _type: 'block', listItem: 'bullet', level: 1, children: [{ text: 'Categories' }] },
        { _type: 'block', listItem: 'bullet', level: 1, children: [{ text: 'Site settings' }] },
      ],
    },
  ];

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(value) {
    if (!value) return 'Draft';
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function slugify(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function ptText(blocks) {
    return (blocks || [])
      .map((block) => {
        if (block._type !== 'block' || !Array.isArray(block.children)) return '';
        return block.children.map((child) => child.text || '').join('');
      })
      .join(' ');
  }

  function getReadingTime(post) {
    if (post.readingTime) return post.readingTime;
    const source = ptText(post.body || []);
    const words = source.split(/\s+/).filter(Boolean).length;
    return Math.max(3, Math.ceil(words / 180));
  }

  function blockChildrenToHtml(children) {
    return (children || [])
      .map((child) => {
        const text = escapeHtml(child.text || '');
        if (child.marks?.includes('strong')) return '<strong>' + text + '</strong>';
        if (child.marks?.includes('em')) return '<em>' + text + '</em>';
        return text;
      })
      .join('');
  }

  function portableTextToHtml(blocks) {
    const html = [];
    let currentList = null;

    const closeList = () => {
      if (currentList) {
        html.push(currentList === 'number' ? '</ol>' : '</ul>');
        currentList = null;
      }
    };

    (blocks || []).forEach((block) => {
      if (block._type === 'image' && block.asset?.url) {
        closeList();
        html.push(
          '<figure class="article-inline-image">' +
            '<img src="' + escapeHtml(block.asset.url) + '" alt="' + escapeHtml(block.alt || '') + '" loading="lazy">' +
            (block.caption ? '<figcaption>' + escapeHtml(block.caption) + '</figcaption>' : '') +
          '</figure>'
        );
        return;
      }

      if (block._type !== 'block') return;

      const inner = blockChildrenToHtml(block.children);
      if (block.listItem) {
        const listTag = block.listItem === 'number' ? 'number' : 'bullet';
        if (currentList !== listTag) {
          closeList();
          html.push(listTag === 'number' ? '<ol>' : '<ul>');
          currentList = listTag;
        }
        html.push('<li>' + inner + '</li>');
        return;
      }

      closeList();

      if (block.style === 'h2') {
        html.push('<h2 id="' + slugify(ptText([block])) + '">' + inner + '</h2>');
      } else if (block.style === 'h3') {
        html.push('<h3 id="' + slugify(ptText([block])) + '">' + inner + '</h3>');
      } else if (block.style === 'blockquote') {
        html.push('<blockquote>' + inner + '</blockquote>');
      } else {
        html.push('<p>' + inner + '</p>');
      }
    });

    closeList();
    return html.join('');
  }

  function buildToc(blocks) {
    return (blocks || [])
      .filter((block) => block._type === 'block' && (block.style === 'h2' || block.style === 'h3'))
      .map((block) => {
        const text = ptText([block]);
        return {
          text,
          id: slugify(text),
          level: block.style,
        };
      });
  }

  function sanityQueryUrl(query, params) {
    const search = new URLSearchParams({
      query,
      perspective: 'published',
    });

    Object.entries(params || {}).forEach(([key, value]) => {
      search.set(`$${key}`, value);
    });

    return `https://${config.projectId}.api.sanity.io/v${config.apiVersion}/data/query/${config.dataset}?${search.toString()}`;
  }

  async function runQuery(query, params) {
    const response = await fetch(sanityQueryUrl(query, params));
    if (!response.ok) {
      throw new Error('Failed to load blog content from Sanity.');
    }
    const data = await response.json();
    return data.result;
  }

  async function getPosts() {
    if (!hasValidConfig) return fallbackPosts;

    const query = `*[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc){
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      readingTime,
      featured,
      "author": author->{name},
      "categories": categories[]->{title},
      mainImage{alt, asset->{url}},
      body
    }`;

    return runQuery(query);
  }

  async function getPostBySlug(slug) {
    if (!hasValidConfig) {
      return fallbackPosts.find((post) => post.slug?.current === slug) || fallbackPosts[0];
    }

    try {
      const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        readingTime,
        seoTitle,
        seoDescription,
        "author": author->{name, bio},
        "categories": categories[]->{title},
        mainImage{alt, asset->{url}},
        body
      }`;

      const post = await runQuery(query, { slug });
      if (post) return post;
    } catch (error) {
      // Fall back to the broader published-posts query if the slug-specific request fails.
    }

    const posts = await getPosts();
    return posts.find((post) => post.slug?.current === slug) || null;
  }

  function renderSetupNotice(container) {
    if (!container || hasValidConfig) return;
    container.innerHTML =
      '<div class="page-panel blog-setup-notice">' +
        '<span class="blog-panel-eyebrow">Sanity setup pending</span>' +
        '<h3>Connect your Sanity project to make the blog live.</h3>' +
        '<p>Update <code>assets/js/sanity-blog-config.js</code> with your Sanity <code>projectId</code> and <code>dataset</code>. The page is currently showing starter content so the layout is ready.</p>' +
      '</div>';
  }

  function buildPostCard(post) {
    const category = post.categories?.[0]?.title || 'Blog';
    const image = post.mainImage?.asset?.url
      ? `<div class="blog-card-image"><img src="${escapeHtml(post.mainImage.asset.url)}" alt="${escapeHtml(post.mainImage.alt || post.title)}" loading="lazy"></div>`
      : '';

    return (
      '<article class="blog-card">' +
        image +
        '<div class="blog-card-body">' +
          `<span class="blog-panel-eyebrow">${escapeHtml(category)}</span>` +
          `<h3><a href="blog-post.html?slug=${encodeURIComponent(post.slug.current)}">${escapeHtml(post.title)}</a></h3>` +
          `<p>${escapeHtml(post.excerpt || '')}</p>` +
          '<div class="blog-card-bottom blog-card-meta">' +
            `<span>${formatDate(post.publishedAt)}</span>` +
            `<span>${getReadingTime(post)} min read</span>` +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function buildFeaturedPost(post) {
    const category = post.categories?.[0]?.title || 'Featured';
    const image = post.mainImage?.asset?.url
      ? `<div class="featured-post-media"><img src="${escapeHtml(post.mainImage.asset.url)}" alt="${escapeHtml(post.mainImage.alt || post.title)}" loading="lazy"></div>`
      : '<div class="featured-post-media blog-fallback-media"><span>Featured article</span></div>';

    return (
      '<article class="featured-post-card">' +
        image +
        '<div class="featured-post-content">' +
          `<span class="blog-panel-eyebrow">${escapeHtml(category)}</span>` +
          `<h2><a href="blog-post.html?slug=${encodeURIComponent(post.slug.current)}">${escapeHtml(post.title)}</a></h2>` +
          `<p>${escapeHtml(post.excerpt || '')}</p>` +
          '<div class="blog-card-bottom blog-card-meta">' +
            `<span>${formatDate(post.publishedAt)}</span>` +
            `<span>${getReadingTime(post)} min read</span>` +
            `<span>${escapeHtml(post.author?.name || 'KimiClaw Editorial')}</span>` +
          '</div>' +
          `<a class="btn btn-primary" href="blog-post.html?slug=${encodeURIComponent(post.slug.current)}">Read article</a>` +
        '</div>' +
      '</article>'
    );
  }

  function setMeta(post) {
    document.title = `${post.seoTitle || post.title} | KimiClaw AI Blog`;

    const description = post.seoDescription || post.excerpt || '';
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) descriptionMeta.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', post.seoTitle || post.title);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', description);
  }

  function renderBlogIndex(posts) {
    const featuredRoot = document.getElementById('featuredPost');
    const gridRoot = document.getElementById('blogGrid');
    const categoriesRoot = document.getElementById('blogCategory');
    const recentRoot = document.getElementById('blogRecentPosts');
    const metaRoot = document.getElementById('blogMetaMessage');

    if (!featuredRoot || !gridRoot) return;

    const orderedPosts = [...posts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    const featuredPost = orderedPosts.find((post) => post.featured) || orderedPosts[0];
    const otherPosts = orderedPosts.filter((post) => post._id !== featuredPost?._id);

    featuredRoot.innerHTML = featuredPost ? buildFeaturedPost(featuredPost) : '';
    gridRoot.innerHTML = otherPosts.length
      ? otherPosts.map(buildPostCard).join('')
      : '<div class="page-panel blog-empty-state"><h3>No blog posts published yet.</h3><p>Publish your first post in Sanity and it will appear here automatically.</p></div>';

    const categories = ['All', ...new Set(orderedPosts.flatMap((post) => (post.categories || []).map((category) => category.title)).filter(Boolean))];
    categoriesRoot.innerHTML = categories
      .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
      .join('');

    recentRoot.innerHTML = orderedPosts.slice(0, 4).map((post) => (
      '<li>' +
        `<a href="blog-post.html?slug=${encodeURIComponent(post.slug.current)}">${escapeHtml(post.title)}</a>` +
        `<span>${formatDate(post.publishedAt)}</span>` +
      '</li>'
    )).join('');

    metaRoot.textContent = hasValidConfig
      ? `Connected to Sanity. Showing ${orderedPosts.length} published post${orderedPosts.length === 1 ? '' : 's'}.`
      : 'Starter blog content is showing until your Sanity project details are added.';

    const searchInput = document.getElementById('blogSearch');
    const filterForm = document.getElementById('blogFilterForm');

    const applyFilters = () => {
      const query = searchInput.value.trim().toLowerCase();
      const selectedCategory = categoriesRoot.value;
      const filtered = otherPosts.filter((post) => {
        const matchesQuery = !query || [
          post.title,
          post.excerpt,
          ptText(post.body || []),
        ].join(' ').toLowerCase().includes(query);

        const matchesCategory =
          selectedCategory === 'All' ||
          (post.categories || []).some((category) => category.title === selectedCategory);

        return matchesQuery && matchesCategory;
      });

      gridRoot.innerHTML = filtered.length
        ? filtered.map(buildPostCard).join('')
        : '<div class="page-panel blog-empty-state"><h3>No posts match this filter.</h3><p>Try a broader keyword or switch back to all categories.</p></div>';
    };

    filterForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      applyFilters();
    });
    searchInput?.addEventListener('input', applyFilters);
    categoriesRoot?.addEventListener('change', applyFilters);
  }

  function renderArticle(post, allPosts) {
    const heroRoot = document.getElementById('articleHero');
    const contentRoot = document.getElementById('articleContent');
    const tocRoot = document.getElementById('articleToc');
    const relatedRoot = document.getElementById('relatedPosts');
    const setupRoot = document.getElementById('blogSetupNotice');
    const tocCard = tocRoot?.closest('.sidebar-card');

    if (!heroRoot || !contentRoot) return;

    renderSetupNotice(setupRoot);
    setMeta(post);

    const toc = buildToc(post.body || []);
    const categories = (post.categories || []).map((category) => category.title).filter(Boolean);
    const image = post.mainImage?.asset?.url
      ? `<img class="article-hero-image" src="${escapeHtml(post.mainImage.asset.url)}" alt="${escapeHtml(post.mainImage.alt || post.title)}">`
      : '';

    heroRoot.innerHTML = (
      '<div class="article-hero-wrap">' +
        `<span class="blog-panel-eyebrow">${escapeHtml(categories[0] || 'Article')}</span>` +
        `<h1 class="article-title">${escapeHtml(post.title)}</h1>` +
        `<p>${escapeHtml(post.excerpt || '')}</p>` +
        '<div class="article-meta-bar">' +
          `<span>${formatDate(post.publishedAt)}</span>` +
          `<span>${getReadingTime(post)} min read</span>` +
          `<span>${escapeHtml(post.author?.name || 'KimiClaw Editorial')}</span>` +
        '</div>' +
        image +
      '</div>'
    );

    contentRoot.innerHTML = `<div class="prose">${portableTextToHtml(post.body || [])}</div>`;

    tocRoot.innerHTML = toc.length
      ? toc.map((item) => `<li class="${item.level}"><a href="#${escapeHtml(item.id)}">${escapeHtml(item.text)}</a></li>`).join('')
      : '';

    if (tocCard) {
      tocCard.hidden = toc.length === 0;
    }

    const related = (allPosts || []).filter((candidate) => candidate.slug?.current !== post.slug?.current).slice(0, 3);
    relatedRoot.innerHTML = related.map((candidate) => (
      '<article class="mini-post-card">' +
        `<span>${formatDate(candidate.publishedAt)}</span>` +
        `<h3><a href="blog-post.html?slug=${encodeURIComponent(candidate.slug.current)}">${escapeHtml(candidate.title)}</a></h3>` +
        `<p>${escapeHtml(candidate.excerpt || '')}</p>` +
      '</article>'
    )).join('');
  }

  async function initBlogIndex() {
    const setupRoot = document.getElementById('blogSetupNotice');
    renderSetupNotice(setupRoot);
    const posts = await getPosts();
    renderBlogIndex(posts);
  }

  async function initArticlePage() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug') || fallbackPosts[0].slug.current;
    const [post, allPosts] = await Promise.all([getPostBySlug(slug), getPosts()]);

    if (!post) {
      const contentRoot = document.getElementById('articleContent');
      if (contentRoot) {
        contentRoot.innerHTML = '<div class="page-panel blog-empty-state"><h3>Article not found.</h3><p>The post you requested does not exist or is not published yet.</p></div>';
      }
      return;
    }

    renderArticle(post, allPosts);
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (pageType === 'listing') {
      initBlogIndex().catch((error) => {
        const gridRoot = document.getElementById('blogGrid');
        if (gridRoot) {
          gridRoot.innerHTML = `<div class="page-panel blog-empty-state"><h3>Could not load blog posts.</h3><p>${escapeHtml(error.message)}</p></div>`;
        }
      });
    }

    if (pageType === 'post') {
      initArticlePage().catch((error) => {
        const contentRoot = document.getElementById('articleContent');
        if (contentRoot) {
          contentRoot.innerHTML = `<div class="page-panel blog-empty-state"><h3>Could not load this article.</h3><p>${escapeHtml(error.message)}</p></div>`;
        }
      });
    }
  });
})();
