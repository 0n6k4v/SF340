import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Exhibit",
  tableName: "exhibits",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    category: {
      type: "varchar",
    },
    subcategory: {
      type: "varchar",
    },
  },
  relations: {
    firearm: {
      type: "one-to-one",
      target: "Firearm",
      inverseSide: "exhibit",
      joinColumn: { name: "id", referencedColumnName: "exhibit_id" },
    },
    images: {
      type: "one-to-many",
      target: "FirearmExampleImage",
      inverseSide: "exhibit",
      joinColumn: { name: "id", referencedColumnName: "exhibit_id" },
    },
  },
});