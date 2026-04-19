# Alerts Portal Backend

Spring Boot REST API for the Alerts Management Portal.

## Requirements

- Java 17+
- Maven 3.8+
- Supabase PostgreSQL database

## Configuration

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://YOUR_SUPABASE_HOST:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=YOUR_SUPABASE_DB_PASSWORD
app.cors.allowed-origins=http://localhost:5173
```

Get your Supabase connection details from:
**Project Settings → Database → Connection string → URI**

Use the **direct connection** (port 5432) string. Extract host and password from it.

## Running

```bash
cd backend
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/templates | List/search alert templates |
| POST | /api/templates | Create template |
| PUT | /api/templates/{id} | Update template |
| DELETE | /api/templates/{id} | Delete template |
| GET | /api/transactions | List transactions (paginated, filterable) |
| GET | /api/transactions/metrics | Get summary metrics |
| POST | /api/transactions | Create transaction log |
| GET | /api/forms | List form configurations |
| POST | /api/forms | Create form config |
| PUT | /api/forms/{id} | Update form config |
| DELETE | /api/forms/{id} | Delete form config |
| GET | /api/forms/mappings | List alert-form mappings |
| POST | /api/forms/mappings | Create mapping |
| DELETE | /api/forms/mappings/{id} | Delete mapping |
| GET | /api/forms/resolve?alertType=&sourceType= | Resolve form for alert |
| GET | /api/simulate/scenarios | List saved scenarios |
| POST | /api/simulate/scenarios | Save scenario |
| PUT | /api/simulate/scenarios/{id} | Update scenario |
| DELETE | /api/simulate/scenarios/{id} | Delete scenario |
| POST | /api/simulate/send | Run a simulation |
| GET | /api/simulate/logs | Recent simulation logs |
| GET | /api/batch-jobs | List batch jobs |
| POST | /api/batch-jobs | Create batch job |
| POST | /api/batch-jobs/{id}/execute | Execute a batch job |
| DELETE | /api/batch-jobs/{id} | Delete batch job |
