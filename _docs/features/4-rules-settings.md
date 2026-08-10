# Rules Settings - Feature Documentation

## Table of Contents
1. [Overview](#overview)
2. [Capabilities](#capabilities)
3. [Architecture](#architecture)
4. [User Interface](#user-interface)
5. [Data Model](#data-model)
6. [Permissions](#permissions)
7. [References](#references)

## Overview

The Rules Settings feature allows users to create, manage, and configure rules that define how the trading assist communicates with external services. These rules store configurations for integrating with services like Telegram, Binance, Email, Push Notifications and other external APIs. Each rule consists of a name, unique-code(for one user), description, tags and JSON configuration itself

#### Key Features
- Create rules with configurations for external service communication
- View all user-created rules in a list
- Update existing rules (name, description, or configuration)
- Delete rules that are no longer needed
- Flexible JSON-based rule configuration (ruleBody)
- Support for multiple external service integrations
- User-specific rules settings management
- RESTful API for rules settings management operations
- JWT authentication required for all rule operations
- Input validation and error handling

#### User Goals
- Manage externals service connection configurations

## Capabilities

The Rules Settings feature provides comprehensive management capabilities for configuring external service integrations. Users can perform the following operations:

### Rule Management Operations

**Create Rule Settings**
- Create new rule's settings with custom names and descriptions
- Configure rule's setting body as JSON to define service-specific parameters
- Each rule is automatically associated with the authenticated user
- Rule's settings are validated before creation to ensure proper format

**View Rule Settings**
- Retrieve all rule's settings created by the authenticated user
- View individual rule's setting details including name, description, and configuration

**Update Rule Settings**
- Modify rule's settins name, unique-code, description, tags or rule setting configuration
- Partial updates supported - only specified fields are updated
- Rule's setting can be updated individually by their unique ID
- Validation ensures updated configurations maintain proper format

**Delete Rule Settings**
- Remove rules that are no longer needed
- Deletion is permanent and cannot be undone
- Users can only delete their own rules
- System verifies rule ownership before deletion

### External Service Integration Capabilities

**Services Configuration Requirements**

Each external service has specific configuration requirements that must be provided in the rule setting's `configuration` field. Below are the supported services and their required/optional parameters:

**Binance:**
- `ApiKey` - String[32 chars] (required)
- `ApiSecret` - String[64 chars] (required)
- `BaseUrl` - String(~ 20 - 100 chars) (required)

**Bybit:**
- `ApiKey` - String[32 chars] (required)
- `ApiSecret` - String[64 chars] (required)
- `BaseUrl` - String(~ 20 - 100 chars) (required)

**Kraken:**
- `ApiKey` - String[~56 chars] (required)
- `ApiSecret` - String[~88 chars] (required)
- `BaseUrl` - String(~ 20 - 100 chars) (required)

**Telegram:**
- `BotToken` - String[~45–50 chars] (required)
- `BaseUrl` - String(~ 20 - 100 chars) (optional)

**Email:**
- `EmailAddress` - String in format (user.name@some-domain.com) (required)

**Discord Webhooks:**
- `WebhookUrl` - String[80-120 chars] (required)
- `UserName` - String (optional)
- `AvatarUrl` - String (optional)

**Slack Webhooks:**
- `WebhookUrl` - String[80-120 chars] (required)
- `Channel` - String (optional)
- `UserName` - String (optional)
- `IconUrl` - String (optional)

**SMS (via Twilio):**
- `AccountSID` - String[34 chars] (required)
- `AuthToken` - String[32 chars] (required)
- `FromNumber` - String (required)
- `ToNumber` - String (required)
- `Message` - String (required)

**Push Notifications (OneSignal):**
- `AppId` - String[36 chars] (required)
- `ApiKey` - String[32-50 chars] (required)
- `PlayerIds` - Array<String> (required)

**WhatsApp Business API:**
- `PhoneNumberId` - String (Phone Number Format) (required)
- `AccessToken` - String(~200-300 chars) (required)
- `RecipientNumber` - String (required)

**Webhooks:**
- `WebhookUrl` - String[80-120 chars] (required)

**Configuration Flexibility**
- Each rule contains a flexible JSON configuration (ruleBody)
- Configuration structure varies by service type
- Supports complex nested configurations for advanced integrations
- Validates JSON structure to ensure proper formatting

### Security & Access Control

**User Isolation**
- Users can only access and manage their own rules
- Rule ownership is enforced at the API level
- Attempts to access other users' rules result in 404 errors
- User authentication required for all operations

**Security Features**
- JWT token-based authentication
- All API endpoints require valid authentication
- Rule ownership verification on every operation
- Secure rule storage in database

## Architecture

The Rules Settings functionality is implemented through communication between the frontend and backend via REST API. The frontend application sends HTTP requests to the backend API endpoints, which handle business logic, data validation, and database operations. The backend processes these requests and returns appropriate responses, enabling users to manage their rule settings and tags through the user interface.

### API Endpoints

**Rule Settings Endpoints:**
- **Create** - Create a new rule setting
- **List** - Get all rule settings for the authenticated user
- **Detailed** - Get a specific rule setting by ID
- **Update** - Update an existing rule setting
- **Delete** - Delete a rule setting

**Rule Settings Tags Endpoints:**
- **Create** - Create a new tag
- **Delete** - Delete a tag
- **Get List** - Get all tags for the authenticated user

## User Interface

User interface Described in documantation - https://docs.google.com/document/d/11UWV_kBOPs_kHnOLkyStPEdFuheSBcXlyjSUuRWLWmg/edit?tab=t.0#heading=h.rqys4m1i086z

## Data Model

The Rules Settings feature uses the `UserRuleSettings` table to store rule's settings configurations. The data model is designed to support flexible JSON-based configurations while maintaining proper relationships with users.

### Database Schema

**Table: `UserRuleSettings`**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | Integer | Primary Key, Auto-increment | Unique identifier for each rule |
| `name` | String | Required, Min Length: 3 | User-friendly name for the rule |
| `code` | String | Required, Unique per user | Unique code identifier for the rule (unique within a user's rules) |
| `description` | String | Not Required, Min Length: 10 | Detailed description of what the rule does |
| `authorId` | Integer | Required, Foreign Key → `User.id` | ID of the user who created the rule |
| `serviceCode` | Enum (`ServiceCode`) | Required | Discriminator identifying which integration this configuration is for (e.g.`TELEGRAM`,`BINANCE``EMAIL`) |
| `configuration` | JSON | Required, Default: `{}` | JSON configuration containing service-specific parameters |


**Table: `RuleSettingsTags`**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | Integer | Primary Key, Auto-increment | Unique identifier for each tag |
| `name` | String | Required | Tag name/label for categorizing and organizing rule settings |
| `userId` | Integer | Required, Foreign Key → `User.id` | ID of the user who owns this tag |

**Table: `RuleSettingsToRuleSettingsTags`** (Junction Table)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `ruleSettingId` | Integer | Required, Foreign Key → `UserRuleSettings.id`, Part of Composite Primary Key | ID of the rule setting |
| `ruleSettingTagId` | Integer | Required, Foreign Key → `RuleSettingsTags.id`, Part of Composite Primary Key | ID of the Rule Settings tag |
| Composite Primary Key | (`ruleSettingId`, `tagId`) | Unique | Ensures a rule setting cannot have the same tag assigned twice |

### Relationships

**User ↔ UserRuleSettings (One-to-Many)**
- Each `User` can have multiple `UserRuleSettings`
- Each `UserRuleSettings` record belongs to exactly one `User` (via `authorId`)
- Foreign key constraint: `UserRuleSettings.authorId` references `User.id`
- Deletion behavior: Restricted (rule's setting cannot be deleted if user is deleted)

**ServiceCode (Enum)**
- `UserRuleSettings.serviceCode` is a fixed enum, not a database table.
 Adding a new integration requires a schema migration to extend the enum,
 plus a dedicated Settings UI component (and backend logic where needed).
- There is no generic schema-driven form — each integration renders its own Settings component.

**User ↔ Tags (One-to-Many)**
- Each `User` can have multiple `Tags`
- Each `Tags` record belongs to exactly one `User` (via `userId`)
- Foreign key constraint: `Tags.userId` references `User.id`
- Deletion behavior: Cascade (tags are automatically deleted when the user is deleted)

**UserRuleSettings ↔ Tags (Many-to-Many via RuleSettingsTags)**
- Each `UserRuleSettings` record can have multiple `Tags` (via `RuleSettingsTags` junction table)
- Each `Tags` record can be assigned to multiple `UserRuleSettings` (via `RuleSettingsTags` junction table)
- Junction table: `RuleSettingsTags` with composite primary key (`ruleSettingId`, `tagId`)
- Foreign key constraints:
  - `RuleSettingsTags.ruleSettingId` references `UserRuleSettings.id`
  - `RuleSettingsTags.tagId` references `Tags.id`
- Deletion behavior:
  - Cascade: When a `UserRuleSettings` is deleted, all associated `RuleSettingsTags` records are deleted
  - Cascade: When a `Tags` is deleted, all associated `RuleSettingsTags` records are deleted
- Uniqueness: A rule setting cannot have the same tag assigned twice (enforced by composite primary key)

## Permissions

The Rules Settings feature implements strict user-based access control, ensuring that users have complete control over their own rule settings and tags while preventing access to other users' data.

### User Rule Settings Permissions

**Full Control Over Own Rule Settings**
- Users can **create** new rule settings for themselves
- Users can **view** all their own rule settings
- Users can **update** any of their own rule settings (name, code, description, configuration, external service)
- Users can **delete** any of their own rule settings
- Users **cannot** access, view, modify, or delete rule settings belonging to other users

**Access Control Enforcement**
- All API endpoints verify rule ownership via `authorId` before allowing operations
- Attempts to access another user's rule settings result in `404 Not Found` errors
- Rule settings are automatically filtered by the authenticated user's ID in queries
- Foreign key constraints ensure rule settings are always associated with their creator

### User Rule Settings Tags Permissions

**Full Control Over Own Tags**
- Users can **create** new tags for themselves
- Users can **view** all their own tags
- Users can **update** their own tags (name)
- Users can **delete** their own tags
- Users **cannot** access, view, modify, or delete tags belonging to other users

**Rule Setting Tag Assignment Permissions**
- Users can **assign** their own tags to their own rule settings
- Users can **remove** tag assignments from their own rule settings
- Users **cannot** assign tags to rule settings they don't own
- Users **cannot** assign other users' tags to their rule settings
- Tag assignments are automatically validated to ensure both the rule setting and tag belong to the same user

**Access Control Enforcement**
- All tag operations verify ownership via `userId` before allowing access
- Tag assignment operations verify both rule setting and tag ownership
- Attempts to access another user's tags result in `404 Not Found` errors
- Tags are automatically filtered by the authenticated user's ID in queries

### Security Features

**Authentication Requirements**
- All rule settings and tag operations require valid JWT authentication
- Unauthenticated requests are rejected with `401 Unauthorized`
- Token validation ensures user identity is verified for every request

**Data Isolation**
- Database queries automatically filter by user ID to prevent data leakage
- Foreign key constraints enforce referential integrity and ownership
- No cross-user data access is possible through the API

**Validation Rules**
- Rule setting ownership is verified on every operation (create, read, update, delete)
- Tag ownership is verified on every operation
- Tag assignment operations verify ownership of both the rule setting and the tag
- Invalid ownership attempts result in appropriate error responses

## References

Rule Settings documentation description - https://docs.google.com/document/d/11UWV_kBOPs_kHnOLkyStPEdFuheSBcXlyjSUuRWLWmg/edit?tab=t.0#heading=h.rqys4m1i086z