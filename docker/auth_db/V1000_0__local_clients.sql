-- Add auth client (auth_code flow) for local dev. Client secret is clientsecret
INSERT INTO oauth_client_details (client_id, access_token_validity, additional_information, authorities, authorized_grant_types, autoapprove, client_secret, refresh_token_validity, resource_ids, scope, web_server_redirect_uri)
VALUES ('hmpps-arns-assessment-platform-ui', 3600, '{}', null, 'authorization_code,refresh_token', 'read,write', '$2a$10$lBwbziQlLfiCnn8Kj1PfMujEcLdsJYlYSNJvBRO638gCYTS9yN0xm', 43200, null, 'read,write', 'http://localhost:3000/sign-in/callback,http://localhost:3000/sign-in/hmpps-auth/callback,http://ui:3000/sign-in/callback,http://ui:3000/sign-in/hmpps-auth/callback');

-- Add system client (S2S calls) for local dev with ARNS roles. Client secret is clientsecret
INSERT INTO oauth_client_details (client_id, access_token_validity, additional_information, authorities, authorized_grant_types, autoapprove, client_secret, refresh_token_validity, resource_ids, scope, web_server_redirect_uri)
VALUES ('hmpps-arns-assessment-platform-ui-system', 1200, '{}', 'ROLE_AAP__FRONTEND_RW,ROLE_ARNS_ASSESSMENTS_RW,ROLE_ASSESS_RISKS_AND_NEEDS_COORDINATOR_RW', 'client_credentials', 'read,write', '$2a$10$lBwbziQlLfiCnn8Kj1PfMujEcLdsJYlYSNJvBRO638gCYTS9yN0xm', 43200, null, 'read,write', null);

-- Add handover client for AAP (used by handover service). Client secret is aap-secret
INSERT INTO oauth_client_details (client_id, access_token_validity, additional_information, authorities, authorized_grant_types, autoapprove, client_secret, refresh_token_validity, resource_ids, scope, web_server_redirect_uri)
VALUES ('aap', 3600, '{}', null, 'authorization_code,refresh_token', 'read,write', '$2y$10$Juu9rW/BoxGMXO8ECkdESuaTZ7GhTzSLM1CFHC7ISZySxIgih7gDi', 43200, null, 'read,write', 'http://localhost:3000/sign-in/handover/callback,http://ui:3000/sign-in/handover/callback');

-- Create custom roles for UI users
INSERT INTO roles (role_id, role_code, role_name, create_datetime, role_description, admin_type)
VALUES ('8efb8c07-4260-468c-9f39-8c9509a3b695', 'ARNS_ASSESSMENT_PLATFORM_READ', 'ARNS Assessment Platform Read', '2025-10-28 00:00:00.000000', 'Read access to ARNS Assessment Platform API', 'DPS_ADM');

INSERT INTO roles (role_id, role_code, role_name, create_datetime, role_description, admin_type)
VALUES ('8efb8c07-4260-468c-9f39-8c9509a3b696', 'ARNS_ASSESSMENT_PLATFORM_WRITE', 'ARNS Assessment Platform Write', '2025-10-28 00:00:00.000000', 'Write access to ARNS Assessment Platform API', 'DPS_ADM');
