import { findRecordByFilter, table } from "@/lib/airtable";

const createCoffeeStore = async (req, res) => {
  const { id, name, address, locality, imgUrl, voting } = req.body;

  try {
    if (id) {
      const records = await findRecordByFilter(id);

      if (records.length !== 0) {
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

          const records = getMinifiedRecords(createRecords);

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
    res.status(500);
    res.json({ message: "something went wrong" });
  }
};

export default createCoffeeStore;
