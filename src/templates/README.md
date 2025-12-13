# Templates Directory

This directory contains template files used by the Xacos CLI for generating project files.

## 📁 Structure

```
templates/
├── base/              # Base project templates
│   ├── app.js        # Express app configuration
│   ├── server.js     # Server bootstrap
│   └── routes-index.js # Main routes file
│
├── modules/           # Module templates (for `xacos add`)
│   ├── controller.js # Controller template
│   ├── service.js    # Service template
│   ├── routes.js     # Routes template
│   ├── model-mongodb.js  # MongoDB model
│   ├── model-prisma.js   # Prisma model
│   └── model-basic.js     # Basic in-memory model
│
├── features/         # Feature-specific templates
│   ├── redis.js      # Redis utility
│   ├── websocket.js  # Native WebSocket
│   └── socketio.js   # Socket.io
│
├── config/           # Configuration templates
│   ├── db-mongodb.js # MongoDB connection
│   └── db-prisma.js  # Prisma connection
│
└── utils/            # Utility templates
    ├── logger.js     # Logger utility
    └── response.js   # Response helpers
```

## 🔧 Template Variables

Templates use placeholder variables that are replaced during generation:
- `{{ext}}` - File extension (js or ts)
- `{{moduleName}}` - Lowercase module name (e.g., "user")
- `{{ModuleName}}` - Capitalized module name (e.g., "User")
- `{{MODULE_NAME}}` - Uppercase module name (e.g., "USER")
- `{{projectName}}` - Project name

## 📝 Usage

**Current Implementation:**
Templates are currently embedded as template strings in command files for simplicity and performance. The files in this directory serve as:
- **Reference** - Easy to see what gets generated
- **Customization** - Can be modified and used with a template engine
- **Documentation** - Clear examples of generated code

**Future Enhancement:**
These templates can be integrated with a template engine (like `ejs` or `handlebars`) for more flexible customization.

## 🎯 Template Categories

### Base Templates
Core application files that form the foundation of every project.

### Module Templates
Used by `xacos add <name>` command to generate:
- Controllers (CRUD operations)
- Services (business logic)
- Models (database operations)
- Routes (RESTful endpoints)

### Feature Templates
Optional features that can be added:
- Redis caching
- WebSocket/Socket.io real-time communication
- Message queues
- Pub/Sub systems

### Config Templates
Database and configuration setup files.

## 🔄 Customization

To customize templates:
1. Modify the template files in this directory
2. Update the corresponding command files to use these templates
3. Or use a template engine to process these files dynamically

## 📚 Example

When you run `npx xacos add Users`, the CLI:
1. Reads `modules/controller.js` template
2. Replaces `{{moduleName}}` with "user"
3. Replaces `{{ModuleName}}` with "User"
4. Replaces `{{ext}}` with "js" or "ts"
5. Generates `src/controllers/user.controller.js`

