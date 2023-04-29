import Airtable from "airtable";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_KEY);

const table = base("Coffee Stores");

const createCoffeeStore = async (req, res) => {
  // find a record

  const { id, name, address, locality, imgUrl, voting } = req.body;

  try {
    if (id) {
      const findCoffeeStoreRecords = await table
        .select({
          filterByFormula: `id="${id}"`,
        })
        .firstPage();

      if (findCoffeeStoreRecords.length !== 0) {
        const records = findCoffeeStoreRecords.map((record) => {
          return { ...record.fields };
        });

        res.json(records);
      } else {
        // create a record
        if (id && name) {
          const createRecords = await table.create([
            {
              fields: {
                id,
                name,
                address,
                locality,
                voting,
                imgUrl,
              },
            },
          ]);

          const records = createRecords.map((record) => {
            return { ...record.fields };
          });

          res.json({ records });
        } else {
          res.status(400);
          res.json({ message: "Name Is Missing" });
        }
      }
    } else {
      res.status(400);
      res.json({ message: "Id Is Missing" });
    }
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ message: "something went wrong" });
  }
};

export default createCoffeeStore;
