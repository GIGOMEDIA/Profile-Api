# Profile Intelligence API (Stage 2)

A backend service built for Insighta Labs that enables advanced querying of demographic profile data. This API supports filtering, sorting, pagination, and rule-based natural language search for efficient data exploration.

---

## 🚀 Base URL

```
http://localhost:5000/api
```

---

## 📦 Tech Stack

* Node.js
* Express.js
* MongoDB (Atlas)
* Mongoose

---

## 🧱 Database Schema

The `profiles` collection follows the required structure:

| Field               | Type            | Description                       |
| ------------------- | --------------- | --------------------------------- |
| id                  | UUID v7         | Unique identifier                 |
| name                | String (unique) | Full name                         |
| gender              | String          | male / female                     |
| gender_probability  | Number          | Confidence score                  |
| age                 | Number          | Exact age                         |
| age_group           | String          | child / teenager / adult / senior |
| country_id          | String(2)       | ISO country code                  |
| country_name        | String          | Full country name                 |
| country_probability | Number          | Confidence score                  |
| created_at          | Date            | ISO timestamp                     |

---

## 🌱 Data Seeding

Seed the database with:

```
node scripts/seed.js
```

* Uses `upsert` to prevent duplicates
* Ensures idempotency
* Automatically assigns UUID v7 where missing

---

## 📡 API Endpoints

### 1. Get All Profiles

```
GET /api/profiles
```

Supports:

#### 🔍 Filtering

* gender
* age_group
* country_id
* min_age / max_age
* min_gender_probability
* min_country_probability

#### 🔃 Sorting

* sort_by → age | created_at | gender_probability
* order → asc | desc

#### 📄 Pagination

* page (default: 1)
* limit (default: 10, max: 50)

#### ✅ Example

```
/api/profiles?gender=male&country_id=NG&min_age=25&sort_by=age&order=desc&page=1&limit=10
```

---

### 2. Natural Language Search (Core Feature)

```
GET /api/profiles/search?q=<query>
```

Converts plain English into structured filters.

#### ✅ Examples

| Query                              | Parsed Filters                              |
| ---------------------------------- | ------------------------------------------- |
| young males                        | gender=male, age 16–24                      |
| females above 30                   | gender=female, min_age=30                   |
| people from angola                 | country_id=AO                               |
| adult males from kenya             | gender=male, age_group=adult, country_id=KE |
| male and female teenagers above 17 | age_group=teenager, min_age=17              |

---

## 🧠 Natural Language Parsing Approach

The system uses **rule-based parsing (no AI/LLMs)**.

### 🔑 Keyword Mapping

* "male", "female" → gender filter
* "young" → min_age=16, max_age=24
* "above X" → min_age=X (regex extraction)
* "teenager", "adult", "child", "senior" → age_group
* Country names → mapped to ISO codes (e.g. Nigeria → NG)

### ⚙️ Logic Flow

1. Convert query to lowercase
2. Match keywords using:

   * string includes
   * regex (for numbers like “above 30”)
3. Build filter object
4. Pass filters into shared query builder
5. Execute DB query with pagination

---

## ⚠️ Limitations

* Does not handle complex grammar or sentence structure
* Cannot interpret ambiguous phrases (e.g. "older people")
* Limited country mapping (only predefined countries supported)
* No support for synonyms (e.g. “guys” ≠ “male”)
* No multi-condition conflict resolution

If a query cannot be interpreted:

```
{
  "status": "error",
  "message": "Unable to interpret query"
}
```

---

## ❌ Error Handling

All errors follow this format:

```
{
  "status": "error",
  "message": "<error message>"
}
```

| Code | Meaning           |
| ---- | ----------------- |
| 400  | Missing parameter |
| 422  | Invalid input     |
| 404  | Not found         |
| 500  | Server error      |

---

## ⚡ Performance Considerations

* Indexed fields: gender, age, country_id
* No full-table scans
* Efficient pagination using skip/limit
* Shared query builder for consistency

---

## 🔐 CORS

Enabled globally:

```
Access-Control-Allow-Origin: *
```

---

## 🧪 Testing

Test endpoints using:

* Browser
* Postman

Example:

```
http://localhost:5000/api/profiles/search?q=young males from nigeria
```

---

## 📌 Notes

* All timestamps are in ISO 8601 UTC format
* IDs are UUID v7 compliant
* Seed script is safe to re-run

---

## 👨‍💻 Author

Backend Wizard 🚀
