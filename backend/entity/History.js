import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "History",
  tableName: "history",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    exhibit_id: {
      type: "int",
      nullable: true,
    },
    province_id: {
      type: "int", 
      nullable: true,
    },
    district_id: {
      type: "int",
      nullable: true,
    },
    subdistrict_id: {
      type: "int",
      nullable: true,
    },
    house_no: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    village_no: {
      type: "varchar",
      length: 10,
      nullable: true,
    },
    alley: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    road: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    place_name: {
      type: "text",
      nullable: true,
    },
    date: {
      type: "date",
      nullable: true,
    },
    time: {
      type: "time",
      nullable: true,
    },
    latitude: {
      type: "float",
      nullable: true,
    },
    longitude: {
      type: "float",
      nullable: true,
    },
    confidence_percentage: {
      type: "decimal",
      precision: 5,
      scale: 2,
      nullable: true,
    },
    image_url: {
      type: "text",
      nullable: true,
    },
  },
  relations: {
    exhibit: {
      type: "many-to-one",
      target: "Exhibit",
      joinColumn: { name: "exhibit_id", referencedColumnName: "id" }
    }
  },
});