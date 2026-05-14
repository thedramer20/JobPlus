MERGE INTO job_categories (name, description)
KEY(name)
VALUES
    ('Software Development', 'Roles focused on software engineering, backend, frontend, and full stack development'),
    ('Data and AI', 'Roles focused on data analysis, data engineering, machine learning, and AI'),
    ('Design', 'Roles focused on UI, UX, product design, and visual design'),
    ('Marketing', 'Roles focused on digital marketing, content, growth, and brand strategy'),
    ('Sales', 'Roles focused on business development, account management, and sales operations'),
    ('Human Resources', 'Roles focused on recruitment, talent operations, and people management');

MERGE INTO post_categories (name, description)
KEY(name)
VALUES
    ('Change Management', 'Organizational change, adoption, transformation, and team transitions'),
    ('Employee Experience', 'Culture, engagement, well-being, and people experience'),
    ('Economics', 'Markets, policy, growth, and macroeconomic insights'),
    ('Consulting', 'Advisory work, client strategy, analysis, and frameworks'),
    ('Writing', 'Communication, storytelling, content creation, and publishing'),
    ('Hospitality & Tourism', 'Travel, service operations, guest experience, and tourism trends'),
    ('Networking', 'Community building, mentorship, visibility, and professional relationships'),
    ('Ecommerce', 'Digital storefronts, conversion, growth, and customer journeys'),
    ('User Experience', 'Research, usability, product design, and interface thinking'),
    ('Soft Skills & Emotional Intelligence', 'Communication, empathy, resilience, and interpersonal growth'),
    ('Productivity', 'Habits, workflows, planning, and personal effectiveness'),
    ('Finance', 'Budgeting, investment, operations, and financial decision making'),
    ('Project Management', 'Planning, delivery, coordination, and execution'),
    ('Technology', 'Engineering, AI, product development, and emerging tools');

MERGE INTO users (username, full_name, email, password_hash, phone, role, status)
KEY(username)
VALUES
    ('amina', 'Amina Yusuf', 'amina@jobplus.app', '$2a$10$seededpasswordhash', '1000000000', 'ROLE_CANDIDATE', 'ACTIVE'),
    ('nadia', 'Nadia Mensah', 'nadia@jobplus.app', '$2a$10$seededpasswordhash', '1000000001', 'ROLE_EMPLOYER', 'ACTIVE'),
    ('omar', 'Omar Bello', 'omar@jobplus.app', '$2a$10$seededpasswordhash', '1000000002', 'ROLE_CANDIDATE', 'ACTIVE');

MERGE INTO posts (id, user_id, category_id, content, image_url)
KEY(id)
VALUES
    (1, (SELECT id FROM users WHERE username = 'amina'), (SELECT id FROM post_categories WHERE name = 'Networking'),
     'A polished professional profile is not only about listing experience. It is about telling a clear story of where you create value and how you build trusted relationships.',
     'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80'),
    (2, (SELECT id FROM users WHERE username = 'nadia'), (SELECT id FROM post_categories WHERE name = 'Change Management'),
     'Teams move faster through change when leaders create clarity, psychological safety, and a rhythm for feedback instead of waiting for uncertainty to grow.',
     'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80'),
    (3, (SELECT id FROM users WHERE username = 'omar'), (SELECT id FROM post_categories WHERE name = 'Technology'),
     'The strongest AI use cases are the ones that remove repeated work and give people more time for decisions that need real judgment.',
     'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80'),
    (4, (SELECT id FROM users WHERE username = 'amina'), (SELECT id FROM post_categories WHERE name = 'Productivity'),
     'Strategic planning becomes easier when you separate urgent work from high-impact work and review priorities every week.',
     NULL),
    (5, (SELECT id FROM users WHERE username = 'nadia'), (SELECT id FROM post_categories WHERE name = 'Project Management'),
     'Projects stay healthier when teams define scope early, review risks every week, and keep ownership visible across the delivery cycle.',
     'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80');

MERGE INTO post_likes (post_id, user_id)
KEY(post_id, user_id)
VALUES
    (1, (SELECT id FROM users WHERE username = 'nadia')),
    (1, (SELECT id FROM users WHERE username = 'omar')),
    (2, (SELECT id FROM users WHERE username = 'amina')),
    (2, (SELECT id FROM users WHERE username = 'omar')),
    (3, (SELECT id FROM users WHERE username = 'amina')),
    (3, (SELECT id FROM users WHERE username = 'nadia')),
    (3, (SELECT id FROM users WHERE username = 'omar')),
    (5, (SELECT id FROM users WHERE username = 'amina'));
