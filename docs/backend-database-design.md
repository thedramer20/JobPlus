# JobPlus Backend Database Design

## Goal

This document defines the finalized backend database design for the JobPlus recruitment platform. It is based on the functional requirements for:

1. Candidate accounts and profiles
2. Employer accounts and company ownership
3. Job posting and categorization
4. Job applications and application history
5. Normalized skills management
6. Saved jobs and notifications
7. Admin management through role-based access

## System Actors

The database must support these actors:

- `CANDIDATE`
- `EMPLOYER`
- `ADMIN`

Important design decision:

- employers and admins are stored in the `users` table through the `role` column
- there is no separate `employers` or `admins` table in the MVP

## Finalized Core Tables

### Account and profile tables

1. `users`
2. `candidate_profiles`
3. `companies`
4. `resumes`

### Recruitment workflow tables

5. `job_categories`
6. `jobs`
7. `applications`
8. `application_status_history`

### Normalized skills tables

9. `skills`
10. `user_skills`
11. `job_skills`

### Supporting feature tables

12. `saved_jobs`
13. `notifications`

## Table Design

### 1. users

Stores all system accounts.

Main fields:

- `id`
- `full_name`
- `email`
- `password_hash`
- `phone`
- `role`
- `status`
- `created_at`
- `updated_at`

Rules:

- `email` must be unique
- `role` values: `CANDIDATE`, `EMPLOYER`, `ADMIN`
- `status` values: `ACTIVE`, `INACTIVE`, `BANNED`

### 2. candidate_profiles

Stores candidate-specific profile data separate from account data.

Main fields:

- `id`
- `user_id`
- `address`
- `education`
- `experience_summary`
- `linkedin_url`
- `github_url`
- `updated_at`

Rules:

- one candidate has one candidate profile
- `user_id` must be unique

### 3. companies

Stores company information.

Main fields:

- `id`
- `owner_user_id`
- `company_name`
- `description`
- `website`
- `location`
- `logo_url`
- `created_at`
- `updated_at`

Rules:

- each employer account manages exactly one company
- `owner_user_id` must be unique

### 4. resumes

Stores uploaded resume metadata.

Main fields:

- `id`
- `user_id`
- `file_name`
- `file_path`
- `uploaded_at`

Rules:

- resume upload is optional
- one user can upload many resumes
- applications may reference a resume or rely on profile information only

### 5. job_categories

Stores job categories.

Main fields:

- `id`
- `name`
- `description`
- `created_at`

Rules:

- each job belongs to one category
- category name should be unique

### 6. jobs

Stores job postings.

Main fields:

- `id`
- `company_id`
- `category_id`
- `title`
- `description`
- `location`
- `job_type`
- `salary_min`
- `salary_max`
- `experience_level`
- `deadline`
- `status`
- `created_at`
- `updated_at`

Rules:

- each job belongs to one company
- each job belongs to one category
- `status` values: `OPEN`, `CLOSED`, `DRAFT`
- `job_type` values can include `FULL_TIME`, `PART_TIME`, `INTERNSHIP`, `REMOTE`, `CONTRACT`

### 7. applications

Stores the current state of an application.

Main fields:

- `id`
- `job_id`
- `candidate_user_id`
- `resume_id`
- `cover_letter`
- `status`
- `applied_at`
- `updated_at`

Rules:

- one candidate can only apply once to the same job
- `resume_id` is optional
- current application status stays in this table

### 8. application_status_history

Stores the full status transition history for applications.

Main fields:

- `id`
- `application_id`
- `old_status`
- `new_status`
- `changed_by_user_id`
- `note`
- `changed_at`

Purpose:

- track the full flow such as `PENDING -> REVIEWED -> SHORTLISTED -> ACCEPTED`

### 9. skills

Stores the list of skills.

Main fields:

- `id`
- `name`
- `created_at`

Rules:

- skill name should be unique
- skills must not be stored as one text field

### 10. user_skills

Many-to-many table between users and skills.

Main fields:

- `id`
- `user_id`
- `skill_id`
- `created_at`

Purpose:

- one user can have many skills
- one skill can belong to many users

### 11. job_skills

Many-to-many table between jobs and skills.

Main fields:

- `id`
- `job_id`
- `skill_id`
- `created_at`

Purpose:

- one job can require many skills
- one skill can be linked to many jobs

### 12. saved_jobs

Stores jobs bookmarked by users.

Main fields:

- `id`
- `user_id`
- `job_id`
- `saved_at`

Purpose:

- one user can save many jobs
- one job can be saved by many users

### 13. notifications

Stores in-app notifications.

Main fields:

- `id`
- `user_id`
- `message`
- `type`
- `is_read`
- `created_at`

Purpose:

- basic notification support without real-time delivery

## Relationship Summary

Main relationships:

1. one `user` may own one `company`
2. one `user` may have one `candidate_profile`
3. one `company` can post many `jobs`
4. one `job` belongs to one `job_category`
5. one `user` can upload many `resumes`
6. one `user` can submit many `applications`
7. one `job` can receive many `applications`
8. one `application` may reference one `resume`
9. one `application` has many `application_status_history` records
10. one `user` can have many `skills` through `user_skills`
11. one `job` can have many `skills` through `job_skills`
12. one `user` can save many `jobs`
13. one `user` can receive many `notifications`

## Critical Business Rules

1. one email address can only exist once
2. one employer manages exactly one company
3. one candidate cannot apply to the same job more than once
4. jobs cannot exist without a company
5. jobs cannot exist without a category
6. resume upload is optional
7. applications should only be allowed when job status is `OPEN`
8. one user has one main role in the MVP

## Normalization Decisions

To keep the database clean:

- authentication data stays in `users`
- candidate details stay in `candidate_profiles`
- company data stays in `companies`
- skill values stay in `skills`
- user-to-skill and job-to-skill use join tables
- category names are not repeated in `jobs`
- application history is separated from the current application status

## Recommended MVP Scope

### Required for strong MVP

- `users`
- `candidate_profiles`
- `companies`
- `job_categories`
- `jobs`
- `resumes`
- `applications`
- `application_status_history`

### Good support features

- `skills`
- `user_skills`
- `job_skills`
- `saved_jobs`
- `notifications`

## Recommended Build Order

1. `users`
2. `candidate_profiles`
3. `companies`
4. `job_categories`
5. `jobs`
6. `skills`
7. `user_skills`
8. `job_skills`
9. `resumes`
10. `applications`
11. `application_status_history`
12. `saved_jobs`
13. `notifications`

## Next Backend Step

The next backend implementation step is:

- create MyBatis mapper interfaces and SQL mappings based on this finalized schema
