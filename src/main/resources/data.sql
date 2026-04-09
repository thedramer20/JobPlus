MERGE INTO job_categories (name, description)
KEY(name)
VALUES
    ('Software Development', 'Roles focused on software engineering, backend, frontend, and full stack development'),
    ('Data and AI', 'Roles focused on data analysis, data engineering, machine learning, and AI'),
    ('Design', 'Roles focused on UI, UX, product design, and visual design'),
    ('Marketing', 'Roles focused on digital marketing, content, growth, and brand strategy'),
    ('Sales', 'Roles focused on business development, account management, and sales operations'),
    ('Human Resources', 'Roles focused on recruitment, talent operations, and people management');
