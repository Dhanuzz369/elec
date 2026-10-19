# Blog posts: file format

This folder is the blog. Every `.md` file here (except this README) is one post. A person or the publishing automation adds a file, commits it, and the host rebuilds the site. No code changes are needed.

## File name = web address

`content/blog/<slug>.md` is published at `/blog/<slug>`.

The slug must be lowercase letters, digits and single hyphens: `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
Good: `hsn-codes-for-mcc-panels.md`. Bad: `HSN Codes.md`, `mcc--panels.md`.

## Front matter

The file starts with a YAML block between `---` lines.

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `title` | yes | text | 45 characters or fewer recommended so the page heading fits on two lines; also the browser title |
| `description` | yes | text | 120–160 characters; the meta description and the summary in lists. Never the same as the title |
| `date` | yes | `YYYY-MM-DD` | publish date. A future date stays hidden until a rebuild happens on or after that day |
| `updated` | no | `YYYY-MM-DD` | last meaningful edit; shown on the page and used as `dateModified` |
| `author` | yes | text | a person's name, or `GoodBiz` for the company |
| `tags` | yes | list of text | first tag is the main topic. `Export Compliance` and `export compliance` are the same tag |
| `family` | no | product family slug | one of `lt-panels`, `mv-switchgear-rmu`, `transformers`, `substations`, `breakers-contactors`, `enclosures-junction-boxes`, `parts`, `switchyard-cables-ups` |
| `countries` | no | list of country codes | codes from `src/data/countries.ts`, e.g. `[SA, NG, KE]` |
| `cover` | no | path or URL | a file under `/public` (e.g. `/images/x.jpg`) or an absolute `https://` URL. Strongly recommended: it is the list thumbnail and the article picture |
| `coverAlt` | when `cover` is set | text | describes the picture |
| `faq` | no | list of `{ q, a }` | shown at the end of the post and marked up for answer boxes. Quote answers that start with a number |
| `draft` | no | `true` / `false` | `true` hides the post on the live site |
| `canonical` | no | `https://` URL | when the same article is published on several of your sites, the URL of the original. This site then points search engines at the original and leaves the post out of its sitemap |

## Body

Plain Markdown (CommonMark) plus tables. Use `##` and `###` for headings; the page already has the `#` title. With three or more `##` headings the page shows a table of contents. Raw HTML is removed for safety.

## Example

```markdown
---
title: HSN codes for MCC panels
description: The Indian 8-digit HSN code for motor control centre panels, what the 8537 heading covers, and the mistakes that delay customs clearance.
date: 2026-11-02
author: GoodBiz
tags: [HSN codes, Export compliance]
family: lt-panels
countries: [SA, AE]
faq:
  - q: What is the HSN code for an MCC panel?
    a: "85371000, the Indian tariff line for boards and panels for 1000 V or less."
---

## Why the code matters

...
```

## What happens when a file is wrong

The build stops and names the file and the field, for example
`content/blog/hsn-codes.md: "date" must be YYYY-MM-DD`. Nothing is published until it is fixed.

## Scheduling

Posts with a future `date` go live at the first rebuild on or after that date. Set up a daily rebuild (a scheduled deploy hook on the host) so weekly posts appear on their day.

## Drafts

`draft: true` posts are hidden on the live site. They show, labelled "Draft" and hidden from search engines, when running `npm run dev` or a build with `SHOW_DRAFTS=1` (use that for a preview deploy).
