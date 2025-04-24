import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "FirearmExampleImage",
  tableName: "firearm_example_images",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    exhibit_id: {
      type: "int",
    },
    image_url: {
      type: "text",
    },
    description: {
      type: "varchar",
      nullable: true,
    },
    uploaded_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    priority: {
      type: "int",
      nullable: true,
    },
  },
  relations: {
    exhibit: {
      type: "many-to-one",
      target: "Exhibit",
      joinColumn: { name: "exhibit_id", referencedColumnName: "id" },
      inverseSide: "images",
      onDelete: "CASCADE",
    },
  },
});