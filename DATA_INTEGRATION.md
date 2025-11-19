# Data Integration Guide 📊

คู่มือการเชื่อมต่อและดึงข้อมูลจากแหล่งต่างๆ เพื่อแสดงผลใน MultiDashboard

## 📑 สารบัญ

- [ภาพรวม Architecture](#ภาพรวม-architecture)
- [Data Sources ที่รองรับ](#data-sources-ที่รองรับ)
- [การใช้งาน](#การใช้งาน)
- [Backend API Requirements](#backend-api-requirements)
- [ตัวอย่างการใช้งาน](#ตัวอย่างการใช้งาน)

---

## ภาพรวม Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     MultiDashboard UI                        │
│                  (React Frontend / Browser)                   │
└────────────────────────┬─────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────┐     ┌────▼─────┐    ┌────▼─────┐
   │  REST   │     │ Backend  │    │ InfluxDB │
   │   API   │     │   Proxy  │    │  Direct  │
   └─────────┘     └────┬─────┘    └──────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
   ┌─────▼─────┐  ┌────▼────┐   ┌────▼────┐
   │PostgreSQL │  │  MySQL  │   │  MQTT   │
   └───────────┘  └─────────┘   └─────────┘
```

### เส้นทางข้อมูล (Data Flow)

1. **Direct Connection** (ไม่ต้องใช้ Backend)
   - REST API
   - WebSocket
   - InfluxDB (HTTP API)

2. **Via Backend Proxy** (ต้องมี Backend Server)
   - PostgreSQL
   - MySQL
   - MQTT

---

## Data Sources ที่รองรับ

### 1. REST API ⚡
**ใช้ได้โดยตรง** - ไม่ต้องมี Backend

```typescript
{
  type: 'rest',
  url: 'https://api.example.com/data',
  method: 'GET',
  headers: { 'Authorization': 'Bearer token' },
  refreshInterval: 5000 // รีเฟรชทุก 5 วินาที
}
```

**ข้อดี:**
- ใช้งานง่าย ไม่ต้องตั้ง Backend
- รองรับทุก HTTP Methods (GET, POST, PUT, DELETE)
- กำหนด Headers และ Body ได้เอง

**ข้อจำกัด:**
- ต้องมี CORS enabled
- ไม่สามารถเชื่อมต่อ internal network ได้

---

### 2. PostgreSQL 🐘
**ต้องมี Backend API**

```typescript
{
  type: 'postgresql',
  host: 'localhost',
  port: 5432,
  database: 'mydb',
  username: 'postgres',
  password: 'password',
  query: 'SELECT * FROM sensors WHERE timestamp > NOW() - INTERVAL \'1 hour\'',
  ssl: false,
  refreshInterval: 10000
}
```

**ข้อดี:**
- รองรับ SQL query ที่ซับซ้อน
- JOIN, Aggregate functions ทำได้หมด
- รองรับ SSL connection

**ต้องการ Backend Endpoint:**
```
POST /api/datasource/postgresql
POST /api/datasource/postgresql/test
POST /api/datasource/postgresql/tables
```

---

### 3. MySQL 🐬
**ต้องมี Backend API**

```typescript
{
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'mydb',
  username: 'root',
  password: 'password',
  query: 'SELECT * FROM sensors WHERE timestamp > DATE_SUB(NOW(), INTERVAL 1 HOUR)',
  ssl: false,
  refreshInterval: 10000
}
```

**ข้อดี:**
- รองรับ MySQL-specific functions
- เชื่อมต่อกับ MariaDB ได้ด้วย

**ต้องการ Backend Endpoint:**
```
POST /api/datasource/mysql
POST /api/datasource/mysql/test
POST /api/datasource/mysql/tables
```

---

### 4. MQTT 📡
**ต้องมี Backend Proxy**

```typescript
{
  type: 'mqtt',
  brokerUrl: 'mqtt://broker.hivemq.com',
  port: 1883,
  topic: 'sensors/temperature',
  username: 'user',
  password: 'pass',
  qos: 0, // 0, 1, หรือ 2
  refreshInterval: 0 // Real-time, ไม่ต้อง refresh
}
```

**ข้อดี:**
- Real-time data streaming
- รองรับ wildcards (# และ +)
- QoS levels 0, 1, 2

**Topic Wildcards:**
- `sensors/#` - ทุก topic ที่ขึ้นต้นด้วย sensors/
- `sensors/+/temperature` - temperature จากทุก sensor

**ต้องการ Backend WebSocket:**
```
WS /api/datasource/mqtt/ws
POST /api/datasource/mqtt/test
```

---

### 5. InfluxDB 📈
**ใช้ได้โดยตรง** - เชื่อมต่อ HTTP API

```typescript
{
  type: 'influxdb',
  url: 'http://localhost:8086',
  token: 'your-token-here',
  org: 'my-org',
  bucket: 'my-bucket',
  query: `
    from(bucket: "my-bucket")
      |> range(start: -1h)
      |> filter(fn: (r) => r._measurement == "temperature")
  `,
  refreshInterval: 5000
}
```

**ข้อดี:**
- เหมาะสำหรับ Time-series data
- รองรับ Flux query language
- ดึงข้อมูลย้อนหลังได้ง่าย

**ข้อจำกัด:**
- ต้องเปิด CORS ที่ InfluxDB server
- ต้องมี API token

---

### 6. WebSocket 🔄
**ใช้ได้โดยตรง**

```typescript
{
  type: 'websocket',
  url: 'wss://api.example.com/ws',
  refreshInterval: 0 // Real-time
}
```

**ข้อดี:**
- Real-time bidirectional communication
- ค่อนข้างเบา ใช้ bandwidth น้อย

---

### 7. Static Data 📄
**ใช้ได้โดยตรง** - สำหรับทดสอบ

```typescript
{
  type: 'static',
  data: {
    labels: ['Jan', 'Feb', 'Mar'],
    values: [10, 20, 30]
  }
}
```

---

## การใช้งาน

### ขั้นตอนที่ 1: สร้าง Widget

1. คลิกปุ่ม "Edit" ที่มุมขวาบน
2. เลือกประเภท Widget ที่ต้องการ (Chart, Table, Number, Map)
3. คลิกไอคอน Settings (⚙️) ที่ Widget

### ขั้นตอนที่ 2: Configure Data Source

1. ใน Widget Settings Modal คลิก "Configure"
2. เลือกประเภท Data Source
3. กรอกข้อมูลการเชื่อมต่อ:
   - **PostgreSQL/MySQL**: Host, Port, Database, Username, Password, SQL Query
   - **MQTT**: Broker URL, Topic, Credentials
   - **InfluxDB**: URL, Token, Org, Bucket, Flux Query
   - **REST API**: URL, Method, Headers

### ขั้นตอนที่ 3: กำหนด Refresh Interval

- **Real-time sources** (MQTT, WebSocket): ตั้งเป็น 0 หรือเว้นว่าง
- **Polling sources**: ตั้งเวลาเป็น milliseconds (เช่น 5000 = 5 วินาที)

### ขั้นตอนที่ 4: Save และทดสอบ

1. คลิก "Save Changes"
2. ข้อมูลจะแสดงใน Widget ทันที
3. ถ้ามี error จะแสดงที่ console

---

## Backend API Requirements

สำหรับ Data Sources ที่ต้องใช้ Backend (PostgreSQL, MySQL, MQTT)

### Node.js + Express Example

```javascript
const express = require('express');
const { Client } = require('pg'); // PostgreSQL
const mysql = require('mysql2/promise'); // MySQL
const mqtt = require('mqtt'); // MQTT
const WebSocket = require('ws');

const app = express();
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// PostgreSQL Endpoint
app.post('/api/datasource/postgresql', async (req, res) => {
  const { host, port, database, username, password, query, ssl } = req.body;

  try {
    const client = new Client({
      host,
      port,
      database,
      user: username,
      password,
      ssl: ssl ? { rejectUnauthorized: false } : false,
    });

    await client.connect();
    const result = await client.query(query);
    await client.end();

    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PostgreSQL Test Connection
app.post('/api/datasource/postgresql/test', async (req, res) => {
  const { host, port, database, username, password, ssl } = req.body;

  try {
    const client = new Client({
      host,
      port,
      database,
      user: username,
      password,
      ssl: ssl ? { rejectUnauthorized: false } : false,
    });

    await client.connect();
    await client.end();

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// MySQL Endpoint
app.post('/api/datasource/mysql', async (req, res) => {
  const { host, port, database, username, password, query, ssl } = req.body;

  try {
    const connection = await mysql.createConnection({
      host,
      port,
      database,
      user: username,
      password,
      ssl: ssl ? {} : false,
    });

    const [rows] = await connection.execute(query);
    await connection.end();

    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MQTT WebSocket Proxy
const wss = new WebSocket.Server({ noServer: true });
const mqttClients = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const msg = JSON.parse(message);

    if (msg.action === 'subscribe') {
      const { brokerUrl, port, topic, clientId, username, password, qos } = msg.config;

      const mqttClient = mqtt.connect(brokerUrl, {
        port,
        clientId,
        username,
        password,
      });

      mqttClient.on('connect', () => {
        mqttClient.subscribe(topic, { qos }, (err) => {
          if (!err) {
            ws.send(JSON.stringify({ type: 'subscribed', topic }));
          }
        });
      });

      mqttClient.on('message', (topic, payload) => {
        try {
          const data = JSON.parse(payload.toString());
          ws.send(JSON.stringify({ type: 'data', payload: data }));
        } catch {
          ws.send(JSON.stringify({ type: 'data', payload: payload.toString() }));
        }
      });

      mqttClients.set(ws, mqttClient);
    }
  });

  ws.on('close', () => {
    const mqttClient = mqttClients.get(ws);
    if (mqttClient) {
      mqttClient.end();
      mqttClients.delete(ws);
    }
  });
});

// Upgrade HTTP to WebSocket
const server = app.listen(3001, () => {
  console.log('Backend API running on http://localhost:3001');
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
```

---

## ตัวอย่างการใช้งาน

### ตัวอย่าง 1: Dashboard อุณหภูมิ Real-time จาก MQTT

```typescript
// Widget: Line Chart
// Data Source: MQTT

{
  type: 'mqtt',
  brokerUrl: 'mqtt://broker.hivemq.com',
  topic: 'home/livingroom/temperature',
  qos: 1
}

// MQTT Payload Format:
{
  "temperature": 25.5,
  "timestamp": "2025-01-19T10:30:00Z"
}
```

### ตัวอย่าง 2: Sales Report จาก PostgreSQL

```typescript
// Widget: Table
// Data Source: PostgreSQL

{
  type: 'postgresql',
  host: 'db.company.com',
  database: 'sales',
  username: 'reporter',
  password: '***',
  query: `
    SELECT
      product_name,
      SUM(quantity) as total_sold,
      SUM(quantity * price) as revenue
    FROM sales
    WHERE sale_date >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY product_name
    ORDER BY revenue DESC
    LIMIT 10
  `
}
```

### ตัวอย่าง 3: Server Metrics จาก InfluxDB

```typescript
// Widget: Chart (Area)
// Data Source: InfluxDB

{
  type: 'influxdb',
  url: 'http://monitoring.company.com:8086',
  token: 'your-token',
  org: 'devops',
  bucket: 'server-metrics',
  query: `
    from(bucket: "server-metrics")
      |> range(start: -1h)
      |> filter(fn: (r) => r._measurement == "cpu")
      |> filter(fn: (r) => r.host == "web-01")
      |> aggregateWindow(every: 1m, fn: mean)
  `,
  refreshInterval: 10000
}
```

---

## Tips & Best Practices

### 🔒 Security
- **ไม่เก็บ password ในฝั่ง Frontend** - ควรใช้ environment variables ที่ Backend
- **ใช้ SSL/TLS** สำหรับ production
- **จำกัด permissions** ของ database user ให้เป็น read-only
- **ใช้ API tokens** แทน username/password ถ้าทำได้

### ⚡ Performance
- **ตั้ง Refresh Interval ที่เหมาะสม** - ไม่ควรต่ำกว่า 1000ms
- **จำกัดจำนวนข้อมูล** ด้วย LIMIT ใน SQL query
- **ใช้ Aggregate** สำหรับข้อมูลจำนวนมาก
- **Cache ที่ Backend** สำหรับ query ที่ช้า

### 📊 Data Format
- **ให้ข้อมูลเป็น Array of Objects** เพื่อความยืดหยุ่น
- **ใช้ field names ที่สื่อความหมาย**
- **รวม timestamp** ถ้าเป็น time-series data

---

## Troubleshooting

### ❌ "CORS Error"
- เปิด CORS ที่ API server
- ใช้ Backend proxy แทนการเชื่อมตรง

### ❌ "Connection Refused"
- ตรวจสอบ Backend API running หรือไม่
- ตรวจสอบ firewall และ port

### ❌ "Invalid Query"
- ทดสอบ SQL query ใน database client ก่อน
- ตรวจสอบ syntax และ permissions

### ❌ "No Data Displayed"
- เช็ค browser console สำหรับ errors
- ตรวจสอบ data format ที่ถูกส่งกลับมา
- ลอง Static Data เพื่อทดสอบ widget ก่อน

---

## 📚 เอกสารเพิ่มเติม

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [MQTT Protocol](https://mqtt.org/)
- [InfluxDB Flux Language](https://docs.influxdata.com/influxdb/cloud/query-data/flux/)

---

**สร้างโดย:** MultiDashboard Team
**อัพเดทล่าสุด:** January 2025
