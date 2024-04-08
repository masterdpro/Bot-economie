const mariadb = require("mariadb");
require("dotenv").config();

const minerais = require("./mineral.json");

const pool = mariadb.createPool({
  user: process.env.DB_USR,
  password: process.env.DB_PSW,
  host: "youri",
  database: "exempledb",
});

async function createTable(tableName, columns) {
  let conn;
  try {
    conn = await pool.getConnection();
    const createTableQuery = `
          CREATE TABLE IF NOT EXISTS ${tableName} (
            ${columns
              .map((column) => `${column.name} ${column.type}`)
              .join(",\n")}
          )
        `;
    await conn.query(createTableQuery);
    console.log(`Table ${tableName} created successfully.`);
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.end();
    }
  }
}

async function dropTable(tableName) {
  let conn;
  try {
    conn = await pool.getConnection();
    const dropTableQuery = `
            DROP TABLE IF EXISTS ${tableName}
            `;
    await conn.query(dropTableQuery);
    console.log(`Table ${tableName} dropped successfully.`);
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.end();
    }
  }
}

async function insertData(Table, fieldsProperties, data) {
  let conn;
  try {
    conn = await pool.getConnection();
    const insertDataQuery = `
        INSERT INTO ${Table}(${fieldsProperties.join(", ")})
        VALUES ${data
          .map(
            (row) =>
              `(${row
                .map((value) =>
                  typeof value === "boolean"
                    ? value
                      ? 1
                      : 0
                    : typeof value === "string"
                    ? `'${value}'`
                    : value
                )
                .join(", ")})`
          )
          .join(", ")}
      `;
    await conn.query(insertDataQuery);
    console.log("Data inserted successfully.");
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.end();
    }
  }
}

async function editData(tableName, id, data) {
  if(tableName === "users" ) {
    id = `user_id = ${id}`;
  }else{
    id = `id = ${id}`;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const editDataQuery = `
            UPDATE ${tableName}
            SET ${data
              .map((field) => `${field.name} = ${field.value}`)
              .join(", ")}
            WHERE ${id}
        `;
    await conn.query(editDataQuery);
    console.log("Data updated successfully.");
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.end();
    }
  }
}



async function deleteData(tableName, id) {
  let conn;
  try {
    conn = await pool.getConnection();
    const deleteDataQuery = `
                DELETE FROM ${tableName}
                WHERE id = ${id}
            `;
    await conn.query(deleteDataQuery);
    console.log("Data deleted successfully.");
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.end();
    }
  }
}
async function editTable(tableName, columnsToAdd, columnsToRemove) {
  let conn;
  try {
    conn = await pool.getConnection();

    // Add columns
    if (columnsToAdd.length > 0) {
      const addColumnsQuery = `
          ALTER TABLE ${tableName}
          ${columnsToAdd
            .map((column) => `ADD COLUMN ${column.name} ${column.type}`)
            .join(",\n")}
        `;
      await conn.query(addColumnsQuery);
    }

    // Remove columns
    if (columnsToRemove.length > 0) {
      const removeColumnsQuery = `
          ALTER TABLE ${tableName}
          ${columnsToRemove
            .map((column) => `DROP COLUMN ${column}`)
            .join(",\n")}
        `;
      await conn.query(removeColumnsQuery);
    }

    console.log("Table updated successfully.");
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.end();
    }
  }
}

async function fetchData(tableName) {
  let conn;
  try {
    let rowObj = [];
    conn = await pool.getConnection();
    const fetchDataQuery = `
            SELECT * FROM ${tableName}
        `;
    const rows = await conn.query(fetchDataQuery);
    rows.forEach((row) => {
      rowObj.push(row);
    });
    return rowObj;
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.end();
    }
  }
}

async function createUser(id) {
  if (!id) {
    throw new Error("Missing id");
  }

  try {
    // Fetch data asynchronously
    const rows = await fetchData("users");

    let exist = false;
    rows.forEach((row) => {
      if (row.user_id === id) {
        exist = true;
      }
    });

    const inventory = JSON.stringify({});
    const mine = JSON.stringify({});
    const work_delay = JSON.stringify({
      timestamp: 0,
      delay: 3600000,
      level: 0,
    });
    const hunt_delay = JSON.stringify({
      timestamp: 0,
      delay: 3600000,
      level: 0,
    });

    if (exist) {
      return;
    }

    if (!exist) {
      await insertData(
        "users",
        ["user_id", "coins", "inventory", "work_delay", "hunt_delay", "mine"],
        [[id, 0, inventory, work_delay, hunt_delay, mine]]
      );
    }
  } catch (error) {
    console.error(error);
  }
}

async function getUser(id) {
  if (!id) {
    throw new Error("Missing id");
  }

  try {
    // Fetch data asynchronously
    const rows = await fetchData("users");

    let user = null;
    rows.forEach((row) => {
      if (row.user_id === id) {
        user = row;
      }
    });

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function work(id, timestamp) {
  const user = await getUser(id);

  console.log(user);

  const workDelay = JSON.parse(user.work_delay).delay;
  const lastWork = JSON.parse(user.work_delay).timestamp;
  const level = JSON.parse(user.work_delay).level;

  if (timestamp - lastWork < workDelay) {
    console.log("You cant work");
    return "early";
  }

  const money = Math.floor(Math.random() * (100 - 50 + 1)) + 50;

  let conn;
  try {
    conn = await pool.getConnection();
    const editDataQuery = `
                UPDATE users
                SET coins = coins + ${money},
                work_delay = '${JSON.stringify({
                  timestamp: timestamp,
                  delay: workDelay,
                  level: 0,
                })}'
                WHERE user_id = ${id}
            `;
    await conn.query(editDataQuery);
    return money;
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.end();
    }
  }
}

async function mine(id, timestamp) {
  const user = await getUser(id);

  const mineDelay = JSON.parse(user.hunt_delay).delay;
  const lastWork = JSON.parse(user.hunt_delay).timestamp;
  const level = JSON.parse(user.hunt_delay).level;

  if (timestamp - lastWork < mineDelay) {
    console.log("You cant work");
    return "early";
  }

  let mineInv = JSON.parse(user.mine);
  if (!mineInv) mineInv = {};
  const mine = minerais[Math.floor(Math.random() * minerais.length)];

  console.log(mine);
  const newInv = mineInv[mine] ? mineInv[mine] + 1 : 1;
  if (mineInv[mine.name]) {
    mineInv[mine.name] += 1;
  } else {
    mineInv[mine.name] = 1;
  }
  console.log(mineInv);

  let conn;
  try {
    conn = await pool.getConnection();
    const editDataQuery = `
                UPDATE users
                SET mine = '${JSON.stringify(mineInv)}',
                hunt_delay = '${JSON.stringify({
                  timestamp: timestamp,
                  delay: mineDelay,
                  level: 0,
                })}'
                WHERE user_id = ${id}
            `;
    await conn.query(editDataQuery);
    return mine;
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.end();
    }
  }
}

async function removeMinerals(id, mineral, amount) {
  const user = await getUser(id);
  const mineInv = JSON.parse(user.mine);

  if (mineInv[mineral] < amount) {
    return false;
  }

  mineInv[mineral] -= amount;

  let conn;
  try {
    conn = await pool.getConnection();
    const editDataQuery = `
                UPDATE users
                SET mine = '${JSON.stringify(mineInv)}'
                WHERE user_id = ${id}
            `;
    await conn.query(editDataQuery);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.end();
    }
  }
}

async function resetHuntDelay(id) {
  let conn;
  try {
    conn = await pool.getConnection();
    const editDataQuery = `
                UPDATE users
                SET hunt_delay = '${JSON.stringify({
                  timestamp: 0,
                  delay: 3600000,
                  level: 0,
                })}'
                WHERE user_id = ${id}
            `;
    await conn.query(editDataQuery);
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.end();
    }
  }
}

async function addItem(id, item, amount) {
  const user = await getUser(id);
  const inventory = JSON.parse(user.inventory);

  if (inventory[item]) {
    inventory[item] += amount;
  } else {
    inventory[item] = amount;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const editDataQuery = `
                UPDATE users
                SET inventory = '${JSON.stringify(inventory)}'
                WHERE user_id = ${id}
            `;
    await conn.query(editDataQuery);
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.end();
    }
  }
}

function isCraftOfItem(craft, item) {
  if (item.craft === null) return false;
  if (craft.length !== item.craft.length) {
    return false;
  }

  if (item.craft !== craft) return false;

  for (let i = 0; i < craft.length; i++) {
    if (craft[i] !== "_" && craft[i] !== item.craft[i]) {
      return false;
    }
  }

  return true;
}

function colorText(text, color) {
  let colorText = "";
  let colorCode;

  color = color.toLowerCase();

  if (color === "blue" || color === "commun") {
    colorText = `[2;34m${text}[0m`;
    colorCode = 0x268bd2;
  }
  if (color === "silver") {
    colorText = `[2;38m${text}[0m`;
    colorCode = 0x4f545c;
  }
  if (color === "green" || color === "rare") {
    colorText = `[2;36m${text}[0m`;
    colorCode = 0x859900;
  }
  if (color === "pink" || color === "epique") {
    colorText = `[2;35m${text}[0m`;
    colorCode = 0xd33682;
  }
  if (color === "white") {
    colorText = `[2;37m${text}[0m`;
    colorCode = 0xffffff;
  }
  if (color === "black") {
    colorText = `[2;30m${text}[0m`;
    colorCode = 0x000000;
  }
  if (color === "yellow" || color === "legendaire") {
    colorText = `[2;33m${text}[0m`;
    colorCode = 0xb58900;
  }

  return { text: `${colorText}`, color: colorCode };
}

async function removeMinerals(id, mineral, amount) {
  const user = await getUser(id);
  const mineInv = JSON.parse(user.mine);
  console.log(mineInv);
  if (mineInv[mineral] < amount || mineInv[mineral] === null) {
    mineInv[mineral] = 0;
  } else {
    mineInv[mineral] -= amount;
  }

  console.log(mineInv);

  let conn;
  try {
    conn = await pool.getConnection();
    const editDataQuery = `
                UPDATE users
                SET mine = '${JSON.stringify(mineInv)}'
                WHERE user_id = ${id}
            `;
    await conn.query(editDataQuery);
    return true;
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.end();
    }
  }
}

async function checkIfSomeoneAsItem(item) {
  const users = await fetchData("users");
  let userWithItem = null;
  users.forEach((user) => {
    if (user.inventory[item] > 0) {
      userWithItem = user;
    }
  });
  return userWithItem;
}
async function addItemToShop(usrId, item, amount, price) {
  console.log(usrId, item, amount, price);
  const user = await getUser(usrId);
  const inventory = JSON.parse(user.inventory);

  if (inventory[item]) {
    inventory[item] -= amount;
  } else {
    inventory[item] = amount;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const editDataQuery = `
                UPDATE users
                SET inventory = '${JSON.stringify(inventory)}'
                WHERE user_id = ${usrId}
            `;
    await conn.query(editDataQuery);
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.end();
    }
  }

  const itemJson = {
    item: item,
    amount: amount,
  };

  insertData(
    "shop",
    ["user_id", "price", "item"],
    [[usrId, price, JSON.stringify(itemJson)]]
  );
}


async function getShop() {
  const shop = await fetchData("shop");
  return shop;
}

async function updateUser(id, data) {
  let conn;
  try {
    conn = await pool.getConnection();

    const editDataQuery = `
      UPDATE users
      SET inventory = ?
      WHERE user_id = ?
    `;
    
    const values = [data[0].value, id]; // Assuming inventory is the first item in the data array

    console.log(values);
    await conn.query(editDataQuery, values);
    console.log("Data updated successfully.");
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.end();
    }
  }
}


//export my function
module.exports = {
  createTable,
  insertData,
  fetchData,
  editData,
  deleteData,
  editTable,
  createUser,
  dropTable,
  getUser,
  work,
  addItem,
  mine,
  resetHuntDelay,
  isCraftOfItem,
  colorText,
  removeMinerals,
  checkIfSomeoneAsItem,
  addItemToShop,
  getShop,
  updateUser,
};
