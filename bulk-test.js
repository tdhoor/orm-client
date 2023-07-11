async function test() {
  const customers = Array.from({ length: 10000 }).map((_, i) => ({
    email: `email-${i}@mail.com`,
    phone: `1234567890${i}`,
    password: `password${i}`,
    firstName: `First Name ${i}`,
    lastName: `Last Name ${i}`,
  }));

  const response = await fetch("http://localhost:3000/api/customer/bulk", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customers),
  });
  const r = await response.json();
  console.log(r);
  return r;
}

async function reset() {
  await fetch("http://localhost:3000/api/seed/reset");
}

async function main(framework, db, max, method) {
  await reset();
  const results = [];
  for (let i = 0; i < 20; i++) {
    console.log(i);
    const result = await test();
    results.push(result);
  }
  await reset();

  console.log(results);
  console.log({
    framework,
    db,
    method,
    mean:
      results.reduce((p, c) => {
        return p + c.time;
      }, 0) / results.length,
    max,
  });
}

main("typeORM", "mssql", "maxBatchSize", "save");
