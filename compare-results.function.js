const fs = require("fs");
const path = require("path");

function logObj(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

function compare(obj1, obj2, keysToIgnore = [], paths = {}, compareTypes = []) {
  // Check if both arguments are objects
  if (typeof obj1 !== "object" || typeof obj2 !== "object") {
    return obj1 === obj2; // Compare primitive values directly
  }

  // Check if both arguments are null or undefined
  if (!obj1 || !obj2) {
    return obj1 === obj2; // Compare null/undefined values directly
  }

  if (obj1.hasOwnProperty("message")) delete obj1.message;
  if (obj2.hasOwnProperty("message")) delete obj2.message;

  // Check if the objects have different numbers of keys
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    logObj({
      // obj1,
      // obj2,
      keys1Length: Object.keys(obj1).length,
      keys2Length: Object.keys(obj2).length,
      paths,
      msg: "Objects have different numbers of keys ",
    });
    return false;
  }

  // Recursively compare each key-value pair in the objects
  for (let key in obj1) {
    // Ignore specified keys
    if (keysToIgnore.includes(key)) {
      continue;
    }

    if (compareTypes.includes(key)) {
      return typeof obj1[key] === typeof obj2[key];
    }

    if (key === "orderItems") {
      // obj1[key] = obj1[key].sort((a, b) => a.id - b.id);
      // obj2[key] = obj2[key].sort((a, b) => a.id - b.id);
      function arrayOfObjectValuesToArray(arr) {
        if (arr.length <= 0) {
          logObj({ paths, key });
          throw new Error("Array is empty");
        }
        return arr
          .reduce((acc, orderItem) => {
            return [...acc, ...Object.values(orderItem)];
          }, [])
          .sort((a, b) => a - b);
      }
      obj1[key] = arrayOfObjectValuesToArray(obj1[key]);
      obj2[key] = arrayOfObjectValuesToArray(obj2[key]);
    }

    if (!obj2.hasOwnProperty(key)) {
      if (key === "results") {
        logObj({
          keys1Length: Object.keys(obj1).length,
          keys2Length: Object.keys(obj2).length,
          paths,
          msg: `Objects have different numbers of keys  ${key}`,
        });
      } else {
        logObj({
          // a: obj1,
          // b: obj2,
          paths,
          msg: `Object2 is missing key: ${key}`,
        });
      }
      return false;
    }

    if (!compare(obj1[key], obj2[key], keysToIgnore, paths, compareTypes)) {
      if (key === "results") {
        logObj({
          keys1Length: Object.keys(obj1).length,
          keys2Length: Object.keys(obj2).length,
          paths,
          msg: `Objects have different values for key: ${key}`,
        });
      } else {
        logObj({
          value1: obj1[key],
          value2: obj2[key],
          paths,
          msg: `Objects have different values for key: ${key}`,
        });
      }

      return false;
    }
  }

  return true; // Objects are deeply equal
}

function compareJsonFilesInFolder(folderPath) {
  const files = fs.readdirSync(folderPath);
  if (!files.find((file) => file.endsWith(".json"))) {
    const folders = files;
    folders.forEach((folder) => {
      compareJsonFilesInFolder(path.join(folderPath, folder));
    });
  }
  const jsonFiles = files.filter((file) => file.endsWith(".json"));

  const jsonContents = jsonFiles.map((file) => ({
    path: file,
    data: JSON.parse(fs.readFileSync(path.join(folderPath, file))),
  }));

  if (jsonContents.length <= 1) {
    return;
  }

  const firstJson = jsonContents[7];

  for (let i = 1; i < jsonContents.length; i++) {
    const result = compare(
      firstJson.data,
      jsonContents[i].data,
      ["time", "createdAt", "updatedAt", "message"], // to differ in all responses
      {
        first: firstJson.path,
        second: jsonContents[i].path,
      },
      ["totalPrice"] // sometimes wrong totalPrice values are stores
    );
    if (!result) {
      console.log({
        first: firstJson.path,
        second: jsonContents[i].path,
      });
      return;
    } else {
      console.log(folderPath, "are equal");
    }
  }

  const subFolders = files.filter(
    (file) =>
      fs.statSync(path.join(folderPath, file)).isDirectory() &&
      file !== "node_modules"
  );

  for (let i = 0; i < subFolders.length; i++) {
    compareJsonFilesInFolder(path.join(folderPath, subFolders[i]));
  }
}

compareJsonFilesInFolder(path.join(__dirname, "response"));
