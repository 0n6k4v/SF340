import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Firearm",
  tableName: "firearms",
  columns: {
    exhibit_id: {
      primary: true,
      type: "int",
    },
    mechanism: {
      type: "varchar",
      length: 255,
    },
    brand: {
      type: "varchar",
      length: 255,
    },
    series: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    model: {
      type: "varchar",
      length: 255,
    },
    normalized_name: {
      type: "text",
      nullable: true,
    },
  },
  relations: {
    exhibit: {
      type: "one-to-one",
      target: "Exhibit",
      joinColumn: { name: "exhibit_id", referencedColumnName: "id" },
      inverseSide: "firearm",
    },
  },
});