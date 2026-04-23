# Profile Intelligence API

## Overview

This API provides filtering, sorting, pagination, and natural language querying for demographic profiles.

---

## Natural Language Parsing Approach

The system uses **rule-based parsing (no AI)**.

### Supported Keywords

* **Gender**

  * "male" → gender=male
  * "female" → gender=female
  * both → no gender filter

* **Age**

  * "young" → 16–24
  * "above X" → min_age=X

* **Age Groups**

  * teenager, adult, child, senior

* **Country**

  * nigeria → NG
  * kenya → KE
  * angola → AO

---

## Parsing Logic

1. Convert query to lowercase
2. Use regex + string matching
3. Build filter object
4. Apply filters to database query

---

## Limitations

* No complex sentence understanding
* No synonyms (e.g. "guys")
* Limited country support
* Cannot resolve ambiguous queries

---

## Features

* Filtering
* Sorting
* Pagination
* Natural language search
* MongoDB Atlas integration

---

## Running Locally

```bash
npm install
npm run dev
```
