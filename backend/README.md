# Backend - Snowflake Cortex Data Intelligence API

## Overview

This is a Flask-based Python backend that leverages **Snowflake Cortex AI** to perform intelligent data warehouse analysis with **dynamic credential management** and **selective table analysis**. The system uses multiple AI agents to analyze schema metadata, generate KPIs, create visualizations, assess data quality, and provide natural language insights about your Snowflake database.

## 🆕 New Features

### 1. Dynamic Credential Configuration
- **UI-driven connection setup** - No need to edit .env files
- **Secure .pem file upload** - Upload private keys directly through API
- **Temporary credential handling** - Credentials are used once and cleaned up
- **Session isolation** - Each analysis uses its own Snowflake session

### 2. Selective Table Analysis
- **Table listing endpoint** - Fetch all available tables from a schema
- **Filtered metadata extraction** - Analyze only selected tables
- **Optimized performance** - Skip unnecessary table scans

### 3. Enhanced Error Handling
- **Date/datetime serialization** - Proper JSON conversion for temporal types
- **Null value handling** - Graceful handling of missing KPI values
- **Detailed logging** - Step-by-step pipeline progress indicators

## Architecture

### Core Components

#### 1. **AI Agent System**
The backend implements a multi-agent architecture where specialized agents handle different aspects of data analysis:

- **BaseAgent**: Foundation class for all AI agents that interact with Snowflake Cortex
- **MetadataAgent**: Retrieves schema information with optional table filtering
- **DataProfilerAgent**: Profiles tables (row counts, basic statistics)
- **DataQualityScopeAgent**: Uses AI to determine which columns should be checked for quality issues
- **DataQualityProfiler**: Executes SQL checks for missing values, duplicates, and invalid dates
- **DataQualityAgent**: Analyzes quality signals and generates actionable recommendations
- **RelationshipAgent**: Infers table relationships based on column naming patterns
- **KPIGeneratorAgent**: AI-generates relevant KPIs based on available data
- **KPIExecutionAgent**: Executes KPI SQL queries and returns results
- **ChartGeneratorAgent**: Creates chart definitions with appropriate visualizations
- **ChartDataAgent**: Executes chart queries with intelligent fallback mechanisms
- **NarrativeInsightAgent**: Generates executive-level summary insights
- **ChatAgent**: Provides conversational AI interface for querying insights

#### 2. **Pipeline Architecture**

The `run_pipeline()` function orchestrates the complete analysis with enhanced logging:

```
🚀 STARTING DATA ANALYSIS PIPELINE
============================================================
1. Connect to Snowflake (dynamic or .env credentials)
2. Extract metadata (filtered by selected tables if provided)
3. Profile data (row counts with visual output)
4. Infer relationships (FK patterns)
5. Generate and execute KPIs (with null handling)
6. Generate and execute charts (with dynamic repair)
7. Determine data quality scope (AI-driven)
8. Execute quality checks (SQL-based validation)
9. Analyze quality issues (AI insights)
10. Generate narrative insights
11. Store complete report in CLEAN_INSIGHTS_STORE
============================================================
✨ PIPELINE COMPLETED SUCCESSFULLY
```

**New Parameters:**
```python
def run_pipeline(session=None, selected_tables=None):
    # session: Optional pre-configured Snowflake session
    # selected_tables: Optional list of table names to analyze
```

### Key Features

#### Dynamic SQL Repair
The `repair_chart_sql()` function provides intelligent fallback when Cortex-generated SQL fails:
- Automatically selects safe dimension columns (DATE, DEVICE_TYPE, CHANNEL)
- Identifies numeric columns for aggregation
- Constructs valid GROUP BY queries with appropriate limits

#### Cortex AI Integration
All AI agents use Snowflake Cortex via `SNOWFLAKE.CORTEX.COMPLETE()` function:
- Model: `mistral-large2` (configurable)
- Returns structured JSON responses
- Handles prompt engineering for data-specific tasks

#### Security
- Private key authentication (PKCS#8 DER format)
- Environment-based configuration for legacy endpoints
- **Dynamic credential support** with temporary file cleanup
- No credentials stored permanently when using UI configuration

#### Data Sanitization
Enhanced `sanitize_for_json()` function handles:
- Decimal to float conversion
- **Date and datetime to ISO string conversion**
- Nested dict/list sanitization
- Null value preservation

## API Endpoints

### 1. `GET /`
Health check endpoint.

**Response:**
```json
{
  "service": "Snowflake Cortex Data Intelligence API",
  "endpoints": [
    "/run-analysis",
    "/list-tables",
    "/clean-report",
    "/clean-report/runs",
    "/clean-report/<load_id>"
  ]
}
```

### 2. **NEW** `POST /list-tables`
Fetches all tables from a Snowflake schema using provided credentials.

**Request (multipart/form-data):**
- `account`: Snowflake account identifier (e.g., "WB19670-C2GPARTNERS")
- `user`: Username
- `role`: Role name
- `warehouse`: Warehouse name
- `database`: Database name
- `schema`: Schema name
- `private_key_file`: .pem file upload
- `private_key_passphrase`: Optional passphrase

**Response:**
```json
{
  "status": "success",
  "tables": ["TABLE1", "TABLE2", "TABLE3"],
  "count": 3
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Error description"
}
```

### 3. `POST /run-analysis` (Enhanced)
Triggers analysis with dynamic credentials and table selection.

**Request (multipart/form-data):**
- `account`: Snowflake account
- `user`: Username
- `role`: Role name
- `warehouse`: Warehouse name
- `database`: Database name
- `schema`: Schema name
- `private_key_file`: .pem file upload
- `private_key_passphrase`: Optional passphrase
- `tables`: JSON array of table names (e.g., `["TABLE1", "TABLE2"]`)

**Response:**
```json
{
  "status": "success",
  "data": {
    "meta": {
      "load_id": "uuid",
      "generated_at": "ISO timestamp",
      "schema_analyzed": "SCHEMA_NAME"
    },
    "summary": { ... },
    "understanding": { ... },
    "kpis": [ ... ],
    "charts": [ ... ],
    "data_quality": { ... },
    "transformations": [ ... ],
    "insights": { ... }
  }
}
```

### 4. `GET /run-analysis` (Legacy)
Triggers analysis using .env credentials for all tables.

**Process:**
1. Analyzes all tables in configured schema
2. Generates 4 KPIs
3. Creates 4 charts with data
4. Performs data quality checks
5. Stores report with unique `load_id`

**Response:**
```json
{
  "status": "success",
  "data": {
    "meta": {
      "load_id": "uuid",
      "generated_at": "ISO timestamp",
      "schema_analyzed": "SCHEMA_NAME"
    },
    "summary": { ... },
    "understanding": { ... },
    "kpis": [ ... ],
    "charts": [ ... ],
    "data_quality": { ... },
    "transformations": [ ... ],
    "insights": { ... }
  }
}
```

### 3. `GET /clean-report` or `GET /clean-report/<load_id>`
Retrieves the latest or specific analysis report.

**Response:**
```json
{
  "status": "success",
  "load_id": "uuid",
  "load_datetime": "timestamp",
  "data": { ... }
}
```

### 4. `GET /clean-report/runs`
Lists all available report runs.

**Response:**
```json
[
  {
    "load_id": "uuid",
    "load_datetime": "timestamp"
  }
]
```

### 5. `POST /chat`
Conversational AI interface for querying insights.

**Request:**
```json
{
  "message": "What are the top KPIs?"
}
```

**Response:**
```json
{
  "status": "success",
  "load_id": "uuid",
  "load_datetime": "timestamp",
  "question": "What are the top KPIs?",
  "answer": "Based on the latest insights, the top KPIs are..."
}
```

## Configuration

### Environment Variables (`.env`)

```bash
# Snowflake Connection
SNOWFLAKE_USER=your_username
SNOWFLAKE_ACCOUNT=your_account.region
SNOWFLAKE_WAREHOUSE=your_warehouse
SNOWFLAKE_DATABASE=your_database
SNOWFLAKE_SCHEMA=your_schema
SNOWFLAKE_ROLE=your_role

# Authentication
PRIVATE_KEY_PATH=./CLARITY_SERVICE_ACCOUNT.pem
PRIVATE_KEY_PASSPHRASE=your_passphrase
```

### Required Snowflake Objects

#### Table: CLEAN_INSIGHTS_STORE
```sql
CREATE TABLE CLEAN_INSIGHTS_STORE (
  LOAD_ID VARCHAR(255) PRIMARY KEY,
  LOAD_DATETIME TIMESTAMP_NTZ,
  CLEAN_JSON VARIANT
);
```

## Installation

### Prerequisites
- Python 3.8+
- Snowflake account with Cortex enabled
- Private key file (.pem format)

### Setup

1. **Install dependencies:**
```bash
pip install flask flask-cors snowflake-connector-python snowflake-snowpark-python cryptography
```

2. **Configure environment:**
Create `.env` file with your Snowflake credentials.

3. **Generate private key (if needed):**
```bash
# Generate private key
openssl genrsa 2048 | openssl pkcs8 -topk8 -inform PEM -out rsa_key.p8

# Extract public key
openssl rsa -in rsa_key.p8 -pubout -out rsa_key.pub

# Add public key to Snowflake user
ALTER USER your_username SET RSA_PUBLIC_KEY='...';
```

4. **Create required Snowflake objects:**
```sql
CREATE TABLE CLEAN_INSIGHTS_STORE (
  LOAD_ID VARCHAR(255),
  LOAD_DATETIME TIMESTAMP_NTZ,
  CLEAN_JSON VARIANT
);
```

5. **Run the server:**
```bash
python app.py
```

Server will start on `http://0.0.0.0:8080`

## Usage Examples

### Run Analysis
```bash
curl http://localhost:8080/run-analysis
```

### Get Latest Report
```bash
curl http://localhost:8080/clean-report
```

### Query with Chat
```bash
curl -X POST http://localhost:8080/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the data quality score?"}'
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Request                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Flask Application (app.py)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Agent Orchestration                      │  │
│  │                                                            │  │
│  │  1. MetadataAgent → Schema Info                          │  │
│  │  2. DataProfilerAgent → Row Counts                       │  │
│  │  3. RelationshipAgent → Table Relationships              │  │
│  │  4. KPIGeneratorAgent + KPIExecutionAgent → KPIs         │  │
│  │  5. ChartGeneratorAgent + ChartDataAgent → Charts        │  │
│  │  6. DataQualityScopeAgent → Quality Targets              │  │
│  │  7. DataQualityProfiler → SQL Validation                 │  │
│  │  8. DataQualityAgent → Quality Analysis                  │  │
│  │  9. NarrativeInsightAgent → Summary                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Snowflake Cortex AI                            │
│  • Mistral-Large2 Model                                         │
│  • INFORMATION_SCHEMA queries                                   │
│  • Data table queries                                           │
│  • CLEAN_INSIGHTS_STORE (persistence)                           │
└─────────────────────────────────────────────────────────────────┘
```

## Error Handling

- **Extract JSON**: Robust parsing with regex fallback for malformed Cortex responses
- **Sanitize for JSON**: Converts Snowflake types (Decimal, VARIANT) to JSON-serializable formats
- **Dynamic SQL Repair**: Automatically repairs invalid chart SQL with schema-aware fallbacks
- **Try-catch blocks**: Graceful degradation when agents fail

## Development Notes

### Adding New Agents
```python
class NewAgent(BaseAgent):
    def run(self, context):
        return self.cortex(f"""
            Your prompt here
            Context: {json.dumps(context)}
            Format: {{ "result": "" }}
        """)
```

### Customizing AI Model
Change model in agent initialization:
```python
agent = BaseAgent(session, model="llama3-70b")
```

### Adding Endpoints
```python
@app.route("/new-endpoint", methods=["GET", "POST"])
def new_endpoint():
    # Your logic here
    return jsonify({"status": "success"})
```

## Performance Considerations

- **Metadata queries**: Cached per pipeline run
- **Table profiling**: Limited to 15 tables
- **Chart data**: Limited to 20 rows per chart
- **Cortex calls**: Synchronous, ~2-5 seconds each
- **Total pipeline time**: 30-60 seconds for complete analysis

## Troubleshooting

### Issue: "No response from Cortex"
- Check Cortex availability in your region
- Verify model name is correct
- Ensure role has Cortex privileges

### Issue: "Private key authentication failed"
- Verify key format (PKCS#8 DER)
- Check passphrase
- Ensure public key is added to Snowflake user

### Issue: "Chart SQL errors"
- Dynamic repair should handle most cases
- Check table/column names for special characters
- Review `repair_chart_sql()` logic

## License

Proprietary - Data Insights Hub

## Support

For issues and questions, contact the development team.
