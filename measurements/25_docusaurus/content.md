# Extracted Content from docusaurus.io

**Source:** https://docusaurus.io/docs
**Crawled:** 2026-02-02T06:15:22.682Z
**Pages:** 5 extracted, 6 skipped
**Tokens:** ~8 023 estimated
**Duration:** 5s

---

## Table of Contents

1. [Introduction | Docusaurus](#introduction-docusaurus)
2. [Build optimized websites quickly, focus on your content | Docusaurus](#build-optimized-websites-quickly-focus-on-your-con)
3. [Docusaurus 3.9](#docusaurus-39)
4. [CLI](#cli)
5. [Docusaurus blog | Docusaurus](#docusaurus-blog-docusaurus)

---

## Introduction | Docusaurus

> Source: https://docusaurus.io/docs
> Tokens: ~2 911

⚡️ Docusaurus will help you ship a **beautiful documentation site in no time**.

💸 Building a custom tech stack is expensive. Instead, **focus on your content** and just write Markdown files.

💥 Ready for more? Use **advanced features** like versioning, i18n, search and theme customizations.

💅 Check the **[best Docusaurus sites](https://docusaurus.io/showcase?tags=favorite)** for inspiration.

🧐 Docusaurus is a **static-site generator**. It builds a **single-page application** with fast client-side navigation, leveraging the full power of **React** to make your site interactive. It provides out-of-the-box **documentation features** but can be used to create **any kind of site** (personal website, product, blog, marketing landing pages, etc).

Understand Docusaurus in **5 minutes** by playing!

Create a new Docusaurus site and follow the **very short** embedded tutorial.

Install [Node.js](https://nodejs.org/en/download/) and create a new Docusaurus site:

```text
npx create-docusaurus@latest my-website classic
```

Start the site:

```text
cd my-websitenpx docusaurus start
```

Open [`http://localhost:3000`](http://localhost:3000/) and follow the tutorial.

In this presentation at [Algolia Community Event](https://www.algolia.com/), [Meta Open Source team](https://opensource.facebook.com/) shared a brief walk-through of Docusaurus. They covered how to get started with the project, enable plugins, and set up functionalities like documentation and blogging.

Docusaurus v2+ has been a total rewrite from Docusaurus v1, taking advantage of a completely modernized toolchain. After [v2's official release](https://docusaurus.io/blog/2022/08/01/announcing-docusaurus-2.0), we highly encourage you to **use Docusaurus v2+ over Docusaurus v1**, as Docusaurus v1 has been deprecated.

A [lot of users](https://docusaurus.io/showcase) are already using Docusaurus v2+ ([trends](https://www.npmtrends.com/docusaurus-vs-@docusaurus/core)).

**Use Docusaurus v2+ if:**

- ✅You want a modern Jamstack documentation site- ✅You want a single-page application (SPA) with client-side routing- ✅You want the full power of React and MDX- ✅You do not need support for IE11

**Use [Docusaurus v1](https://v1.docusaurus.io/) if:**

- ❌You don't want a single-page application (SPA)- ❌You need support for IE11 (...do you? IE [has already reached end-of-life](https://docs.microsoft.com/en-us/lifecycle/products/internet-explorer-11)and is no longer officially supported)

For existing v1 users that are seeking to upgrade to v2+, you can follow our [migration guides](https://docusaurus.io/docs/migration).

Docusaurus is built with high attention to the developer and contributor experience.

- ⚛️ **Built with 💚 and React**:
 - Extend and customize with React- Gain full control of your site's browsing experience by providing your own React components- 🔌 **Pluggable**:
 - Bootstrap your site with a basic template, then use advanced features and plugins- Open source your plugins to share with the community- ✂️ **Developer experience**:
 - Start writing your docs right now- Universal configuration entry point to make it more maintainable by contributors- Hot reloading with lightning-fast incremental build on changes- Route-based code and data splitting- Publish to GitHub Pages, Netlify, Vercel, and other deployment services with ease

Our shared goal—to help your users quickly find what they need and understand your products better. We share our best practices to help you build your docs site right and well.

- 🎯 **SEO friendly**:
 - HTML files are statically generated for every possible path.- Page-specific SEO to help your users land on your official docs directly relating their problems at hand.- 📝 **Powered by MDX**:
 - Write interactive components via JSX and React embedded in Markdown.- Share your code in live editors to get your users to love your products on the spot.- 🔍 **Search**: Your full site is searchable.- 💾 **Document Versioning**: Helps you keep documentation in sync with project releases.- 🌍 **Internationalization (i18n)**: Translate your site in multiple locales.

Docusaurus v2+ is born to be compassionately accessible to all your users, and lightning-fast.

- ⚡️ **Lightning-fast**. Docusaurus v2+ follows the [PRPL Pattern](https://developers.google.com/web/fundamentals/performance/prpl-pattern/)that makes sure your content loads blazing fast.- 🦖 **Accessible**. Attention to accessibility, making your site equally accessible to all users.

- **Little to learn**. Docusaurus should be easy to learn and use as the API is quite small. Most things will still be achievable by users, even if it takes them more code and more time to write. Not having abstractions is better than having the wrong abstractions, and we don't want users to have to hack around the wrong abstractions. Mandatory talk— [Minimal API Surface Area](https://www.youtube.com/watch?v=4anAwXYqLG8).- **Intuitive**. Users will not feel overwhelmed when looking at the project directory of a Docusaurus project or adding new features. It should look intuitive and easy to build on top of, using approaches they are familiar with.- **Layered architecture**. The separations of concerns between each layer of our stack (content/theming/styling) should be clear—well-abstracted and modular.- **Sensible defaults**. Common and popular performance optimizations and configurations will be done for users but they are given the option to override them.- **No vendor lock-in**. Users are not required to use the default plugins or CSS, although they are highly encouraged to. Certain core infrastructures like React Loadable and React Router cannot be swapped because we do default performance optimization on them, but not higher-level ones. Choice of Markdown engines, CSS frameworks, CSS methodology, and other architectures will be entirely up to users.

We believe that, as developers, knowing how a library works helps us become better at using it. Hence we're dedicating effort to explaining the architecture and various components of Docusaurus with the hope that users reading it will gain a deeper understanding of the tool and be even more proficient in using it.

Across all static site generators, Docusaurus has a unique focus on documentation sites and has many out-of-the-box features.

We've also studied other main static site generators and would like to share our insights on the comparison, hopefully helping you navigate through the prismatic choices out there.

### Gatsby​

[Gatsby](https://www.gatsbyjs.com/) is packed with a lot of features, has a rich ecosystem of plugins, and is capable of doing everything that Docusaurus does. Naturally, that comes at a cost of a higher learning curve. Gatsby does many things well and is suitable for building many types of websites. On the other hand, Docusaurus tries to do one thing super well - be the best tool for writing and publishing content.

GraphQL is also pretty core to Gatsby, although you don't necessarily need GraphQL to build a Gatsby site. In most cases when building static websites, you won't need the flexibility that GraphQL provides.

Many aspects of Docusaurus v2+ were inspired by the best things about Gatsby and it's a great alternative.

[Docz](https://github.com/pedronauck/docz) is a Gatsby theme to build documentation websites. It is currently less featured than Docusaurus.

### Next.js​

[Next.js](https://nextjs.org/) is another very popular hybrid React framework. It can help you build a good documentation website, but it is not opinionated toward the documentation use-case, and it will require a lot more work to implement what Docusaurus provides out-of-the-box.

[Nextra](https://github.com/shuding/nextra) is an opinionated static site generator built on top of Next.js. It is currently less featured than Docusaurus.

### VitePress​

[VitePress](https://vitepress.dev/) has many similarities with Docusaurus - both focus heavily on content-centric websites and provides tailored documentation features out of the box. However, VitePress is powered by Vue, while Docusaurus is powered by React. If you want a Vue-based solution, VitePress would be a decent choice.

### MkDocs​

[MkDocs](https://www.mkdocs.org/) is a popular Python static site generator with value propositions similar to Docusaurus.

It is a good option if you don't need a single-page application and don't plan to leverage React.

[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) is a beautiful theme.

### Docsify​

[Docsify](https://docsify.js.org/) makes it easy to create a documentation website, but is not a static-site generator and is not SEO friendly.

### GitBook​

[GitBook](https://www.gitbook.com/) has a very clean design and has been used by many open source projects. With its focus shifting towards a commercial product rather than an open-source tool, many of its requirements no longer fit the needs of open source projects' documentation sites. As a result, many have turned to other products. You may read about Redux's switch to Docusaurus [here](https://github.com/reduxjs/redux/issues/3161).

Currently, GitBook is only free for open-source and non-profit teams. Docusaurus is free for everyone.

### Jekyll​

[Jekyll](https://github.com/jekyll/jekyll) is one of the most mature static site generators around and has been a great tool to use — in fact, before Docusaurus, most of Facebook's Open Source websites are/were built on Jekyll! It is extremely simple to get started. We want to bring a similar developer experience as building a static site with Jekyll.

In comparison with statically generated HTML and interactivity added using `<script />` tags, Docusaurus sites are React apps. Using modern JavaScript ecosystem tooling, we hope to set new standards on doc sites' performance, asset building pipeline and optimizations, and ease to set up.

### Rspress​

[Rspress](https://rspress.dev/) is a fast static site generator based on Rspack, a Rust-based bundler. It supports content writing with MDX (Markdown with React components), integrated text search, multilingual support (i18n), and extensibility through plugins. Designed for creating elegant documentation and static websites, Rspress produces static HTML files that are easy to deploy.

Rspress and Docusaurus are quite similar. They both have their pros and cons. Rspress was created more recently and benefits from a modern infrastructure that enables faster site builds. Docusaurus stands out for its maturity, comprehensive feature set, flexibility, and strong community. It is also [modernizing its infrastructure](https://github.com/facebook/docusaurus/issues/10556) regularly to remain competitive in terms of performance.

- [GitHub](https://github.com/facebook/docusaurus)
- [X](https://x.com/docusaurus)
- [Blog](https://docusaurus.io/blog)
- [Discord](https://discord.gg/docusaurus)

If you find issues with the documentation or have suggestions on how to improve the documentation or the project in general, please [file an issue](https://github.com/facebook/docusaurus) for us, or send a tweet mentioning the [@docusaurus](https://x.com/docusaurus) X account.

For new feature requests, you can create a post on our [feature requests board (Canny)](https://docusaurus.io/feature-requests), which is a handy tool for road-mapping and allows for sorting by upvotes, which gives the core team a better indicator of what features are in high demand, as compared to GitHub issues which are harder to triage. Refrain from making a Pull Request for new features (especially large ones) as someone might already be working on it or will be part of our roadmap. Talk to us first!

---

## Build optimized websites quickly, focus on your content | Docusaurus

> Source: https://docusaurus.io/
> Tokens: ~994

![Powered by MDX](https://docusaurus.io/img/undraw_typewriter.svg)

### Powered by MDX

Save time and focus on text documents. Simply write docs and blog posts with MDX, and Docusaurus builds them into static HTML files ready to be served. You can even embed React components in your Markdown thanks to MDX.

![Built Using React](https://docusaurus.io/img/undraw_react.svg)

### Built Using React

Extend and customize your project's layout by writing React components. Leverage the pluggable architecture, and design your own site while reusing the same data created by Docusaurus plugins.

![Ready for Translations](https://docusaurus.io/img/undraw_around_the_world.svg)

### Ready for Translations

Localization comes out-of-the-box. Use git, Crowdin, or any other translation manager to translate your docs and deploy them individually.

![Document Versioning](https://docusaurus.io/img/undraw_version_control.svg)

### Document Versioning

Support users on all versions of your project. Document versioning helps you keep documentation in sync with project releases.

![Content Search](https://docusaurus.io/img/undraw_algolia.svg)

### Content Search

Make it easy for your community to find what they need in your documentation. We proudly support Algolia documentation search.

## Check it out in the intro video

## Loved by many engineers

We've been using Docusaurus for all the Redux org docs sites for the last couple years, and it's great! We've been able to focus on content, customize some presentation and features, and It Just Works.

We've been using V2 since January and it has been great - we spend less time building documentation and more time building 🛳

Thanks **@docusaurus** team 🦖

The #IOTA wiki is now part of the **@docusaurus** showcase. We even have the honor of being a favorite. We are really happy that we found this project. It helped us a lot to improve the documentation. And we still have a lot of plans with things like tutorials, versioning and i18n.

I've used Docusaurus for two websites this year, and I've been very happy about the v2. Looks good, and simple to setup.

Continue to be impressed and excited about Docusaurus v2 alpha releases. Already using the sidebar items generator to help monorepo workspace devs create their own doc pages without any configuration needed.

https://testing-library.com just got a nice update! We're now on the latest version of **@docusaurus** thanks to @matanbobi, @TensorNo, and @nickemccurdy 💙

My favorite new feature: dark mode!! 🌑/☀️

Docusaurus v2 doubles as a really nice little static site generator tool for content-focused sites, love it 👏

Been doing a lot of work with **@docusaurus** lately and I have to say it is really fun to work with. A lot of really cool features. I love that you can easily reuse content by creating a markdown file and importing it as a component. 🔥

Happy to share Temporal's first open source sponsorship — of

**@docusaurus**!

@temporalio uses it for https://docs.temporal.io, and it has been a huge boon to our docs team. @sebastienlorber is an incredible steward of the project, support it if you can!

Christopher "vjeux" Chedeau

Lead Prettier Developer

I've helped open source many projects at Facebook and every one needed a website. They all had very similar constraints: the documentation should be written in markdown and be deployed via GitHub pages. I’m so glad that Docusaurus now exists so that I don’t have to spend a week each time spinning up a new one.

Hector Ramos

Lead React Native Advocate

Open source contributions to the React Native docs have skyrocketed after our move to Docusaurus. The docs are now hosted on a small repo in plain markdown, with none of the clutter that a typical static site generator would require. Thanks Slash!

Ricky Vetter

ReasonReact Developer

Docusaurus has been a great choice for the ReasonML family of projects. It makes our documentation consistent, i18n-friendly, easy to maintain, and friendly for new contributors.

---

## Docusaurus 3.9

> Source: https://docusaurus.io/blog/releases/3.9
> Tokens: ~1 929

We are happy to announce **Docusaurus 3.9**.

This release drops support for Node.js 18, adds support for Algolia DocSearch v4 with AskAI, improves i18n support, adds Mermaid ELK layout support, and comes with various other improvements and bug fixes.

Upgrading is easy. We follow [Semantic Versioning](https://semver.org/), and minor version updates have **no breaking changes**, accordingly to our [release process](https://docusaurus.io/community/release-process). Note that **we consider dropping End-of-Life Node.js versions as non-breaking changes**.

![Docusaurus blog post social card](https://docusaurus.io/assets/images/social-card-e8a5c83b31b6ac5bb461df1568d7577f.png)

In [#11408](https://github.com/facebook/docusaurus/pull/11408), we have dropped support for Node.js 18, and the new minimum required Node.js version is now v20.0.

Although it may look like a runtime requirement breaking change, Node.js 18 reached [End-of-Life](https://nodejs.org/en/about/releases/). It [won't receive security updates](https://nodejs.org/en/blog/announcements/node-18-eol-support), and you shouldn't use it anymore. Dropping End-of-Life versions of Node.js on minor version releases is a common practice in the Node.js ecosystem, that we now officially endorse and document on our [release process](https://docusaurus.io/community/release-process#nodejs-support).

This upgrade is further motivated by our dependencies:

- Some of our dependencies now only receive security patches on newer versions that do not support Node.js 18 anymore. See, for example, this [webpack-dev-server@4 security warning](https://github.com/facebook/docusaurus/pull/11410). To keep the Docusaurus v3 release line secure for our users, for both the runtime and third-party dependencies, the upgrade is necessary.- Some of our dependencies are also dropping support for Node.js 18 in minor releases, transitively impacting Docusaurus runtime requirements. For example, [Rspack 1.5 now requires Node.js 18.12](https://rspack.rs/blog/announcing-1-5), while Docusaurus v3 initially supported Node.js 18.0.

In [#11327](https://github.com/facebook/docusaurus/pull/11327) and [#11421](https://github.com/facebook/docusaurus/pull/11421), we added support for Algolia DocSearch v4. This new version comes with [AskAI](https://docsearch.algolia.com/docs/v4/askai) support, letting you add an AI-powered search assistant to your Docusaurus site that can answer questions based on what's in your documentation with a conversational experience.

![Algolia DocSearch v4 - Ask AI screenshot](https://docusaurus.io/assets/images/askai-0443fb4e7ddd4420f61d87c5a10d9be6.png)

DocSearch v4 is opt-in

Docusaurus v3 adds support for DocSearch v4 while keeping support for DocSearch v3.

Existing sites using DocSearch v3 can either stay on v3 or upgrade to v4 using their package manager (npm command: `npm update @docsearch/react`).

When using DocSearch v4, the new AskAI feature is not enabled by default: you also need to [create an AskAI assistant](https://docsearch.algolia.com/docs/v4/askai/) and add it to the [`themeConfig.algolia.askAi` config attribute](https://docusaurus.io/docs/search#ask-ai).

In [#11316](https://github.com/facebook/docusaurus/pull/11316), we added new `i18n.localeConfigs[locale].{url,baseUrl}` config options to better support complex and multi-domain i18n deployments. Previously, Docusaurus relied on hard-coded heuristics that made sense for most i18n projects, but weren't flexible enough to accommodate all use cases, leading UX and SEO issues. It is now possible to configure each locale's deployment URL and base URL independently, overriding the default values inferred by Docusaurus:

docusaurus.config.js

```javascript
export default { i18n: { defaultLocale: 'en', locales: ['en', 'fr'], localeConfigs: { en: { url: 'https://en.docusaurus.io', baseUrl: '/', }, fr: { url: 'https://fr.docusaurus.io', baseUrl: '/', }, }, },};
```

In [#11304](https://github.com/facebook/docusaurus/pull/11304), we optimized our i18n infrastructure with a new `i18n.localeConfigs[locale].translate` flag that is now `false` by default for sites that do not use any translations. This leads to an improved dev experience and faster builds for non-i18n sites by avoiding unnecessary file system read attempts of the `i18n` directory.

In [#11228](https://github.com/facebook/docusaurus/pull/11228), we added a new `key` attribute to the docs sidebar items, allowing to assign explicit translation keys to each sidebar item that use the same label and would otherwise lead to translation key conflicts:

sidebars.js

```javascript
export default { sidebar: [ { type: 'category', label: 'API', key: 'api-for-feature-1', items: [], }, { type: 'category', label: 'API', key: 'api-for-feature-2', items: [], }, ],};
```

In [#11357](https://github.com/facebook/docusaurus/pull/11357), we added support for [Mermaid ELK layout algorithm](https://mermaid.js.org/intro/syntax-reference.html#supported-layout-algorithms), based on the [Eclipse Layout Kernel (ELK)](https://www.eclipse.org/elk/). Compared to the default Dagre layout, it provides more sophisticated layout capabilities and configuration options, especially useful when working with large or intricate diagrams.

You can enable it by adding the extra `@mermaid-js/layout-elk` npm dependency, making it possible to use the `layout: elk` Mermaid diagram metadata:

```text
```mermaid---config: layout: elk---erDiagram CUSTOMER ||--o{ ORDER : places ORDER ||--|{ LINE-ITEM : contains CUSTOMER }|..|{ DELIVERY-ADDRESS : uses```text
```

- 🇧🇷 [#11315](https://github.com/facebook/docusaurus/pull/11315): Add missing Brazilian Portuguese theme translations.- 🇺🇦 [#11305](https://github.com/facebook/docusaurus/pull/11305): Add missing Ukrainian theme translations.

Other notable changes include:

- In [#11283](https://github.com/facebook/docusaurus/pull/11283), we added `siteConfig.markdown.hooks.{onBrokenMarkdownLinks,onBrokenMarkdownImages}`and deprecated `siteConfig.onBrokenMarkdownLinks`. The new callback hooks also let you recover from broken links/images by returning a fallback URL.- In [#11282](https://github.com/facebook/docusaurus/pull/11282), we added the `siteConfig.markdown.emoji`config option to disable the previously hard-coded `remark-emoji`behavior.- In [#11397](https://github.com/facebook/docusaurus/pull/11397), we can now resolve site-aliased Markdown links starting with `@site/*`, that we already supported for ES imports.- In [#11294](https://github.com/facebook/docusaurus/pull/11294)and [#11415](https://github.com/facebook/docusaurus/pull/11415), we upgraded to Rspack 1.5 and leveraging new Rspack config options to make Docusaurus build faster.- In [#11356](https://github.com/facebook/docusaurus/pull/11356), we improved the display of docs sidebar items with long labels.- In [#11405](https://github.com/facebook/docusaurus/pull/11405), we improved visual glitches caused by the `useColorMode()`hook when switching color modes, glitches that also affected your site's logo in the navbar.- In [#11383](https://github.com/facebook/docusaurus/pull/11383), we disabled a Docusaurus Faster HTML minifier optimization that prevents your site's social card from displaying properly on some social platforms (e.g., LinkedIn).- In [#11425](https://github.com/facebook/docusaurus/pull/11425), we added the ability for blog authors to display an email icon with a `mailto:`link ( `author.socials.email`).- In [#11422](https://github.com/facebook/docusaurus/pull/11422), we removed the `copy-text-to-clipboard`in favor of the native `navigator.clipboard`API.

Check the **[3.9.0 changelog entry](https://docusaurus.io/changelog/3.9.0)** for an exhaustive list of changes.

---

## CLI

> Source: https://docusaurus.io/docs/cli
> Tokens: ~2 019

- - CLI

Version: 3.9.2

## CLI

Docusaurus provides a set of scripts to help you generate, serve, and deploy your website.

Once your website is bootstrapped, the website source will contain the Docusaurus scripts that you can invoke with your package manager:

```json
package.json{// ..."scripts":{"docusaurus":"docusaurus","start":"docusaurus start","build":"docusaurus build","swizzle":"docusaurus swizzle","deploy":"docusaurus deploy","clear":"docusaurus clear","serve":"docusaurus serve","write-translations":"docusaurus write-translations","write-heading-ids":"docusaurus write-heading-ids"}}
```

### Docusaurus CLI commands​

Below is a list of Docusaurus CLI commands and their usages:

#### `docusaurus start [siteDir]`​

Builds and serves a preview of your site locally with [Webpack Dev Server](https://webpack.js.org/configuration/dev-server).

##### Options​

Name

Default

Description

`--port`

`3000`

Specifies the port of the dev server.

`--host`

`localhost`

Specify a host to use. For example, if you want your server to be accessible externally, you can use `--host 0.0.0.0`.

`--locale`

Specify site locale to be used.

`--hot-only`

`false`

Enables Hot Module Replacement without page refresh as a fallback in case of build failures. More information [here](https://webpack.js.org/configuration/dev-server/#devserverhotonly).

`--no-open`

`false`

Do not open the page automatically in the browser.

`--config`

`undefined`

Path to Docusaurus config file, default to `[siteDir]/docusaurus.config.js`

`--poll [optionalIntervalMs]`

`false`

Use polling of files rather than watching for live reload as a fallback in environments where watching doesn't work. More information [here](https://webpack.js.org/configuration/watch/#watchoptionspoll).

`--no-minify`

`false`

Build website without minimizing JS/CSS bundles.

info

Please note that some functionality (for example, anchor links) will not work in development. The functionality will work as expected in production.

Development over network

When forwarding port 3000 from a remote server or VM (e.g. GitHub Codespaces), you can run the dev server on `0.0.0.0` to make it listen on the local IP.

- npm- Yarn- pnpm- Bun

```bash
npm run start -- --host0.0.0.0
```

##### Enabling HTTPS​

There are multiple ways to obtain a certificate. We will use [mkcert](https://github.com/FiloSottile/mkcert) as an example.

- Run `mkcert localhost` to generate `localhost.pem` + `localhost-key.pem`- Run `mkcert -install` to install the cert in your trust store, and restart your browser- Start the app with Docusaurus HTTPS env variables:

```bash
HTTPS=true SSL_CRT_FILE=localhost.pem SSL_KEY_FILE=localhost-key.pem yarn start
```

- Open `https://localhost:3000/`

#### `docusaurus build [siteDir]`​

Compiles your site for production.

##### Options​

Name

Default

Description

`--dev`

Builds the website in dev mode, including full React error messages.

`--bundle-analyzer`

`false`

Analyze your bundle with the [webpack bundle analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer).

`--out-dir`

`build`

The full path for the new output directory, relative to the current workspace.

`--config`

`undefined`

Path to Docusaurus config file, default to `[siteDir]/docusaurus.config.js`

`--locale`

Build the site in the specified locale(s). If not specified, all known locales are built.

`--no-minify`

`false`

Build website without minimizing JS/CSS bundles.

info

For advanced minification of CSS bundle, we use the [advanced cssnano preset](https://github.com/cssnano/cssnano/tree/master/packages/cssnano-preset-advanced) (along with additional several PostCSS plugins) and [level 2 optimization of clean-css](https://github.com/jakubpawlowicz/clean-css#level-2-optimizations). If as a result of this advanced CSS minification you find broken CSS, build your website with the environment variable `USE_SIMPLE_CSS_MINIFIER=true` to minify CSS with the [default cssnano preset](https://github.com/cssnano/cssnano/tree/master/packages/cssnano-preset-default). **Please [fill out an issue](https://github.com/facebook/docusaurus/issues/new?labels=bug%2C+needs+triage&template=bug.md) if you experience CSS minification bugs.**

You can skip the HTML minification with the environment variable `SKIP_HTML_MINIFICATION=true`.

#### `docusaurus swizzle [themeName] [componentName] [siteDir]`​

[Swizzle](/docs/swizzling) a theme component to customize it.

- npm- Yarn- pnpm- Bun

```bash
npm run swizzle [themeName][componentName][siteDir]# Example (leaving out the siteDir to indicate this directory)npm run swizzle @docusaurus/theme-classic Footer -- --eject
```

The swizzle CLI is interactive and will guide you through the whole [swizzle process](/docs/swizzling).

##### Options​

Name

Description

`themeName`

The name of the theme to swizzle from.

`componentName`

The name of the theme component to swizzle.

`--list`

Display components available for swizzling

`--eject`

[Eject](/docs/swizzling#ejecting) the theme component

`--wrap`

[Wrap](/docs/swizzling#wrapping) the theme component

`--danger`

Allow immediate swizzling of unsafe components

`--typescript`

Swizzle the TypeScript variant component

`--config`

Path to docusaurus config file, default to `[siteDir]/docusaurus.config.js`

warning

Unsafe components have a higher risk of breaking changes due to internal refactorings.

#### `docusaurus deploy [siteDir]`​

Deploys your site with [GitHub Pages](https://pages.github.com/). Check out the docs on [deployment](/docs/deployment#deploying-to-github-pages) for more details.

##### Options​

Name

Default

Description

`--locale`

Deploy the site in the specified locale(s). If not specified, all known locales are deployed.

`--out-dir`

`build`

The full path for the new output directory, relative to the current workspace.

`--skip-build`

`false`

Deploy website without building it. This may be useful when using a custom deploy script.

`--target-dir`

`.`

Path to the target directory to deploy to.

`--config`

`undefined`

Path to Docusaurus config file, default to `[siteDir]/docusaurus.config.js`

#### `docusaurus serve [siteDir]`​

Serve your built website locally.

Name

Default

Description

`--port`

`3000`

Use specified port

`--dir`

`build`

The full path for the output directory, relative to the current workspace

`--build`

`false`

Build website before serving

`--config`

`undefined`

Path to Docusaurus config file, default to `[siteDir]/docusaurus.config.js`

`--host`

`localhost`

Specify a host to use. For example, if you want your server to be accessible externally, you can use `--host 0.0.0.0`.

`--no-open`

`false` locally, `true` in CI

Do not open a browser window to the server location.

#### `docusaurus clear [siteDir]`​

Clear a Docusaurus site's generated assets, caches, build artifacts.

We recommend running this command before reporting bugs, after upgrading versions, or anytime you have issues with your Docusaurus site.

#### `docusaurus write-translations [siteDir]`​

Write the JSON translation files that you will have to translate.

By default, the files are written in `website/i18n/<defaultLocale>/...`.

Name

Default

Description

`--locale`

`<defaultLocale>`

Define which locale folder you want to write translations the JSON files in

`--override`

`false`

Override existing translation messages

`--config`

`undefined`

Path to Docusaurus config file, default to `[siteDir]/docusaurus.config.js`

`--messagePrefix`

`''`

Allows adding a prefix to each translation message, to help you highlight untranslated strings

#### `docusaurus write-heading-ids [siteDir] [files]`​

Add [explicit heading IDs](/docs/markdown-features/toc#heading-ids) to the Markdown documents of your site.

Name

Default

Description

`files`

All MD files used by plugins

The files that you want heading IDs to be written to.

`--maintain-case`

`false`

Keep the headings' casing, otherwise make all lowercase.

`--overwrite`

`false`

Overwrite existing heading IDs.

[Edit this page](https://github.com/facebook/docusaurus/edit/main/website/docs/cli.mdx)

Last updated on **Oct 17, 2025** by **Sébastien Lorber**

[Next

Client API](/docs/docusaurus-core)

---

## Docusaurus blog | Docusaurus

> Source: https://docusaurus.io/blog
> Tokens: ~170

We are happy to announce **Docusaurus 3.9**.

This release drops support for Node.js 18, adds support for Algolia DocSearch v4 with AskAI, improves i18n support, adds Mermaid ELK layout support, and comes with various other improvements and bug fixes.

Upgrading is easy. We follow [Semantic Versioning](https://semver.org/), and minor version updates have **no breaking changes**, accordingly to our [release process](https://docusaurus.io/community/release-process). Note that **we consider dropping End-of-Life Node.js versions as non-breaking changes**.

![Docusaurus blog post social card](https://docusaurus.io/assets/images/social-card-e8a5c83b31b6ac5bb461df1568d7577f.png)